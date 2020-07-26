const { resolve: resolvePath } = require('path');
const { randomBytes } = require('crypto');
const { promises: fs } = require('fs');
const { promisify } = require('util');
const { deflate } = require('zlib');

const compress = promisify(deflate);

// The maximum is exclusive and the minimum is inclusive
//  see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

async function writeJunk(filePath) {
  const text = randomBytes(getRandomInt(1000, 100001)).toString('base64');
  const data = await compress(text);

  await fs.writeFile(filePath, data);
}

async function genRoot(rootPath) {
  await fs.mkdir(rootPath, { recursive: true });
  for (const x of Array(5).keys()) {
    const letter = String.fromCharCode('A'.charCodeAt(0) + x);
    const filePath = resolvePath(rootPath, `${letter}.txt.gz`);
    await writeJunk(filePath);
    console.log('Wrote', filePath);
  }
}

module.exports = genRoot;
