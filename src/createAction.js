const { setFailed: handleError } = require('@actions/core');
const { createCli } = require('s3-publish');
const configLoader = require('./loadConfig');
const parseArgs = require('./parseInputs');

module.exports = async () => {
  try {
    await createCli({
      parseArgs,
      configLoader,
      handleError,
      templatePath: ''
    });
  } catch (error) {
    handleError(error);
  }
};
