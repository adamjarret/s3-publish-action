const { getInput } = require('@actions/core');
const { aliases, isBooleanArg } = require('s3-publish');

function toBool(value) {
  return Boolean(parseInt(value, 10));
}

function argReducer(agg, key) {
  const value = getInput(key);

  if (key === 'go') {
    agg[key] = value === '' ? true : toBool(value);
    return agg;
  }

  if (value === '') {
    return agg;
  }

  if (isBooleanArg(key)) {
    agg[key] = Boolean(parseInt(value, 10));
    return agg;
  }

  switch (key) {
    case 'limitCompares':
    case 'limitRequests': {
      const num = parseInt(value, 10);
      if (!isNaN(num)) {
        agg[key] = num;
      }
      break;
    }

    case 'originIgnore':
    case 'targetIgnore':
      agg[key] = JSON.parse(value);
      break;

    default:
      agg[key] = value;
      break;
  }

  return agg;
}

module.exports = () => Object.keys(aliases).reduce(argReducer, { _: ['sync'] });
