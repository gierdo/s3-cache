const core = require('@actions/core');
const path = require('path');
const os = require('os');

function splitStringToArray(string) {
  return string.split("\n")
    .map((s) => s.trim())
    .filter((x) => x !== "");
}

function getInputAsArray(
  name,
  options
) {
  return splitStringToArray(core
    .getInput(name, options));
}

function resolveFilePaths(originalFilePaths) {
  let filePaths = []
  originalFilePaths.forEach(function (originalFilePath) {
    if (originalFilePath.startsWith('~') || originalFilePath === '~') {
      const filePath = originalFilePath.replace('~', os.homedir());
      filePaths.push(filePath);
    } else {
      const filePath = path.resolve(originalFilePath);
      filePaths.push(filePath);
    }
  });

  console.log(filePaths);
  return filePaths;
}

module.exports = {getInputAsArray, splitStringToArray, resolveFilePaths};
