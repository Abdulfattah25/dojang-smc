import { verifyJwt } from '../services/auth.js';

export function getCookie(c, name) {
  const cookieHeader = c.req.header('Cookie') || '';
  const cookies = cookieHeader.split(';').map(v => v.trim());
  for (const cookie of cookies) {
    const [k, ...v] = cookie.split('=');
    if (k === name) {
      return decodeURIComponent(v.join('='));
    }
  }
  return null;
}

export async function authMiddleware(c, next) {
  const token = getCookie(c, 'tkd_session') || (c.req.header('Authorization') || '').replace(/^Bearer\s+/, '');

  if (!token) {
    return c.json({ error: 'Sesi login tidak ditemukan. Silakan login kembali.' }, 401);
  }

  const secret = c.env.JWT_SECRET || (c.env.ENVIRONMENT === 'development' ? 'smc-secret-key-satria-muda-club-2026-very-secure' : null);
  if (!secret) {
    return c.json({ error: 'JWT_SECRET belum dikonfigurasi pada server produksi.' }, 500);
  }
  const user = await verifyJwt(token, secret);

  if (!user) {
    return c.json({ error: 'Sesi login tidak valid atau telah berakhir.' }, 401);
  }

  c.set('user', user);
  await next();
}

export async function superadminGuard(c, next) {
  const user = c.get('user');
  if (!user || user.role !== 'superadmin') {
    return c.json({ error: 'Akses ditolak: Operasi ini hanya untuk Superadmin.' }, 403);
  }
  await next();
}
