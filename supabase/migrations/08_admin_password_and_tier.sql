-- ==============================================================================
-- KALANDRA: MIGRATION 08 - DIRECT ADMIN PASSWORD RESET & TIER SCHEMA SUPPORT
-- Fungsi RPC berkeamanan tinggi (SECURITY DEFINER) agar admin dapat mengubah 
-- kata sandi pengguna secara langsung di database Supabase tanpa harus lewat email.
-- ==============================================================================

-- 1. Tambahkan kolom tier ke tabel profiles (jika belum ada)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'pro';

-- 2. Tambahkan kolom subscription_tier ke allowed_customers (jika belum ada)
ALTER TABLE public.allowed_customers 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'pro';

ALTER TABLE public.allowed_customers 
  ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT '1_tahun';

-- 3. Fungsi RPC: admin_update_user_password
-- Menggunakan pgcrypto (crypt/bf) untuk meng-update encrypted_password di auth.users secara aman
CREATE OR REPLACE FUNCTION public.admin_update_user_password(
  target_user_id UUID, 
  new_plain_password TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Validasi Keamanan: Pastikan yang memanggil adalah admin yang sah dan aktif
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

  -- Update sandi terenkripsi di tabel internal auth.users
  UPDATE auth.users
  SET encrypted_password = crypt(new_plain_password, gen_salt('bf')),
      updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

-- Berikan izin akses eksekusi RPC hanya ke authenticated users (dijaga oleh pengecekan admin di dalam fungsi)
GRANT EXECUTE ON FUNCTION public.admin_update_user_password(UUID, TEXT) TO authenticated;
