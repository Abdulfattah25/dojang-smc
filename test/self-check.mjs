import assert from 'node:assert';
import { validateImageMagicBytes, validateRegistrationPayload } from '../functions/services/validation.js';
import { hashPassword, verifyPassword, signJwt, verifyJwt } from '../functions/services/auth.js';
import { getWitaDate, getWitaISOString, getWitaMonthPrefix } from '../functions/api/[[route]].js';
import { formatWitaDate, formatWitaDateTime, getWitaToday } from '../src/utils/date.js';

async function runSelfChecks() {
  console.log('--- Starting Ponytail Self-Check Suite ---');

  // 1. Magic Bytes Validation
  // Invalid header
  assert.throws(() => {
    validateImageMagicBytes(new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]).buffer);
  }, /Format berkas tidak valid/);

  // JPEG Header
  const jpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]).buffer;
  assert.strictEqual(validateImageMagicBytes(jpegHeader), 'jpg');

  // PNG Header
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D]).buffer;
  assert.strictEqual(validateImageMagicBytes(pngHeader), 'png');

  // WebP Header
  const webpHeader = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]).buffer;
  assert.strictEqual(validateImageMagicBytes(webpHeader), 'webp');
  console.log('✓ 1. Magic Bytes verification passed.');

  // 2. Payload Validation
  const validPayload = {
    full_name: 'Budi Santoso',
    birth_date: '2012-05-14',
    gender: 'Laki-laki',
    phone_number: '08123456789',
    address: 'Jl. Merdeka No. 10',
    belt_rank: 'Putih'
  };
  const valRes = validateRegistrationPayload(validPayload);
  assert.strictEqual(valRes.isValid, true);

  const invalidPayload = { full_name: 'A' };
  assert.strictEqual(validateRegistrationPayload(invalidPayload).isValid, false);
  console.log('✓ 2. Registration payload validation passed.');

  // 3. PBKDF2 Password Hashing & Verification
  const testPw = 'SatriaMuda2026!';
  const hashed = await hashPassword(testPw);
  assert.ok(hashed.startsWith('pbkdf2:'));
  assert.strictEqual(await verifyPassword(testPw, hashed), true);
  assert.strictEqual(await verifyPassword('wrong-password', hashed), false);

  // Verify seeded admin password
  const seedHash = 'pbkdf2:4f6d92aaaa4990804b53773cdae679c3:100000:6f4ac33b6a1f34ca21b6964cb42a73837adc9a8834ffea869e2f3715fd61652f';
  assert.strictEqual(await verifyPassword('admin123', seedHash), true);
  console.log('✓ 3. PBKDF2 hash & verify passed (including default admin123).');

  // 4. JWT Sign & Verify
  const secret = 'test-secret-key-12345';
  const token = await signJwt({ id: 1, username: 'admin', role: 'superadmin' }, secret, 3600);
  assert.strictEqual(typeof token, 'string');
  assert.strictEqual(token.split('.').length, 3);

  const decoded = await verifyJwt(token, secret);
  assert.ok(decoded);
  assert.strictEqual(decoded.username, 'admin');
  assert.strictEqual(decoded.role, 'superadmin');

  // Tampered token
  const tamperedToken = token.slice(0, -4) + 'abcd';
  const tamperedDecoded = await verifyJwt(tamperedToken, secret);
  assert.strictEqual(tamperedDecoded, null);

  // Wrong secret
  const wrongSecretDecoded = await verifyJwt(token, 'other-secret');
  assert.strictEqual(wrongSecretDecoded, null);
  console.log('✓ 4. JWT signature generation & tamper detection passed.');

  // 5. Timezone UTC+8 (WITA / Makassar) Helper Verification
  const refUtcDate = new Date('2026-05-14T16:30:00.000Z'); // 16:30 UTC -> 00:30 next day WITA
  const witaDate = getWitaDate(refUtcDate);
  assert.strictEqual(witaDate.getUTCHours(), 0); // 16 + 8 = 24 = 0h next day
  assert.strictEqual(witaDate.getUTCDate(), 15); // Rolled over to 15th
  
  const witaIso = getWitaISOString(refUtcDate);
  assert.ok(witaIso.includes('+08:00'));
  assert.ok(witaIso.startsWith('2026-05-15T00:30:00.000+08:00'));

  const monthPrefix = getWitaMonthPrefix(refUtcDate);
  assert.strictEqual(monthPrefix.year, 2026);
  assert.strictEqual(monthPrefix.month, '05');
  assert.strictEqual(monthPrefix.ym, '202605');
  assert.strictEqual(monthPrefix.ymDash, '2026-05');
  console.log('✓ 5. Timezone UTC+8 (WITA / Makassar) logic passed.');

  // 6. Sequential Registration Code Increment Logic
  const samplePrefix = 'REG-202605-';
  const sampleCodes = ['REG-202605-0001', 'REG-202605-0042', 'REG-202605-0999'];
  for (const c of sampleCodes) {
    const lastNum = parseInt(c.slice(samplePrefix.length), 10);
    const nextCode = `${samplePrefix}${String(lastNum + 1).padStart(4, '0')}`;
    assert.strictEqual(nextCode.startsWith(samplePrefix), true);
    assert.strictEqual(parseInt(nextCode.slice(samplePrefix.length), 10), lastNum + 1);
  }
  console.log('✓ 6. Sequential registration code generation logic passed.');

  // 7. Document Key Path Traversal Security Regex
  const docKeyRegex = /^docs\/\d{4}\/\d{2}\/[a-zA-Z0-9_\-\.]+$/;
  const isDemoDocRegex = /^demo-birth-cert-\d+\.jpg$/;
  assert.strictEqual(docKeyRegex.test('docs/2026/05/cert_abc-123.jpg'), true);
  assert.strictEqual(docKeyRegex.test('docs/2026/05/photo_def.png'), true);
  assert.strictEqual(isDemoDocRegex.test('demo-birth-cert-01.jpg'), true);
  assert.strictEqual(docKeyRegex.test('../../../etc/passwd'), false);
  assert.strictEqual(docKeyRegex.test('docs/2026/05/../../secret'), false);
  assert.strictEqual(docKeyRegex.test('docs/2026/5/photo.png'), false);
  assert.strictEqual(isDemoDocRegex.test('demo-birth-cert-evil/../1.jpg'), false);
  console.log('✓ 7. Document key path traversal & validation passed.');

  // 8. Sequence > 999 length sorting & minimum password validation logic
  const codesToSort = ['TKD-202611-999', 'TKD-202611-1000', 'TKD-202611-001'];
  codesToSort.sort((a, b) => (b.length - a.length) || b.localeCompare(a));
  assert.strictEqual(codesToSort[0], 'TKD-202611-1000'); // 1000 properly sorted before 999

  const isValidPw = (pw) => typeof pw === 'string' && pw.trim().length >= 6;
  assert.strictEqual(isValidPw('12345'), false);
  assert.strictEqual(isValidPw('   '), false);
  assert.strictEqual(isValidPw('admin123'), true);
  console.log('✓ 8. Registration code sequence length sorting & password validation passed.');

  // 9. Centralized Date Formatter
  assert.strictEqual(typeof getWitaToday(), 'string');
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(getWitaToday()));
  assert.strictEqual(formatWitaDate('2026-11-18 06:15:00'), '18/11/2026');
  assert.ok(formatWitaDateTime('2026-11-18 06:15:00').includes('WITA'));
  console.log('✓ 9. Centralized WITA date utilities passed.');

  console.log('All Ponytail self-checks completed successfully! 🥋');
}

runSelfChecks().catch((err) => {
  console.error('Self-check failure:', err);
  process.exit(1);
});
