# Coffee Store

Demo app for [Cloud Coffee Break](https://github.com/symphoniacloud/cloud-coffee-break).

## Running Unit tests

```
% npm install
% npm test
```

## Creating, deploying, calling, and tearing-down

First, make sure you have the prerequisites setup, as described [in the notes for Episode 1](https://github.com/symphoniacloud/cloud-coffee-break/blob/main/episode1/README.md).

Build and Deploy this app as follows:

```
% sam deploy --guided
```

The `--guided` form is useful for beginners since it will walk you through capturing some configuration, which it then saves to a local file. You can use the default answers (just hit enter) apart from the question _HelloWorldFunction may not have authorization defined, Is this okay?_ - to which you must explicitly hit `y`, and enter. For subsequent deployments of the same app, just run `sam deploy` .

If SAM ran successfully then your application is now deployed! To call it, you need to know the URL. You can get that by visiting the API Gateway section of the AWS Web Console at https://console.aws.amazon.com/apigateway - if you don't see your API make sure that the region selector (top right of the page next to "support" is set to the same region as your AWS CLI configuration.) Click on your API and you should be able to see "Invoke URL". If you click on that you should be able to see "Hello World!" output to your browser. Congratulations!

Since this application is available to the public internet you probably want to tear it down when you're done with it. To do so, run the following, changing the stack-name if you used something else in the deployment step:

```
% aws cloudformation delete-stack --stack-name sam-app
```
