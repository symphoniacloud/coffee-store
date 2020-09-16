#!/bin/sh

set -euo pipefail

STACK_NAME="coffee-store-${USER}"

CLOUDFORMATION_ARTIFACTS_BUCKET=$(aws cloudformation list-exports --query "Exports[?Name==\`CloudformationArtifactsBucket\`].Value" --output text)
if [ -z "$CLOUDFORMATION_ARTIFACTS_BUCKET" ]; then
  echo "Unable to locate Cloudformation Export 'CloudformationArtifactsBucket' - have you setup the account-wide-resources for this account and region?"
  exit 1
fi

echo "Deploying stack $STACK_NAME"
echo "Deploying using Cloudformation artifacts bucket $CLOUDFORMATION_ARTIFACTS_BUCKET"
echo

sam deploy \
        --stack-name $STACK_NAME \
        --s3-bucket $CLOUDFORMATION_ARTIFACTS_BUCKET \
        --template-file template.yaml \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset
