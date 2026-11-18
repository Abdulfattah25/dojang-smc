-- ==========================================================
-- 1. TABEL PENGGUNA SISTEM (USERS / ADMINS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('superadmin', 'admin')) DEFAULT 'admin',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ==========================================================
-- 2. TABEL PENDAFTAR & ANGGOTA (MEMBERS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    gender TEXT CHECK(gender IN ('Laki-laki', 'Perempuan')) NOT NULL,
    phone_number TEXT NOT NULL,
    address TEXT NOT NULL,
    belt_rank TEXT DEFAULT 'Putih',
    registration_status TEXT CHECK(registration_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    payment_status TEXT CHECK(payment_status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
    payment_amount INTEGER DEFAULT 0,
    payment_date DATETIME,
    payment_method TEXT CHECK(payment_method IN ('Tunai', 'Transfer', 'QRIS', NULL)),
    payment_notes TEXT,
    doc_birth_cert_key TEXT NOT NULL,
    doc_photo_key TEXT,
    verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_members_reg_status ON members(registration_status);
CREATE INDEX IF NOT EXISTS idx_members_pay_status ON members(payment_status);
CREATE INDEX IF NOT EXISTS idx_members_pay_date ON members(payment_status, payment_date);
CREATE INDEX IF NOT EXISTS idx_members_created_at ON members(created_at);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone_number);

-- Seed Initial Superadmin (default credentials: username 'admin', password 'admin123')
INSERT OR REPLACE INTO users (id, username, password_hash, full_name, role, is_active)
VALUES (
    1,
    'admin',
    'pbkdf2:4f6d92aaaa4990804b53773cdae679c3:100000:6f4ac33b6a1f34ca21b6964cb42a73837adc9a8834ffea869e2f3715fd61652f',
    'Pelatih Kepala (SMC)',
    'superadmin',
    1
);
