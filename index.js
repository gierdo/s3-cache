const AWS = require('aws-sdk');
const core = require('@actions/core');
const github = require('@actions/github');
const CacheOperation = require('./CacheOperation.js');
const process = require('process');

function getInputAsArray(
  name,
  options
) {
  return core
    .getInput(name, options)
    .split("\n")
    .map((s) => s.trim())
    .filter((x) => x !== "");
}

try {
  const bucket_root = core.getInput('s3-bucket-root');
  const filename = core.getInput('zip-filename');
  const bucket_dir = core.getInput('bucket-dir');
  const cache_key = core.getInput('cache-key');
  const paths_to_cache = getInputAsArray('paths-to-cache');
  const dir_to_unzip = core.getInput('dir-to-unzip');

  const cacheOperation = new CacheOperation(AWS, bucket_root, bucket_dir, cache_key, filename, paths_to_cache, dir_to_unzip);
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
  })
} catch (error) {
  core.saveState("operation", "failed")
  core.setFailed(error);
  console.log(error);
}
