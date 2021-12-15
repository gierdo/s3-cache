const core = require('@actions/core');
const github = require('@actions/github');
const Authentication = require('./Authentication.js');
const CacheOperation = require('./CacheOperation.js');
const process = require('process');

try {

  const access_id = core.getInput('aws-id');
  const secret_key = core.getInput('aws-key');
  const region = core.getInput('aws-region');
  const role = core.getInput('aws-role');
  const roleSessionName = core.getInput('aws-role-session-name');
  const externalId = core.getInput('aws-role-external-id');

  const bucket_root = core.getInput('s3-bucket-root');
  const filename = core.getInput('zip-filename');
  const bucket_dir = core.getInput('bucket_dir');
  const cache_key = core.getInput('cache_key');
  const dir_to_cache = core.getInput('dir-to-cache');
  const dir_to_unzip = core.getInput('dir-to-unzip');


  function cacheAction(connection) {
    const cacheOperation = new CacheOperation(connection, bucket_root, bucket_dir, cache_key, filename, dir_to_cache, dir_to_unzip);
    cacheOperation.retrieveCache().then((result) => {
      console.log(`RESULT = ${result.operation}`);
      core.debug(`RESULT = ${result.operation}`);
      core.saveState("operation", result.operation);
      console.log('Save State operation OK');
      core.setOutput('operation', result.operation);
    }, function (err) {
      core.error(err);
      core.saveState("operation", "failed")
      core.setFailed(err);
      process.exit(1);
    })
  }

  console.log(`index linha 40`);
  const auth = new Authentication(access_id, secret_key, region)
  console.log(`index linha 42`);
  console.log(access_id);
  if (access_id != '' && access_id) {
    console.log(`index linha 45`);
    auth.login(role, roleSessionName, externalId).then((connection) => {
      console.log(`index linha 47`);
      cacheAction(connection);
    })
  } else {
    console.log(`index linha 51`);
    cacheAction(Authentication.emptyConnector());
  }
} catch (error) {
  console.log(`index linha 55`);
  core.saveState("operation", "failed")
  core.setFailed(error);
  console.log(error);
  process.exit(1);
}