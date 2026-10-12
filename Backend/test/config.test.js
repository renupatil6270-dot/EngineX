const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const backendDirectory = path.resolve(__dirname, '..');

test('configuration rejects missing secrets instead of using fallbacks', () => {
  assert.throws(
    () => execFileSync(process.execPath, ['-e', "delete process.env.MONGODB_URI; delete process.env.JWT_SECRET; require('./config')"], {
      cwd: backendDirectory,
      encoding: 'utf8',
    }),
    /MONGODB_URI is required/,
  );
});

test('configuration reads deployment values and AI timeout', () => {
  const output = execFileSync(
    process.execPath,
    ['-e', "const c=require('./config'); console.log(JSON.stringify({port:c.port, timeout:c.aiServiceTimeoutMs, origin:c.frontendOrigin}))"],
    {
      cwd: backendDirectory,
      encoding: 'utf8',
      env: {
        ...process.env,
        MONGODB_URI: 'mongodb://localhost/test',
        JWT_SECRET: 'test-secret',
        PORT: '5050',
        AI_SERVICE_TIMEOUT_MS: '2500',
        FRONTEND_ORIGIN: 'http://example.test',
      },
    },
  );
  const jsonLine = output.trim().split(/\r?\n/).find((line) => line.startsWith('{'));
  assert.deepEqual(JSON.parse(jsonLine), {
    port: 5050,
    timeout: 2500,
    origin: 'http://example.test',
  });
});
