const { ok, strictEqual, deepEqual } = require('assert');
const { fork } = require('child_process');
const { dump } = require('./lib/constants');

module.exports = (test) => {
  test('parseInputs: numeric', () => {
    return new Promise((resolve) => {
      let called = false;
      const n = fork(dump, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_LIMITCOMPARES: '1'
        }
      });
      n.on('message', (message) => {
        called = true;
        deepEqual(message, {
          _: ['sync'],
          go: true,
          limitCompares: 1
        });
      });
      n.on('close', (code) => {
        ok(called);
        strictEqual(code, 0, `Unexpected exit code ${code}`);
        resolve();
      });
    });
  });

  test('parseInputs: numeric (invalid)', () => {
    return new Promise((resolve) => {
      let called = false;
      const n = fork(dump, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_LIMITCOMPARES: 'blah'
        }
      });
      n.on('message', (message) => {
        called = true;
        deepEqual(message, {
          _: ['sync'],
          go: true
        });
      });
      n.on('close', (code) => {
        ok(called);
        strictEqual(code, 0, `Unexpected exit code ${code}`);
        resolve();
      });
    });
  });
};
