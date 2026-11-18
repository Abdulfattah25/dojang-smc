-- ==========================================================
-- 3. INDEKS OPTIMALISASI PENCATATAN PEMBAYARAN BULANAN
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_members_pay_date ON members(payment_status, payment_date);
