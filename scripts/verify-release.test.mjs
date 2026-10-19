import assert from 'node:assert/strict';
import test from 'node:test';
import { identities, verifyReceipt, verifyGate } from './verify-release.mjs';

const identity = identities({ VERSION: '22.7.53', SOURCE_SHA: 'a'.repeat(40), CASESIM_SHA: 'c'.repeat(40) });
const receipt = () => ({ status: 'published', version: identity.version, desktop_sha: identity.desktop, casesim_sha: identity.casesim,
  signature_verified: true, signature_version_bound: true, installer_sha256: 'd'.repeat(64),
  files: Object.fromEntries(['CaseSim_22.7.53_x64-setup.exe', 'CaseSim_22.7.53_x64-setup.exe.sig', 'latest.json', 'build-info.json', 'SHA256SUMS.txt'].map(name => [name, 'd'.repeat(64)])) });
test('receipt requires exact approved identities, signature, installer hash and five file hashes', () => {
  verifyReceipt(receipt(), identity);
  for (const [field, value] of [['status', 'staged'], ['desktop_sha', 'b'.repeat(40)], ['casesim_sha', 'e'.repeat(40)], ['version', '22.7.52'], ['signature_verified', false], ['signature_version_bound', false], ['installer_sha256', 'e'.repeat(64)]]) {
    assert.throws(() => verifyReceipt({ ...receipt(), [field]: value }, identity));
  }
  const missing = receipt(); delete missing.files['build-info.json']; assert.throws(() => verifyReceipt(missing, identity));
  const bad = receipt(); bad.files['latest.json'] = 'invalid'; assert.throws(() => verifyReceipt(bad, identity));
  const extra = receipt(); extra.files['unexpected.exe'] = 'f'.repeat(64); assert.throws(() => verifyReceipt(extra, identity));
});
const gated = async (url, options) => options.headers.Authorization
  ? new Response(null, { status: 401, headers: { 'Cache-Control': 'private, no-store' } })
  : new Response(null, { status: 302, headers: { Location: `https://auth.shaedy.de/login?return=${encodeURIComponent(url)}`, 'Cache-Control': 'private, no-store' } });
test('every anonymous path/method/Range redirects to its exact auth return, invalid bearer fails', async () => {
  let calls = 0;
  await verifyGate(identity, async (url, options) => { calls++; assert.equal(options.redirect, 'manual'); return gated(url, options); });
  assert.equal(calls, 19);
});
test('public bytes, wrong return/host, cache leaks and bearer redirects block publication', async () => {
  for (const replacement of [new Response('public', { status: 200 }),
    new Response(null, { status: 302, headers: { Location: 'https://evil.test/login' } }),
    new Response(null, { status: 302, headers: { Location: 'https://auth.shaedy.de/login?return=https://releases.shaedy.de/other', 'Cache-Control': 'private, no-store' } }),
    new Response(null, { status: 302, headers: { Location: 'https://auth.shaedy.de/login?return=https%3A%2F%2Freleases.shaedy.de%2F', 'Cache-Control': 'public, max-age=999' } })]) {
    await assert.rejects(verifyGate(identity, async () => replacement));
  }
  await assert.rejects(verifyGate(identity, async (url, options) => options.headers.Authorization ? new Response(null, { status: 302 }) : gated(url, options)));
});
