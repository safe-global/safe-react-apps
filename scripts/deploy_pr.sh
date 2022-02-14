#!/bin/bash

function deploy_app_pr {
  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$PR_NUMBER"
  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"
  # When you execute "yarn run deploy:pr", it runs it in the app folder, so we only need the name of the folder with the bundle
  BUNDLE_FOLDER="build"

  # Deploy app project
  aws s3 sync $BUNDLE_FOLDER s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/$1 --delete
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$REPO_NAME_ALPHANUMERIC" ] && [ -n "$PR_NUMBER" ] && [ -n "$REVIEW_BUCKET_NAME" ]
then
  echo "Executing in $(pwd)"
  # app name is the name of the current folder
  APP_NAME="$(basename $(pwd))"
  deploy_app_pr $APP_NAME
else
  echo "[ERROR] App could not be deployed because of missing environment variables"
  exit 1
fi