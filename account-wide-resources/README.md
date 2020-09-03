# Account-wide resources

This template should only be deployed once per AWS sub-account / region.
Because of this I would normally put it in a separate repo but I'm keeping it here in this repo for ease of
 demonstration.

## What this template does

This template deploys a CloudFormation stack that provides a number of resources that are available to all other stacks within the AWS account. These resources are 

* An S3 bucket that is used for temporary artifacts during CloudFormation deployment
  * The bucket is named `cloudformation-artifacts-$AccountID-$Region`, with the correct values for `$AccountID
  ` and `$Region`
  * The bucket name is also in [CloudFormation Export](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-exports.html) `CloudformationArtifactsBucket`
  * The bucket has a lifecycle configuration to delete artifacts after a week. If you need to store artifacts for longer (e.g. if you're storing Glue ETL scripts) then use a different bucket for those artifacts, or change the lifecycle configuration.
* A [Secrets Manager](https://aws.amazon.com/secrets-manager/) secure string containing a Github personal access token, intended for use by CodeBuild and CodePipeline
  * Secret name is `github-token`
* A [CodeBuild Source Credential](https://docs.aws.amazon.com/codebuild/latest/APIReference/API_SourceCredentialsInfo.html) to enable connecting a CodeBuild project to Github.
Once created, this doesn't appear explicitly in the AWS web console, 
but you can see it by running `aws codebuild list-source-credentials`. The credential uses the `github-token` secret also created in the stack.

## Prerequisite

Before deploying this template you'll need a Github personal access token suitable for use by CodeBuild and CodePipeline.

* The Github docs for doing this [are here](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
* The specific permissions that the token requires are [described here](https://docs.aws.amazon.com/codebuild/latest/userguide/sample-access-tokens.html) - in summary I use `repo` and `admin:repo_hook` .

If you are using a source control provider other than Github then skip this step, and delete the associated resources
in the template.

## Deploying

Make sure you have the AWS CLI and SAM CLI installed, and configured for the required account and region.

Then, if on Linux or a Mac, run this command in this `account-wide-resources` directory:

```
% ./deploy.sh YOUR_GITHUB_PERSONAL_ACCESS_TOKEN
```

If on Windows then perform the same `sam deploy` command that is in the [`deploy.sh`](deploy.sh) script.

**The Github personal access token is sensitive and should never be checked into source control.**

Strictly speaking you only need the AWS CLI (not the SAM CLI) to deploy this template, but I like using the SAM CLI
 since it has better console output.

## PRICING

This template uses AWS Secrets Manager, which is only free for 30 days. After that it will cost a small amount, typically less than 50c / month. For more details see https://aws.amazon.com/secrets-manager/pricing/ .

If you prefer not to use use Secrets Manager to manage the Github secret you have a number of other options, but will need to change the coffee store CI/CD templates.