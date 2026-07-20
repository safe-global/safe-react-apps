#!/bin/bash

set -ev

# Only:
# - GH_TOKEN and PROMOTIONS_REPO are available.
if [ -n "$GH_TOKEN" ] && [ -n "$PROMOTIONS_REPO" ]
then
  APP_NAME="$(basename $(pwd))"
  PACKAGE_VERSION=$(sed -nr 's/^\s*\"version": "([0-9]{1,}\.[0-9]{1,}.*)",$/\1/p' package.json)
  # --ref is required: without it gh resolves the default branch via GraphQL,
  # which the app token (actions:write, metadata:read only) is not allowed to do.
  # A failed dispatch must not fail this script: it runs mid nx-chain, before
  # `git tag -f last-release`, and a hard exit would leave the release half-done.
  # The error annotation stays visible on the run; the promotion can be
  # dispatched manually from safe-production-promotions.
  if ! gh workflow run react-apps-production.yml \
    --repo "$PROMOTIONS_REPO" \
    --ref main \
    -f "app=$APP_NAME" \
    -f "tag=$PACKAGE_VERSION"
  then
    echo "::error::Failed to dispatch production deployment for $APP_NAME $PACKAGE_VERSION"
  fi
else
  echo "::warning::Production deployment could not be prepared: GH_TOKEN or PROMOTIONS_REPO missing"
fi
