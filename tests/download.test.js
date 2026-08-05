'use strict';
// /api/download の挙動:
//   - 302 でPDFへリダイレクトし、応答後に asset_downloads へ記録する
//   - 計測がダウンロードを妨げない（DB障害でもリダイレクトは成立）
const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { createMemoryDb } = require('./helpers/memory-db');

// api/download.js を require する前に依存を差し替える
const memoryDb = createMemoryDb();
let dbShouldThrow = false;
const dbPath = require.resolve('../lib/db');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: {
    getDb: () => ({
      query: (text, params) => {
        if (dbShouldThrow) return Promise.reject(new Error('db down'));
        return memoryDb.query(text, params);
      },
    }),
  },
};
const pending = [];
const vfPath = require.resolve('@vercel/functions');
require.cache[vfPath] = {
  id: vfPath, filename: vfPath, loaded: true,
  exports: { waitUntil: (p) => { pending.push(Promise.resolve(p).catch(() => {})); } },
};
const handler = require(path.join('..', 'api', 'download.js'));

function makeRes() {
  const res = {
    statusCode: 200, headers: {}, ended: false,
    status(c) { res.statusCode = c; return res; },
    setHeader(k, v) { res.headers[k.toLowerCase()] = v; return res; },
    json(o) { res.body = o; res.ended = true; },
    end() { res.ended = true; },
  };
  return res;
}

async function call(query) {
  const res = makeRes();
  await handler({ method: 'GET', url: `/api/download?${query}` }, res);
  await Promise.all(pending.splice(0));
  return res;
}

const LID = '123e4567-e89b-42d3-a456-426614174000';

test('302でPDFへリダイレクトし、asset/lead/source が記録される', async () => {
  const res = await call(`asset=pr-planning-template&src=mail&lid=${LID}`);
  assert.strictEqual(res.statusCode, 302);
  assert.ok(res.headers['location'].endsWith('.pdf'), 'PDF実体へ');
  const d = memoryDb.downloads[memoryDb.downloads.length - 1];
  assert.strictEqual(d.asset_id, 'pr-planning-template');
  assert.strictEqual(d.lead_id, LID);
  assert.strictEqual(d.source, 'mail');
});

test('lid が不正でも記録は落とし、DLは成立する', async () => {
  const res = await call('asset=pr-planning-template&src=thanks&lid=not-a-uuid');
  assert.strictEqual(res.statusCode, 302);
  const d = memoryDb.downloads[memoryDb.downloads.length - 1];
  assert.strictEqual(d.lead_id, null);
  assert.strictEqual(d.source, 'thanks');
});

test('src が想定外なら other として記録する', async () => {
  await call('asset=pr-planning-template&src=twitter');
  const d = memoryDb.downloads[memoryDb.downloads.length - 1];
  assert.strictEqual(d.source, 'other');
});

test('不明な資料IDは /request/ へ誘導し、記録しない', async () => {
  const before = memoryDb.downloads.length;
  const res = await call('asset=no-such-asset');
  assert.strictEqual(res.statusCode, 302);
  assert.strictEqual(res.headers['location'], '/request/');
  assert.strictEqual(memoryDb.downloads.length, before);
});

test('DB障害でもリダイレクトは成立する（計測がDLを妨げない）', async () => {
  dbShouldThrow = true;
  const res = await call('asset=pr-planning-template&src=material');
  dbShouldThrow = false;
  assert.strictEqual(res.statusCode, 302);
  assert.ok(res.headers['location'].endsWith('.pdf'));
});
