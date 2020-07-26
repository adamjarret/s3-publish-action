const { resolve: resolvePath } = require('path');

const fixtures = resolvePath(__dirname, '..', 'fixtures');

module.exports = {
  fixtures,
  cwdA: resolvePath(fixtures, 'cwd-a'),
  cwdB: resolvePath(fixtures, 'cwd-b'),
  rootA: resolvePath(fixtures, 'root-a'),
  rootB: resolvePath(fixtures, 'root-b'),
  dump: resolvePath(__dirname, 'dumpInputs.js'),
  main: resolvePath(__dirname, '..', '..', 'index.js')
};
