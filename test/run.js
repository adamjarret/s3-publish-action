const { promises: fs } = require('fs');
const { resolve: resolvePath } = require('path');
const { rootA, rootB } = require('./lib/constants');
const genRoot = require('./lib/genRoot');
const createAction = require('./test.createAction');
const parseInputs = require('./test.parseInputs');

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

async function empty(dirPath) {
  const files = await fs.readdir(dirPath);
  for (const file of files) {
    await fs.unlink(resolvePath(dirPath, file));
  }
}

async function setup() {
  // Create fixures
  await genRoot(rootA);
  await fs.mkdir(rootB, { recursive: true });

  // Cleanup target
  await empty(rootB);
}

async function teardown() {
  const roots = [rootA, rootB];
  for (let r = 0; r < roots.length; r++) {
    await empty(roots[r]);
  }
}

async function runAll() {
  await setup();

  for (let i = 0; i < tests.length; i++) {
    const { name, run } = tests[i];
    try {
      console.log(name);
      await run();
    } catch (error) {
      console.error('FAIL', error);
      process.exit(1);
    }
  }

  await teardown();
}

//
// LOAD TESTS

createAction(test);
parseInputs(test);

//
// RUN TESTS

runAll();
