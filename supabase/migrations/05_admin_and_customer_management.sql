-- ==============================================================================
-- KALANDRA PAUD: MIGRATION 05 - ADMIN & CUSTOMER/MEMBER MANAGEMENT
-- Menambahkan tabel allowed_customers (whitelist member & lisensi),
-- demo_api_keys (pool kunci sistem cadangan), dan penugasan admin pakhusnulid@gmail.com.
-- ==============================================================================

-- 1. TABEL: allowed_customers (Member Whitelist & Lisensi Guru/Sekolah)
CREATE TABLE IF NOT EXISTS public.allowed_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  whatsapp TEXT DEFAULT '',
  school_name TEXT DEFAULT '',
  account_type TEXT NOT NULL DEFAULT 'annual' CHECK (account_type IN ('trial', 'lite', 'annual', 'lifetime')),
  subscription_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_end TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT DEFAULT '',
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.allowed_customers ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tr_allowed_customers_updated_at ON public.allowed_customers;
CREATE TRIGGER tr_allowed_customers_updated_at
  BEFORE UPDATE ON public.allowed_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 2. TABEL: demo_api_keys (Pool Kunci API Gemini Sistem/Cadangan)
CREATE TABLE IF NOT EXISTS public.demo_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT NOT NULL,
  label TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_api_keys ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tr_demo_api_keys_updated_at ON public.demo_api_keys;
CREATE TRIGGER tr_demo_api_keys_updated_at
  BEFORE UPDATE ON public.demo_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3. POLICIES (RLS) FOR allowed_customers & demo_api_keys
DROP POLICY IF EXISTS "Admins full access to allowed_customers" ON public.allowed_customers;
CREATE POLICY "Admins full access to allowed_customers" ON public.allowed_customers
  FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Public check allowed email" ON public.allowed_customers;
CREATE POLICY "Public check allowed email" ON public.allowed_customers
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins full access to demo_api_keys" ON public.demo_api_keys;
CREATE POLICY "Admins full access to demo_api_keys" ON public.demo_api_keys
  FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Users can read active demo keys" ON public.demo_api_keys;
CREATE POLICY "Users can read active demo keys" ON public.demo_api_keys
  FOR SELECT TO authenticated USING (is_active = true);

-- 4. UPDATE TRIGGER: handle_new_user() agar pakhusnulid@gmail.com selalu otomatis menjadi ADMIN
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT := 'guru';
  v_name TEXT := '';
  v_school_id UUID;
BEGIN
  -- Cek jika pakhusnulid@gmail.com -> Otomatis role admin
  IF LOWER(NEW.email) = 'pakhusnulid@gmail.com' THEN
    v_role := 'admin';
  ELSIF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
    v_role := NEW.raw_user_meta_data->>'role';
  END IF;

  IF NEW.raw_user_meta_data->>'full_name' IS NOT NULL THEN
    v_name := NEW.raw_user_meta_data->>'full_name';
  ELSIF NEW.raw_user_meta_data->>'name' IS NOT NULL THEN
    v_name := NEW.raw_user_meta_data->>'name';
  ELSE
    v_name := split_part(NEW.email, '@', 1);
  END IF;

  SELECT id INTO v_school_id FROM public.schools ORDER BY created_at ASC LIMIT 1;

  INSERT INTO public.profiles (id, school_id, email, full_name, role)
  VALUES (NEW.id, v_school_id, NEW.email, v_name, v_role)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    role = CASE WHEN LOWER(EXCLUDED.email) = 'pakhusnulid@gmail.com' THEN 'admin' ELSE profiles.role END,
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. UPDATE EXISTING PROFILES JIKA pakhusnulid@gmail.com SUDAH TERDAFTAR
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'pakhusnulid@gmail.com';

-- 6. SEED INITIAL ALLOWED CUSTOMER (CONTOH DATA AWAL)
INSERT INTO public.allowed_customers (email, full_name, whatsapp, school_name, account_type, subscription_start, subscription_end, notes)
VALUES 
  ('pakhusnulid@gmail.com', 'Pak Husnul (Admin)', '081234567890', 'Pusat Kurikulum PAUD', 'lifetime', now(), now() + interval '10 years', 'Superadministrator Platform'),
  ('guru.dewi@paudceria.sch.id', 'Dewi Rahmawati, S.Pd.', '085712345678', 'TK NEGERI PEMBINA 01', 'annual', now(), now() + interval '1 year', 'Guru Kelompok A'),
  ('anisa.guru@kartika.sch.id', 'Anisa Nuraini, S.Pd.', '081398765432', 'TK KARTIKA CENDEKIA', 'annual', now(), now() + interval '1 year', 'Guru Kelompok B')
ON CONFLICT (email) DO NOTHING;
