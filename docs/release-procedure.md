# Releasing to production

The code is being actively developed on the `development` branch. Pull requests are made against this branch.
Everything merged into this branch should be automatically deployed to:
https://safe-apps.dev.5afe.dev

Once we are ready with what we have on `development` we recommend a code freeze just in case someone else merges a new feature.

* Create a PR to merge `development` into `main`
* Once the changes are on `main`, an action will create a new branch `main-bump-versions` creating the changelogs that will need to be merged to `main` AND `development`
* After that an action has to be manually run on the `main` branch ([Action](https://github.com/safe-global/safe-react-apps/actions/workflows/deployment.yml))
* Only when run on `main` it will upload the bundles to the DevOps system and have the deployment ready