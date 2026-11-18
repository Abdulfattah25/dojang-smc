# Taekwondo Satria Muda Club (SMC) - Registration & Member Management System

Progressive Web Application (PWA) & Mobile-First Single Page Application untuk pendaftaran siswa baru dan manajemen anggota Dojang Taekwondo Satria Muda Club.

## Tech Stack
- **Frontend:** Vue 3, Vite, Tailwind CSS, Lucide Icons, `vite-plugin-pwa` (Workbox)
- **Backend Edge:** Cloudflare Pages Functions (Hono Framework)
- **Database:** Cloudflare D1 (SQLite)
- **Storage:** Cloudflare R2 (Private Zero-Public Bucket)
- **Reporting:** SheetJS (`xlsx`) & `jspdf` + `jspdf-autotable`

## Akun Login Awal
- **URL Admin:** `/admin/login`
- **Username:** `admin`
- **Password:** `admin123`
- **Peran:** Superadmin

## Perintah Pengembangan (Scripts)
```bash
# Menjalankan frontend dev server
npm run dev

# Membangun bundle produksi PWA & aset
npm run build

# Menjalankan self-check pengujian verifikasi sistem
npm test

# Menjalankan simulasi Pages Functions + D1 + R2 lokal
npm run pages:dev
```
