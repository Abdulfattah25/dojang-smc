import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware, superadminGuard, getCookie } from '../middleware/auth.js';
import { verifyTurnstileToken } from '../middleware/turnstile.js';
import { hashPassword, verifyPassword, signJwt } from '../services/auth.js';
import { validateImageMagicBytes, validateRegistrationPayload, sanitize } from '../services/validation.js';
import { putDocument, getDocument, deleteDocument } from '../services/storage.js';

const app = new Hono().basePath('/api');

// CORS for local development
app.use('*', cors({
  origin: (origin) => origin || '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Timezone UTC+8 (WITA / Makassar) Helper Functions
export function getWitaDate(date = new Date()) {
  return new Date(date.getTime() + (8 * 60 * 60 * 1000));
}

export function getWitaISOString(date = new Date()) {
  const wita = getWitaDate(date);
  return wita.toISOString().replace('Z', '+08:00');
}

export function getWitaMonthPrefix(date = new Date()) {
  const wita = getWitaDate(date);
  const year = wita.getUTCFullYear();
  const month = String(wita.getUTCMonth() + 1).padStart(2, '0');
  return {
    year,
    month,
    ym: `${year}${month}`,
    ymDash: `${year}-${month}`,
  };
}

// Health check
app.get('/health', (c) => c.json({
  status: 'ok',
  time_utc: new Date().toISOString(),
  time_wita: getWitaISOString(),
  timezone: 'UTC+8 (WITA / Makassar)'
}));

// ==========================================================
// 1. PUBLIC REGISTRATION
// ==========================================================
app.post('/register', async (c) => {
  let certKey = null;
  let photoKey = null;

  try {
    const formData = await c.req.formData();
    const fullName = formData.get('full_name');
    const birthDate = formData.get('birth_date');
    const gender = formData.get('gender');
    const phoneNumber = formData.get('phone_number');
    const address = formData.get('address');
    const beltRank = formData.get('belt_rank') || 'Putih';
    const turnstileToken = formData.get('turnstile_token');

    // 1. Verify Turnstile
    const isBotCheckPassed = await verifyTurnstileToken(c, turnstileToken);
    if (!isBotCheckPassed) {
      return c.json({ error: 'Verifikasi Anti-Bot (Turnstile) gagal. Silakan ulangi.' }, 400);
    }

    // 2. Validate payload
    const validation = validateRegistrationPayload({
      full_name: fullName,
      birth_date: birthDate,
      gender,
      phone_number: phoneNumber,
      address,
      belt_rank: beltRank,
    });

    if (!validation.isValid) {
      return c.json({ error: validation.errors[0], errors: validation.errors }, 400);
    }

    // 3. Validate files
    const docBirthCert = formData.get('doc_birth_cert');
    if (!docBirthCert || !(docBirthCert instanceof File) || docBirthCert.size === 0) {
      return c.json({ error: 'Berkas Akta Kelahiran wajib diunggah.' }, 400);
    }

    const birthCertBuffer = await docBirthCert.arrayBuffer();
    let certExt;
    try {
      certExt = validateImageMagicBytes(birthCertBuffer);
    } catch (valErr) {
      return c.json({ error: `Akta Kelahiran: ${valErr.message}` }, 400);
    }

    // Save Birth Cert to R2 with WITA Year/Month Folder
    const now = new Date();
    const { year, month, ym: ymPrefix } = getWitaMonthPrefix(now);
    certKey = `docs/${year}/${month}/${crypto.randomUUID()}.${certExt}`;
    await putDocument(c.env, certKey, birthCertBuffer, docBirthCert.type || 'image/jpeg');

    // Optional doc_photo
    const docPhoto = formData.get('doc_photo');
    if (docPhoto && docPhoto instanceof File && docPhoto.size > 0) {
      const photoBuffer = await docPhoto.arrayBuffer();
      let photoExt;
      try {
        photoExt = validateImageMagicBytes(photoBuffer);
      } catch (photoErr) {
        return c.json({ error: `Pas Foto: ${photoErr.message}` }, 400);
      }
      photoKey = `docs/${year}/${month}/${crypto.randomUUID()}.${photoExt}`;
      await putDocument(c.env, photoKey, photoBuffer, docPhoto.type || 'image/jpeg');
    }

    // 4. Generate Registration Code: TKD-YYYYMM-XXX (Sequential from Highest Existing)
    // Order by length first so 1000+ sorts higher than 999
    const latestMember = await c.env.DB.prepare(
      `SELECT registration_code FROM members WHERE registration_code LIKE ? ORDER BY length(registration_code) DESC, registration_code DESC LIMIT 1`
    ).bind(`TKD-${ymPrefix}-%`).first();

    let nextSequence = 1;
    if (latestMember && latestMember.registration_code) {
      const parts = latestMember.registration_code.split('-');
      const lastSeq = parseInt(parts[2], 10);
      if (!isNaN(lastSeq)) {
        nextSequence = lastSeq + 1;
      }
    }

    let registrationCode = `TKD-${ymPrefix}-${nextSequence.toString().padStart(Math.max(3, String(nextSequence).length), '0')}`;

    // 5. Insert Member into D1 with collision retry protection
    const { full_name, birth_date, gender: vGender, phone_number, address: vAddress, belt_rank: vBelt } = validation.data;
    const witaNowISO = getWitaISOString(now);

    let inserted = false;
    let attempts = 0;
    while (!inserted && attempts < 10) {
      try {
        await c.env.DB.prepare(`
          INSERT INTO members (
            registration_code, full_name, birth_date, gender, phone_number, address,
            belt_rank, registration_status, payment_status, doc_birth_cert_key, doc_photo_key, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).bind(
          registrationCode,
          full_name,
          birth_date,
          vGender,
          phone_number,
          vAddress,
          vBelt,
          certKey,
          photoKey
        ).run();
        inserted = true;
      } catch (insertErr) {
        if (insertErr.message && insertErr.message.includes('UNIQUE constraint failed')) {
          attempts++;
          nextSequence++;
          registrationCode = `TKD-${ymPrefix}-${nextSequence.toString().padStart(Math.max(3, String(nextSequence).length), '0')}`;
        } else {
          throw insertErr;
        }
      }
    }

    return c.json({
      success: true,
      message: 'Pendaftaran berhasil dikirim.',
      registration_code: registrationCode,
      full_name,
      phone_number,
      created_at: witaNowISO
    }, 201);
  } catch (err) {
    console.error('Registration error:', err);
    // Cleanup any uploaded R2 documents if DB insert failed
    if (certKey) {
      try { await deleteDocument(c.env, certKey); } catch (_) {}
    }
    if (photoKey) {
      try { await deleteDocument(c.env, photoKey); } catch (_) {}
    }
    return c.json({ error: err.message || 'Terjadi kesalahan sistem saat memproses pendaftaran.' }, 500);
  }
});

// ==========================================================
// 2. AUTHENTICATION (ADMIN LOGIN / LOGOUT / ME)
// ==========================================================
app.post('/auth/login', async (c) => {
  try {
    const { username, password, turnstile_token } = await c.req.json();
    if (!username || !password) {
      return c.json({ error: 'Username dan password wajib diisi.' }, 400);
    }

    // Turnstile check
    const isBotPassed = await verifyTurnstileToken(c, turnstile_token);
    if (!isBotPassed) {
      return c.json({ error: 'Verifikasi Anti-Bot gagal. Silakan ulangi.' }, 400);
    }

    const cleanUsername = sanitize(username);
    const user = await c.env.DB.prepare(
      `SELECT id, username, password_hash, full_name, role, is_active FROM users WHERE username = ?`
    ).bind(cleanUsername).first();

    if (!user || user.is_active !== 1) {
      return c.json({ error: 'Username atau password salah, atau akun dinonaktifkan.' }, 401);
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return c.json({ error: 'Username atau password salah.' }, 401);
    }

    // Create session JWT
    const secret = c.env.JWT_SECRET || (c.env.ENVIRONMENT === 'development' ? 'smc-secret-key-satria-muda-club-2026-very-secure' : null);
    if (!secret) {
      return c.json({ error: 'JWT_SECRET belum dikonfigurasi pada server produksi.' }, 500);
    }
    const token = await signJwt({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      role: user.role,
    }, secret);

    const isSecure = c.req.url.startsWith('https://');
    const cookieHeader = `tkd_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${isSecure ? '; Secure' : ''}`;

    c.header('Set-Cookie', cookieHeader);

    return c.json({
      success: true,
      token, // Also return in body for mobile client/PWA flex
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Terjadi kesalahan pada sistem autentikasi.' }, 500);
  }
});

app.post('/auth/logout', async (c) => {
  c.header('Set-Cookie', 'tkd_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
  return c.json({ success: true, message: 'Berhasil keluar.' });
});

app.get('/auth/me', authMiddleware, async (c) => {
  const user = c.get('user');
  return c.json({ user });
});

// ==========================================================
// 3. ADMIN DASHBOARD & KPI
// ==========================================================
app.get('/admin/dashboard', authMiddleware, async (c) => {
  try {
    const { ymDash: currentWitaMonth } = getWitaMonthPrefix();

    const [pendingRes, verifiedRes, unpaidRes, paidRevenueRes, recentRes] = await Promise.all([
      c.env.DB.prepare(`SELECT count(*) as count FROM members WHERE registration_status = 'pending'`).first(),
      c.env.DB.prepare(`SELECT count(*) as count FROM members WHERE registration_status = 'verified'`).first(),
      c.env.DB.prepare(`SELECT count(*) as count FROM members WHERE payment_status = 'unpaid'`).first(),
      c.env.DB.prepare(`
        SELECT COALESCE(SUM(payment_amount), 0) as total
        FROM members
        WHERE payment_status = 'paid'
        AND strftime('%Y-%m', payment_date) = ?
      `).bind(currentWitaMonth).first(),
      c.env.DB.prepare(`
        SELECT id, registration_code, full_name, phone_number, belt_rank, registration_status, payment_status, created_at
        FROM members
        ORDER BY id DESC
        LIMIT 5
      `).all()
    ]);

    return c.json({
      metrics: {
        total_pending: pendingRes?.count || 0,
        total_verified: verifiedRes?.count || 0,
        total_unpaid: unpaidRes?.count || 0,
        total_revenue_month: paidRevenueRes?.total || 0,
      },
      recent_applicants: recentRes?.results || [],
      timezone: 'UTC+8 (WITA / Makassar)'
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return c.json({ error: 'Gagal memuat data dashboard.' }, 500);
  }
});

// ==========================================================
// 4. ADMIN APPLICANTS REVIEW
// ==========================================================
app.get('/admin/applicants', authMiddleware, async (c) => {
  try {
    const list = await c.env.DB.prepare(`
      SELECT * FROM members
      WHERE registration_status = 'pending'
      ORDER BY id DESC
    `).all();

    return c.json({ applicants: list.results || [] });
  } catch (err) {
    return c.json({ error: 'Gagal mengambil data pendaftar.' }, 500);
  }
});

app.put('/admin/applicants/:id/verify', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const user = c.get('user');

  try {
    await c.env.DB.prepare(`
      UPDATE members
      SET registration_status = 'verified',
          verified_by = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(user.id, id).run();

    const updated = await c.env.DB.prepare(`SELECT * FROM members WHERE id = ?`).bind(id).first();
    return c.json({ success: true, member: updated });
  } catch (err) {
    return c.json({ error: 'Gagal memverifikasi pendaftar.' }, 500);
  }
});

app.put('/admin/applicants/:id/reject', authMiddleware, async (c) => {
  const id = c.req.param('id');

  try {
    await c.env.DB.prepare(`
      UPDATE members
      SET registration_status = 'rejected',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(id).run();

    return c.json({ success: true, message: 'Pendaftaran ditolak.' });
  } catch (err) {
    return c.json({ error: 'Gagal menolak pendaftar.' }, 500);
  }
});

app.delete('/admin/applicants/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');

  try {
    const member = await c.env.DB.prepare(`SELECT doc_birth_cert_key, doc_photo_key FROM members WHERE id = ?`).bind(id).first();
    if (member) {
      if (member.doc_birth_cert_key) await deleteDocument(c.env, member.doc_birth_cert_key);
      if (member.doc_photo_key) await deleteDocument(c.env, member.doc_photo_key);
    }

    await c.env.DB.prepare(`DELETE FROM members WHERE id = ?`).bind(id).run();
    return c.json({ success: true, message: 'Data pendaftar dan berkas berhasil dihapus.' });
  } catch (err) {
    return c.json({ error: 'Gagal menghapus pendaftar.' }, 500);
  }
});

// ==========================================================
// 5. MASTER MEMBERS CRUD
// ==========================================================
app.get('/admin/members', authMiddleware, async (c) => {
  try {
    const search = c.req.query('search') || '';
    const belt = c.req.query('belt') || '';
    const regStatus = c.req.query('registration_status') || '';
    const payStatus = c.req.query('payment_status') || '';
    const page = Math.max(parseInt(c.req.query('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(c.req.query('limit') || '8', 10), 1), 500);
    const offset = (page - 1) * limit;

    let filterSql = ` WHERE 1=1`;
    const filterParams = [];

    if (search) {
      filterSql += ` AND (full_name LIKE ? OR registration_code LIKE ? OR phone_number LIKE ?)`;
      const term = `%${search}%`;
      filterParams.push(term, term, term);
    }
    if (belt) {
      filterSql += ` AND belt_rank = ?`;
      filterParams.push(belt);
    }
    if (regStatus) {
      filterSql += ` AND registration_status = ?`;
      filterParams.push(regStatus);
    }
    if (payStatus) {
      filterSql += ` AND payment_status = ?`;
      filterParams.push(payStatus);
    }

    const [rowsRes, countRes, statsRes] = await Promise.all([
      c.env.DB.prepare(`SELECT * FROM members${filterSql} ORDER BY id DESC LIMIT ? OFFSET ?`)
        .bind(...filterParams, limit, offset)
        .all(),
      c.env.DB.prepare(`SELECT count(*) as total FROM members${filterSql}`)
        .bind(...filterParams)
        .first(),
      c.env.DB.prepare(`
        SELECT 
          count(*) as total,
          SUM(CASE WHEN registration_status = 'verified' THEN 1 ELSE 0 END) as verified,
          SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
          SUM(CASE WHEN payment_status = 'unpaid' THEN 1 ELSE 0 END) as unpaid
        FROM members
      `).first()
    ]);

    return c.json({
      members: rowsRes.results || [],
      total: countRes?.total || 0,
      stats: {
        total: statsRes?.total || 0,
        verified: statsRes?.verified || 0,
        paid: statsRes?.paid || 0,
        unpaid: statsRes?.unpaid || 0,
      }
    });
  } catch (err) {
    return c.json({ error: 'Gagal mengambil data anggota.' }, 500);
  }
});

app.put('/admin/members/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    await c.env.DB.prepare(`
      UPDATE members
      SET full_name = ?,
          birth_date = ?,
          gender = ?,
          phone_number = ?,
          address = ?,
          belt_rank = ?,
          registration_status = ?,
          payment_status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      sanitize(body.full_name),
      sanitize(body.birth_date),
      sanitize(body.gender),
      sanitize(body.phone_number),
      sanitize(body.address),
      sanitize(body.belt_rank),
      sanitize(body.registration_status),
      sanitize(body.payment_status),
      id
    ).run();

    const updated = await c.env.DB.prepare(`SELECT * FROM members WHERE id = ?`).bind(id).first();
    return c.json({ success: true, member: updated });
  } catch (err) {
    return c.json({ error: 'Gagal memperbarui data anggota.' }, 500);
  }
});

app.delete('/admin/members/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  try {
    const member = await c.env.DB.prepare(`SELECT doc_birth_cert_key, doc_photo_key FROM members WHERE id = ?`).bind(id).first();
    if (member) {
      if (member.doc_birth_cert_key) await deleteDocument(c.env, member.doc_birth_cert_key);
      if (member.doc_photo_key) await deleteDocument(c.env, member.doc_photo_key);
    }
    await c.env.DB.prepare(`DELETE FROM members WHERE id = ?`).bind(id).run();
    return c.json({ success: true, message: 'Data anggota berhasil dihapus.' });
  } catch (err) {
    return c.json({ error: 'Gagal menghapus data anggota.' }, 500);
  }
});

// ==========================================================
// 6. PAYMENTS RECORDING
// ==========================================================
app.get('/admin/payments', authMiddleware, async (c) => {
  try {
    const status = c.req.query('status');
    const page = Math.max(parseInt(c.req.query('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(c.req.query('limit') || '10', 10), 1), 500);
    const offset = (page - 1) * limit;

    let filterSql = '';
    const params = [];
    if (status) {
      filterSql = ` WHERE payment_status = ?`;
      params.push(status);
    }

    const [listRes, countRes] = await Promise.all([
      c.env.DB.prepare(`
        SELECT id, registration_code, full_name, phone_number, belt_rank,
               payment_status, payment_amount, payment_date, payment_method, payment_notes, created_at
        FROM members${filterSql}
        ORDER BY id DESC LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      c.env.DB.prepare(`SELECT count(*) as total FROM members${filterSql}`).bind(...params).first()
    ]);

    return c.json({
      payments: listRes.results || [],
      total: countRes?.total || 0,
    });
  } catch (err) {
    return c.json({ error: 'Gagal mengambil data pembayaran.' }, 500);
  }
});

app.put('/admin/payments/:id', authMiddleware, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    const amount = parseInt(body.payment_amount, 10) || 0;
    const date = body.payment_date || getWitaISOString(new Date());
    const method = body.payment_method || 'Tunai';
    const notes = sanitize(body.payment_notes || '');
    const status = body.payment_status || (amount > 0 ? 'paid' : 'unpaid');

    await c.env.DB.prepare(`
      UPDATE members
      SET payment_status = ?,
          payment_amount = ?,
          payment_date = ?,
          payment_method = ?,
          payment_notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, amount, date, method, notes, id).run();

    const updated = await c.env.DB.prepare(`SELECT * FROM members WHERE id = ?`).bind(id).first();
    return c.json({ success: true, member: updated });
  } catch (err) {
    return c.json({ error: 'Gagal mencatat pembayaran.' }, 500);
  }
});

// ==========================================================
// 7. REPORTS & EXPORTS DATA
// ==========================================================
app.get('/admin/reports', authMiddleware, async (c) => {
  try {
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const regStatus = c.req.query('registration_status');
    const payStatus = c.req.query('payment_status');

    let sql = `SELECT * FROM members WHERE 1=1`;
    const params = [];

    if (startDate) {
      sql += ` AND date(created_at, '+8 hours') >= date(?)`;
      params.push(startDate);
    }
    if (endDate) {
      sql += ` AND date(created_at, '+8 hours') <= date(?)`;
      params.push(endDate);
    }
    if (regStatus && regStatus !== 'all') {
      sql += ` AND registration_status = ?`;
      params.push(regStatus);
    }
    if (payStatus && payStatus !== 'all') {
      sql += ` AND payment_status = ?`;
      params.push(payStatus);
    }

    sql += ` ORDER BY created_at ASC`;

    const stmt = c.env.DB.prepare(sql);
    const result = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

    return c.json({ records: result.results || [] });
  } catch (err) {
    return c.json({ error: 'Gagal membuat rekap laporan.' }, 500);
  }
});

// ==========================================================
// 8. USER / ADMIN MANAGEMENT (SUPERADMIN ONLY)
// ==========================================================
app.get('/admin/users', authMiddleware, superadminGuard, async (c) => {
  try {
    const users = await c.env.DB.prepare(`
      SELECT id, username, full_name, role, is_active, created_at, updated_at
      FROM users
      ORDER BY id ASC
    `).all();
    return c.json({ users: users.results || [] });
  } catch (err) {
    return c.json({ error: 'Gagal mengambil data user pengurus.' }, 500);
  }
});

app.post('/admin/users', authMiddleware, superadminGuard, async (c) => {
  try {
    const { username, password, full_name, role } = await c.req.json();
    if (!username || !password || !full_name) {
      return c.json({ error: 'Username, password, dan nama lengkap wajib diisi.' }, 400);
    }
    if (password.length < 6) {
      return c.json({ error: 'Kata sandi baru minimal 6 karakter.' }, 400);
    }

    const cleanUsername = sanitize(username).toLowerCase();
    const existing = await c.env.DB.prepare(`SELECT id FROM users WHERE username = ?`).bind(cleanUsername).first();
    if (existing) {
      return c.json({ error: 'Username sudah digunakan.' }, 400);
    }

    const passwordHash = await hashPassword(password);
    const cleanRole = role === 'superadmin' ? 'superadmin' : 'admin';

    await c.env.DB.prepare(`
      INSERT INTO users (username, password_hash, full_name, role, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(cleanUsername, passwordHash, sanitize(full_name), cleanRole).run();

    return c.json({ success: true, message: 'User admin berhasil ditambahkan.' }, 201);
  } catch (err) {
    return c.json({ error: 'Gagal menambahkan user admin.' }, 500);
  }
});

app.put('/admin/users/:id', authMiddleware, superadminGuard, async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const targetId = parseInt(id, 10);
  const currentUser = c.get('user');

  // Prevent superadmin from deactivating or demoting themselves
  if (targetId === currentUser.id) {
    if (body.role && body.role !== 'superadmin') {
      return c.json({ error: 'Anda tidak dapat menurunkan peran (role) akun Anda sendiri.' }, 400);
    }
    if (body.is_active === 0 || body.is_active === false) {
      return c.json({ error: 'Anda tidak dapat menonaktifkan akun Anda sendiri.' }, 400);
    }
  }

  try {
    if (body.password) {
      if (body.password.trim().length < 6) {
        return c.json({ error: 'Kata sandi baru minimal 6 karakter.' }, 400);
      }
      const newHash = await hashPassword(body.password.trim());
      await c.env.DB.prepare(`
        UPDATE users
        SET full_name = ?,
            role = ?,
            is_active = ?,
            password_hash = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        sanitize(body.full_name),
        body.role === 'superadmin' ? 'superadmin' : 'admin',
        body.is_active ? 1 : 0,
        newHash,
        id
      ).run();
    } else {
      await c.env.DB.prepare(`
        UPDATE users
        SET full_name = ?,
            role = ?,
            is_active = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        sanitize(body.full_name),
        body.role === 'superadmin' ? 'superadmin' : 'admin',
        body.is_active ? 1 : 0,
        id
      ).run();
    }

    return c.json({ success: true, message: 'Data user berhasil diperbarui.' });
  } catch (err) {
    return c.json({ error: err.message || 'Gagal memperbarui user admin.' }, 500);
  }
});

app.delete('/admin/users/:id', authMiddleware, superadminGuard, async (c) => {
  const id = c.req.param('id');
  const currentUser = c.get('user');

  if (parseInt(id, 10) === currentUser.id) {
    return c.json({ error: 'Tidak dapat menghapus akun Anda sendiri saat ini.' }, 400);
  }

  try {
    await c.env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
    return c.json({ success: true, message: 'User admin berhasil dihapus.' });
  } catch (err) {
    return c.json({ error: 'Gagal menghapus user admin.' }, 500);
  }
});

// ==========================================================
// 9. PRIVATE DOCUMENT STREAMING (ZERO-PUBLIC R2 BUCKET)
// ==========================================================
app.get('/admin/documents/*', authMiddleware, async (c) => {
  const docKey = c.req.path.replace(/^\/api\/admin\/documents\//, '');
  const isValidDocKey = /^docs\/\d{4}\/\d{2}\/[a-zA-Z0-9_\-\.]+$/.test(docKey);
  const isDemoDocKey = /^demo-birth-cert-\d+\.jpg$/.test(docKey);

  if (!docKey || (!isValidDocKey && !isDemoDocKey)) {
    return c.json({ error: 'Key dokumen tidak valid atau format path tidak diizinkan.' }, 400);
  }

  try {
    const document = await getDocument(c.env, docKey);
    if (!document) {
      if (isDemoDocKey) {
        const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100">
          <rect width="100%" height="100%" fill="#f8fafc"/>
          <rect x="40" y="40" width="720" height="1020" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" stroke-dasharray="8 8"/>
          <circle cx="400" cy="300" r="60" fill="#f1f5f9" stroke="#94a3b8" stroke-width="3"/>
          <path d="M375 300 L400 325 L430 280" stroke="#059669" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="400" y="420" font-family="sans-serif" font-size="26" font-weight="bold" fill="#0f172a" text-anchor="middle">BERKAS AKTA KELAHIRAN (DEMO)</text>
          <text x="400" y="465" font-family="sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Dokumen Simulasi Data Pendaftar Awal</text>
          <text x="400" y="520" font-family="monospace" font-size="15" font-weight="bold" fill="#8C6918" text-anchor="middle">${docKey}</text>
          <rect x="150" y="580" width="500" height="2" fill="#e2e8f0"/>
          <text x="400" y="640" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Taekwondo Satria Muda Club (SMC)</text>
          <text x="400" y="670" font-family="sans-serif" font-size="13" fill="#cbd5e1" text-anchor="middle">Terverifikasi pada basis data lokal dojang</text>
        </svg>`;
        return new Response(placeholderSvg, {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400',
            'X-Content-Type-Options': 'nosniff',
          }
        });
      }
      return c.json({ error: 'Dokumen tidak ditemukan atau telah dihapus.' }, 404);
    }

    return new Response(document.body, {
      headers: {
        'Content-Type': document.contentType || 'image/jpeg',
        'Cache-Control': 'private, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      }
    });
  } catch (err) {
    console.error('Document stream error:', err);
    return c.json({ error: 'Gagal membaca berkas dokumen privat.' }, 500);
  }
});

// Export Cloudflare Pages Functions Handler
export const onRequest = (context) => app.fetch(context.request, context.env, context);
export default app;
