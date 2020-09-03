# Automation for Continuous Integration (and later, Continuous Deployment)

This directory contains the resources that provide CI (Continuous Integration) automation.
Remember - Continuous Integration is actually [the idea of merging all code to main at least once a day](https://martinfowler.com/articles/continuousIntegration.html).
This tooling just makes validating those merges less time-consuming.

There are all kinds of tools you can use for CI automation, but here I use AWS' CodeBuild. Since we're already using
AWS services and deployment tooling for the application then also using them for CI isn't too much of an extra stretch.

## Prerequisites

The CI template assumes that you have already deployed the
[account-wide-resources](../account-wide-resources/README.md) stack.

Since CI relies on code committed to source control you'll also want to commit your own copy of this repository to your
own Github location. Make sure you have the Github location of your repo available since you'll 
need that in the next step.

I'm going to assume that like me you are using regular Github as your source control. 
If you're using a different source control provider then you'll need to make further changes
to the CodeBuild configuration. 

## How to deploy the CodeBuild Project

CodeBuild is structured into "projects" - configurations that read from a source control location, and then run a
sequence of commands, in a particular environment.
 
First change your copy of [`ci.yaml`](ci.yaml), changing the `SourceLocation`'s `Default` value to your repository's 
location. Push that change up to Github.

To deploy this CodeBuild project make sure you have the AWS CLI and SAM CLI installed, and configured for the
 required account and region, and then run `./deploy-ci.sh` in this `automation` directory.

The result of this is that a new CodeBuild project (named `CoffeeStoreCI`) is deployed, contained within 
the `coffee-store-ci` CloudFormation stack.

## How to use the CodeBuild project 

You should be able to find your project in [the CodeBuild section of the AWS Web Console](https://console.aws.amazon.com/codesuite/codebuild/projects).

If you drill down into your project you can start a first build manually by using the _Start build_ button. If this
 works you're all set, otherwise you'll need to fix whatever problems crop up.
 
Once you've validated the build works try committing and pushing a change, and make sure it triggers a build.

If you want to make changes to CodeBuild there are two different types of activity:

* If you want to change _what commands are run as part of a build_, then edit the [`ci-buildspec`](ci-buildspec.yaml) or
whatever scripts it calls. To apply these changes simply push them to Github, and CodeBuild will use them on the next
 build.
* If you want to change the configuration of the CodeBuild project itself (e.g. changing something about the
 environment) then edit the [`ci.yaml`](ci.yaml) file, and re-run `deploy-ci.sh`, since changes to the CI
  Cloudformation template will **not** be automatically picked up by CodeBuild.

## PRICING

CodeBuild is not free, but it does include a non-expiring free tier.
The first 100 minutes per month of the type of environment I use here are free, after that you'll need to pay.
Pricing details are [available here](https://aws.amazon.com/codebuild/pricing/).