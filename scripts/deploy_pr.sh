#!/bin/bash

function deploy_app_pr {
  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$PR_NUMBER"
  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"
  APP_BUCKET_NAME=$(echo $1 | sed 's/[^a-zA-Z0-9]//g')
  APP_PATH="./apps/$1/build"
  
  # Deploy app project
  aws s3 sync $APP_PATH s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/$1 --delete
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "Running the script"
  for file in ./apps/*/; do
    if [[ -d "$file" && ! -L "$file" ]]; then
      app="$(echo $file | cut -d '/' -f 3)"
      deploy_app_pr $app
    fi; 
  done
fi