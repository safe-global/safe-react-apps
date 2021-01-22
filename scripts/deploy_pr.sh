#!/bin/bash

function deploy_app_pr {
  REVIEW_ENVIRONMENT_DOMAIN='review.gnosisdev.com'

  # Pull request number with "pr" prefix
  PULL_REQUEST_NUMBER="pr$(echo $GITHUB_REF | awk 'BEGIN { FS = "/" } ; { print $3 }')"

  # Feature name without all path. Example gnosis/pm-trading-ui -> pm-trading-ui
  REPO_NAME=$(echo "$GITHUB_REPOSITORY" | awk -F / '{print $2}' | sed -e "s/:refs//")
  # Only alphanumeric characters. Example pm-trading-ui -> pmtradingui
  REPO_NAME_ALPHANUMERIC=$(echo $REPO_NAME | sed 's/[^a-zA-Z0-9]//g')

  REVIEW_FEATURE_FOLDER="$REPO_NAME_ALPHANUMERIC/$PULL_REQUEST_NUMBER"
  echo REPO_NAME_ALPHANUMERIC
  echo PULL_REQUEST_NUMBER
  # Deploy app project
  # aws s3 sync build s3://${REVIEW_BUCKET_NAME}/${REVIEW_FEATURE_FOLDER}/$1 --delete
}

function publish_pull_request_urls_in_github {
  REVIEW_FEATURE_URL="https://$PULL_REQUEST_NAME--$REPO_NAME_ALPHANUMERIC.$REVIEW_ENVIRONMENT_DOMAIN/$REACT_APP_NETWORK/app"

  # Using the Issues api instead of the PR api
  # Done so because every PR is an issue, and the issues api allows to post general comments,
  # while the PR api requires that comments are made to specific files and specific commits
  GITHUB_PR_COMMENTS=https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments
  curl -H "Authorization: token ${GITHUB_API_TOKEN}" --request POST ${GITHUB_PR_COMMENTS} --data '{"body":"Travis automatic deployment:\r\n '${REVIEW_FEATURE_URL}' \r\n"}'
}

for file in ../apps/*/; do 
  if [[ -d "$file" && ! -L "$file" ]]; then
    app="$(echo $file | cut -d '/' -f 3)"
  fi; 
done

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_ACCESS_KEY_ID" ]
then
  for file in ../apps/*/; do 
    if [[ -d "$file" && ! -L "$file" ]]; then
      app="$(echo $file | cut -d '/' -f 3)"
      deploy_app_pr app
    fi; 
  done
  # publish_pull_request_urls_in_github
fi