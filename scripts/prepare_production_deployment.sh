#!/bin/bash

set -ev

# Only:
# - Security env variables are available.
if [ -n "$PROD_DEPLOYMENT_HOOK_TOKEN" ] && [ -n "$PROD_DEPLOYMENT_HOOK_URL" ]
then
  APP_NAME="$(basename $(pwd))"
  curl --silent --output /dev/null --write-out "%{http_code}" -X POST \
     -F token="$PROD_DEPLOYMENT_HOOK_TOKEN" \
     -F ref=master \
     -F "variables[TRIGGER_RELEASE_APP_NAME]=$APP_NAME" \
      $PROD_DEPLOYMENT_HOOK_URL
else
  echo "[ERROR] Production deployment could not be prepared"
fi
