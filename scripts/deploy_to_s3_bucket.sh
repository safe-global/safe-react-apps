#!/bin/bash

function deploy_app {
  BUNDLE_FOLDER="build"

  PACKAGE_VERSION=$(sed -nr 's/^\s*\"version": "([0-9]{1,}\.[0-9]{1,}.*)",$/\1/p' package.json)
  
  if [ -n "$APPEND_TAG" ]
  then
    aws s3 sync $BUNDLE_FOLDER s3://${BUCKET_NAME}/$1/"$PACKAGE_VERSION" --delete
  else
    aws s3 sync $BUNDLE_FOLDER s3://${BUCKET_NAME}/$1 --delete
  fi
}

# Only:
# - Releases
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$BUCKET_NAME" ]
then
  echo "Executing in $(pwd)"
  # app name is the name of the current folder
  APP_NAME="$(basename $(pwd))"
  deploy_app $APP_NAME
else
  echo "[ERROR] App could not be deployed because of missing environment variables"
  exit 1
fi