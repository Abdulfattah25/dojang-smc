-- ==========================================================
-- 3. TABEL PENGATURAN SISTEM (SETTINGS)
-- ==========================================================
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Default WhatsApp Pengurus
INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_whatsapp', '081234567890');
