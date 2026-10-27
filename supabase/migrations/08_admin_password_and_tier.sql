-- ==============================================================================
-- KALANDRA: MIGRATION 08 - DIRECT ADMIN PASSWORD RESET & TIER SCHEMA SUPPORT
-- Fungsi RPC berkeamanan tinggi (SECURITY DEFINER) agar admin dapat mengubah 
-- kata sandi pengguna secara langsung di database Supabase tanpa harus lewat email.
-- ==============================================================================

-- 0. Pastikan pgcrypto aktif di schema extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- 1. Tambahkan kolom tier ke tabel profiles (jika belum ada)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'pro';

-- 2. Tambahkan kolom subscription_tier ke allowed_customers (jika belum ada)
ALTER TABLE public.allowed_customers 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'pro';

ALTER TABLE public.allowed_customers 
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT '1_tahun';

-- 3. Fungsi RPC 1: admin_update_user_password (by UUID)
CREATE OR REPLACE FUNCTION public.admin_update_user_password(
  target_user_id UUID, 
  new_plain_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
BEGIN
  -- Validasi Keamanan: Pastikan yang memanggil adalah admin yang sah dan aktif atau superadmin utama
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  ) AND auth.jwt() ->> 'email' != 'pakhusnulid@gmail.com' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya administrator aktif yang diizinkan mengubah kata sandi pengguna.';
  END IF;

  -- Validasi panjang sandi
  IF length(new_plain_password) < 6 THEN
    RAISE EXCEPTION 'Kata sandi baru minimal 6 karakter.';
  END IF;

  -- Update sandi terenkripsi & konfirmasi email secara instan di tabel internal auth.users
  -- CATATAN: Jangan update kolom "confirmed_at" karena bertipe GENERATED COLUMN di Supabase Auth
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(new_plain_password, extensions.gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- 4. Fungsi RPC 2: admin_update_user_password_by_email (by Email fallback)
CREATE OR REPLACE FUNCTION public.admin_update_user_password_by_email(
  target_email TEXT, 
  new_plain_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_clean_email TEXT := lower(trim(target_email));
BEGIN
  -- Validasi Keamanan: Pastikan yang memanggil adalah admin yang sah dan aktif atau superadmin utama
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'admin' 
      AND is_active = true
  ) AND auth.jwt() ->> 'email' != 'pakhusnulid@gmail.com' THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya administrator aktif yang diizinkan mengubah kata sandi pengguna.';
  END IF;

  IF length(new_plain_password) < 6 THEN
    RAISE EXCEPTION 'Kata sandi baru minimal 6 karakter.';
  END IF;

  -- Update sandi terenkripsi & konfirmasi email secara instan di tabel internal auth.users
  -- CATATAN: Jangan update kolom "confirmed_at" karena bertipe GENERATED COLUMN di Supabase Auth
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(new_plain_password, extensions.gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
  WHERE lower(email) = v_clean_email;

  RETURN TRUE;
END;
$$;

-- Berikan izin akses eksekusi RPC ke authenticated users (dijaga oleh pengecekan admin di dalam fungsi)
GRANT EXECUTE ON FUNCTION public.admin_update_user_password(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_password_by_email(TEXT, TEXT) TO authenticated;
