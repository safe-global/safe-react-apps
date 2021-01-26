#!/bin/bash

function deploy_app_pr {
  REVIEW_ENVIRONMENT_DOMAIN='review.gnosisdev.com'
  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$PR_NUMBER"
  # Only alphanumeric characters. Example pm-trading-ui -> pmtradingui
  REPO_NAME_ALPHANUMERIC=$(echo $REPO_NAME_SLUG | sed 's/[^a-zA-Z0-9]//g')

  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"

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