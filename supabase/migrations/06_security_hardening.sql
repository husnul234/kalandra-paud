-- ==============================================================================
-- MIGRASI 06: PENGETATAN KEAMANAN (SECURITY HARDENING & OWASP COMPLIANCE)
-- 1. Penutupan akses anonim pada allowed_customers (Pencegahan Kebocoran PII)
-- 2. Penutupan akses publik/guru pada demo_api_keys (Pencegahan Pencurian Kunci)
-- 3. Trigger Anti-Privilege Escalation pada tabel profiles
-- 4. Penguatan RLS audit_logs
-- ==============================================================================

-- 1. PENCEGAHAN KEBOCORAN DATA CUSTOMER (A01: Broken Access Control)
-- Hapus policy anonim yang mengizinkan siapa saja membaca seluruh data pelanggan
DROP POLICY IF EXISTS "Public check allowed email" ON public.allowed_customers;
DROP POLICY IF EXISTS "Admins full access to allowed_customers" ON public.allowed_customers;

-- Hanya Admin terotentikasi yang dapat mengakses tabel data pelanggan
CREATE POLICY "Admins full access to allowed_customers" ON public.allowed_customers
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 2. PENCEGAHAN PENCURIAN KUNCI SISTEM (A01 & A02)
-- Hapus hak baca kunci demo dari user umum/guru
DROP POLICY IF EXISTS "Users can read active demo keys" ON public.demo_api_keys;
DROP POLICY IF EXISTS "Admins full access to demo_api_keys" ON public.demo_api_keys;

-- Hanya Admin yang berhak melihat dan mengelola pool kunci demo/cadangan
CREATE POLICY "Admins full access to demo_api_keys" ON public.demo_api_keys
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 3. PENCEGAHAN ESKALASI HAK AKSES MANDIRI (A01 & A06: Insecure Design)
-- Mencegah user mengubah kolom 'role' menjadi 'admin' melalui client query
CREATE OR REPLACE FUNCTION public.prevent_self_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  -- Jika peran berubah dan pemanggil bukan admin aktif, batalkan operasi
  IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Akses Ditolak: Anda tidak memiliki izin untuk mengubah peran akun (Privilege Escalation Prevention).';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_prevent_self_role_escalation ON public.profiles;
CREATE TRIGGER tr_prevent_self_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_role_escalation();

-- 4. KEBIJAKAN AUDIT LOGS TERPERCAYA (A09: Security Logging)
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs" ON public.audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
