const core = require('@actions/core');

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


module.exports = {getInputAsArray, splitStringToArray};
