# Releasing to production

The code is being actively developed on the `development` branch. Pull requests are made against this branch.
Everything merged into this branch should be automatically deployed to:
https://safe-apps.dev.5afe.dev

Once we are ready with what we have on `development` we recommend a code freeze just in case someone else merges a new feature.

### Merge development into main
* Create a PR to merge `development` into `main` and get it approved
* Switch to the main branch and make sure it's up to date:
```
git checkout main
git fetch --all
git reset --hard origin/main
```
* Pull from the development branch
```
git pull origin development
```
* Push:
```
git push
```

### Start deploy workflow
* Once the changes are on `main`, you have to manually run an action on the `main` branch ([Action](https://github.com/safe-global/safe-react-apps/actions/workflows/deployment.yml)). This will create a new branch `main-bump-versions` with changelogs and updated package versions
* Only when run on `main` it will upload the bundles to the DevOps system and have the deployment ready
* This needs to be merged to `main` AND `development`

### Merge main-bump-versions
* Create a PR from `main-bump-versions` to `main` and get it approved
* Switch to the `main` branch and make sure it's up to date:
```
git checkout main
git fetch --all
git reset --hard origin/main
```
* Pull from the `main-bump-versions` branch
```
git pull origin main-bump-versions
```
* Push:
```
git push
```
* Create a PR from `main` to `development` and get it approved
* Switch to the `development` branch and make sure it's up to date:
```
git checkout development
git fetch --all
git reset --hard origin/development
```
* Pull from the `main` branch
```
git pull origin main
```
* Push:
```
git push
```

### Deploy the app
* Once everything is done there should be a new tag added [Tags](https://github.com/safe-global/safe-react-apps/tags)
* Select the Tag (version) you want to have deployed to prod and ping DevOps
