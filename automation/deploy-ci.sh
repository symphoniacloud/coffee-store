#!/bin/sh

set -euo pipefail

sam deploy \
        --stack-name coffee-store-ci \
        --template-file ci.yaml \
        --capabilities CAPABILITY_IAM \
        --no-fail-on-empty-changeset

echo
echo Stack deployed as coffee-store-ci
echo