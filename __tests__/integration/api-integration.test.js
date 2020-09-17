const {beforeAll, test, expect} = require("@jest/globals"),
    AWS = require("aws-sdk"),
    https = require('https')

let apiEndpoint

beforeAll(async () => {
    const stackName = process.env.hasOwnProperty('STACK_NAME')
        ? process.env['STACK_NAME']
        : `coffee-store-${process.env['USER']}`
    console.log(`Looking for API Gateway in stack [${stackName}]`)

    const cloudformationStacks = await new AWS.CloudFormation().describeStacks({StackName: stackName}).promise()
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
