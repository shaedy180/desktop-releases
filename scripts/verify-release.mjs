import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const base = 'https://releases.shaedy.de/casesim/windows';
export function identities(env) {
  assert.match(env.VERSION, /^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$/);
  for (const value of [env.SOURCE_SHA, env.CASESIM_SHA]) assert.match(value, /^[a-f0-9]{40}$/);
  return { version: env.VERSION, desktop: env.SOURCE_SHA, casesim: env.CASESIM_SHA };
}
export function verifyReceipt(receipt, identity) {
  assert.equal(receipt.status, 'published');
  assert.equal(receipt.version, identity.version);
  assert.equal(receipt.desktop_sha, identity.desktop);
  assert.equal(receipt.casesim_sha, identity.casesim);
  assert.equal(receipt.signature_verified, true);
  assert.equal(receipt.signature_version_bound, true);
  const exe = `CaseSim_${identity.version}_x64-setup.exe`;
  assert.deepEqual(Object.keys(receipt.files).sort(), [exe, exe + '.sig', 'latest.json', 'build-info.json', 'SHA256SUMS.txt'].sort());
  for (const hash of Object.values(receipt.files)) assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(receipt.installer_sha256, receipt.files[exe]);
}
export async function verifyGate(identity, request = fetch) {
  const root = `${base}/desktop-v${identity.version}/`;
  for (const url of ['https://releases.shaedy.de/', `${base}/latest.json`, ...[
    `CaseSim_${identity.version}_x64-setup.exe`, `CaseSim_${identity.version}_x64-setup.exe.sig`,
    'latest.json', 'build-info.json', 'SHA256SUMS.txt', '.hidden', 'missing',
  ].map(name => root + name)]) {
    for (const method of ['GET', 'HEAD']) {
      const response = await request(url, { method, redirect: 'manual', signal: AbortSignal.timeout(20000),
        headers: { Range: 'bytes=0-0', 'User-Agent': 'CaseSim-Updater-release-verification',
          'Remote-User': 'invalid-fixture', 'X-Forwarded-Host': 'invalid.example', 'X-Forwarded-Proto': 'http', 'X-Forwarded-Uri': '/' } });
      try {
        assert.equal(response.status, 302, `Anonymous release access must redirect (${method} ${url})`);
        const location = new URL(response.headers.get('location'));
        assert.equal(location.origin, 'https://auth.shaedy.de');
        assert.equal(location.pathname, '/login');
        assert.equal(location.searchParams.get('return'), url);
        assert.match(response.headers.get('cache-control'), /\bprivate\b/);
        assert.match(response.headers.get('cache-control'), /\bno-store\b/);
      } finally { await response.body?.cancel(); }
    }
  }
  const denied = await request(`${base}/latest.json`, { redirect: 'manual', signal: AbortSignal.timeout(20000), headers: { Authorization: 'Bearer invalid-release-verification-fixture' } });
  try {
    assert.equal(denied.status, 401, 'Invalid native grant must fail without a redirect');
    assert.match(denied.headers.get('cache-control'), /\bno-store\b/);
  } finally { await denied.body?.cancel(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const identity = identities(process.env);
  if (process.argv[2] === '--receipt') {
    verifyReceipt(JSON.parse(readFileSync(process.argv[3], 'utf8')), identity);
  } else assert.equal(process.argv[2], '--gate');
  await verifyGate(identity);
  console.log('Authenticated release gate verified; anonymous download is blocked.');
}
