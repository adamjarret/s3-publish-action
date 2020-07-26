const { ok, strictEqual } = require('assert');
const { fork } = require('child_process');
const { promises: fs } = require('fs');
const { resolve: resolvePath } = require('path');
const { main, fixtures, cwdA, cwdB, rootB } = require('./lib/constants');

function stringify(obj) {
  if (typeof obj === 'string' || obj instanceof String) {
    return obj;
  }
  return JSON.stringify(obj, undefined, 2);
}

module.exports = (test) => {
  test('createAction: dry run + onLog + createLogger', () => {
    return new Promise((resolve, reject) => {
      const output = [];
      const n = fork(main, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_CWD: cwdB,
          INPUT_JSON: '1',
          INPUT_GO: '0'
        }
      });
      n.stdout.on('data', (data) => {
        output.push(data);
      });
      n.on('close', (code) => {
        strictEqual(code, 0, `Unexpected exit code ${code}`);

        const out = Buffer.from(output.join('')).toString('utf8');

        const count = (out.match(/"reason": "ADD"/g) || []).length;
        strictEqual(count, 5, `Unexpected count ${count}`);

        ok(out.includes('::set-output name=plan::'));

        ok(out.includes('Creating logger...'));

        const messageCount = (out.match(/Message type/g) || []).length;
        strictEqual(count, 5, `Unexpected messageCount ${messageCount}`);

        fs.readdir(rootB)
          .then((files) => {
            try {
              strictEqual(files.length, 0, `Unexpected file count ${files.length}`);
              resolve();
            } catch (e) {
              reject(e);
            }
          })
          .catch(reject);
      });
    });
  });

  test('createAction: ignore', () => {
    return new Promise((resolve, reject) => {
      const n = fork(main, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_CWD: cwdA,
          INPUT_ORIGINIGNORE: '["D.txt.gz", "E.txt.gz"]'
        }
      });
      n.on('close', (code) => {
        strictEqual(code, 0, `Unexpected exit code ${code}`);

        fs.readdir(rootB)
          .then((files) => {
            try {
              strictEqual(files.length, 3, `Unexpected file count ${files.length}`);
              resolve();
            } catch (e) {
              reject(e);
            }
          })
          .catch(reject);
      });
    });
  });

  test('createAction: copy', () => {
    const output = [];
    return new Promise((resolve, reject) => {
      const n = fork(main, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_CWD: cwdA
        }
      });
      n.stdout.on('data', (data) => {
        output.push(data);
      });
      n.on('close', (code) => {
        strictEqual(code, 0, `Unexpected exit code ${code}`);

        const out = Buffer.from(output.join('')).toString('utf8');
        ok(out.includes('::set-output name=plan::'));
        ok(out.includes('::set-output name=result::'));

        fs.readdir(rootB)
          .then((files) => {
            try {
              strictEqual(files.length, 5, `Unexpected file count ${files.length}`);
              resolve();
            } catch (e) {
              reject(e);
            }
          })
          .catch(reject);
      });
    });
  });

  test('createAction: nothing to do', () => {
    const msgs = [
      {
        type: 'sync:plan:begin'
      },
      '::set-output name=plan::{"type":"sync:plan:result","operations":[],"skippedCount":5,"ignoredCount":0}',
      {
        type: 'sync:plan:result',
        operations: [],
        skippedCount: 5,
        ignoredCount: 0
      }
    ];
    return new Promise((resolve) => {
      const output = [];
      const n = fork(main, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_CWD: cwdA,
          INPUT_JSON: '1'
        }
      });
      n.stdout.on('data', (data) => {
        output.push(data);
      });
      n.on('close', (code) => {
        strictEqual(code, 0, `Unexpected exit code ${code}`);
        strictEqual(
          Buffer.from(output.join('')).toString('utf8'),
          `${msgs.map(stringify).join('\n')}\n`
        );
        resolve();
      });
    });
  });

  test('createAction: non-existent cwd', () => {
    return new Promise((resolve) => {
      const n = fork(main, [], {
        silent: true,
        env: {
          CI: '1',
          INPUT_CWD: resolvePath(fixtures, 'does-not-exist')
        }
      });
      n.on('close', (code) => {
        strictEqual(code, 1, `Unexpected exit code ${code}`);
        resolve();
      });
    });
  });
};
