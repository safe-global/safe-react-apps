#!/bin/bash

function deploy_app {
  APP_PATH="./apps/$1/build"
  
  aws s3 sync $APP_PATH s3://${BUCKET_NAME}/$1 --delete
}

# Only:
# - Pull requests
# - Security env variables are available. PR from forks don't have them.
if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
  for file in ./apps/*/; do
    if [[ -d "$file" && ! -L "$file" ]]; then
      app="$(echo $file | cut -d '/' -f 3)"
      deploy_app $app
    fi; 
  done
fi