const {beforeAll, afterAll, test, expect} = require("@jest/globals"),
    AWS = require("aws-sdk"),
    https = require('https'),
    util = require('util'),
    exec = util.promisify(require('child_process').exec)

const cloudFormation = new AWS.CloudFormation()

let stackName
let apiEndpoint

beforeAll(async () => {
    stackName = generateEphemeralStackName()

    console.log(`Starting cloudformation deployment of stack ${stackName}`)
    const { stdout } = await exec(`./deploy.sh ${stackName}`)
    console.log('Deployment finished')
    console.log(stdout)

    const cloudformationStacks = await cloudFormation.describeStacks({StackName: stackName}).promise()
    const apiID = cloudformationStacks
        .Stacks[0]
        .Outputs
        .find(output => output.OutputKey === 'HttpApi')
        .OutputValue

    const apis = await new AWS.ApiGatewayV2().getApis().promise()
    apiEndpoint = apis
        .Items
        .find(api => api.ApiId === apiID)
        .ApiEndpoint

    console.log(`Using Coffee Store API at [${apiEndpoint}]`)
})

function generateEphemeralStackName() {
    const prefix = process.env.hasOwnProperty('STACK_NAME_PREFIX')
        ? process.env['STACK_NAME_PREFIX']
        : `coffee-store-it`
    const now = new Date(),
        year = now.getFullYear(),
        month = twoCharacter(now.getMonth() + 1),
        day = twoCharacter(now.getDate()),
        hours = twoCharacter(now.getHours()),
        minutes = twoCharacter(now.getMinutes()),
        seconds = twoCharacter(now.getSeconds())
    return `${prefix}-${year}${month}${day}-${hours}${minutes}${seconds}`
}

function twoCharacter(number) {
    return number < 10 ? `0${number}` : `${number}`
}

afterAll(async () => {
    console.log(`Calling cloudformation to delete stack ${stackName}`)
    await cloudFormation.deleteStack({StackName: stackName}).promise()
})

test('API should return 200 exit code and expected content', async () => {
    expect(apiEndpoint).toBeDefined()

    const result = await getWithBody(`${apiEndpoint}/`)

    expect(result.statusCode).toBe(200)
    expect(result.body).toBe("Hello World Episode 4!")
})

function getWithBody(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let body = ''
            response.on('data', (chunk) => body += chunk)
            response.on('end', () => resolve({...response, ...{body: body}}))
        }).on('error', reject)
    })}
