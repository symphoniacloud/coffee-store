const {test, expect} = require("@jest/globals"),
        lambda = require('../../src/api.js');

test('lambda function should return expected message', async () => {
    const result = await lambda.handler({});

    const expectedResult = {
        statusCode: 200,
        body : "Hello World Episode 4!"
    };

    expect(result).toEqual(expectedResult);
})
