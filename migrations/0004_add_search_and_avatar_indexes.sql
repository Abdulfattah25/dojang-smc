-- ==========================================================
-- 4. INDEKS OPTIMALISASI PENCATATAN STATUS & AVATAR STREAMING
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_members_name_birth ON members(full_name, birth_date);
CREATE INDEX IF NOT EXISTS idx_members_doc_photo ON members(doc_photo_key);
