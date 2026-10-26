-- ==============================================================================
-- KALANDRA PAUD: MASTER DATABASE MIGRATION SCRIPT
-- Menggabungkan seluruh tabel (schools, profiles, user_api_keys, 
-- generated_documents, audit_logs), RLS, trigger, dan data awal.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. TABEL: schools
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  npsn TEXT UNIQUE,
  address TEXT DEFAULT '',
  village TEXT DEFAULT '',
  subdistrict TEXT DEFAULT '',
  city_regency TEXT DEFAULT '',
  province TEXT DEFAULT '',
  principal_name TEXT NOT NULL DEFAULT '',
  principal_nip TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS tr_schools_updated_at ON public.schools;
CREATE TRIGGER tr_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. TABEL: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'guru' CHECK (role IN ('admin', 'guru')),
  nip TEXT DEFAULT '',
  assigned_class TEXT DEFAULT 'A (4-5 Tahun)',
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. TABEL: user_api_keys
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'gemini' CHECK (provider IN ('gemini', 'openai', 'anthropic', 'openrouter')),
  api_key TEXT NOT NULL,
  label TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_user_api_keys_lookup 
  ON public.user_api_keys(user_id, provider, is_active);

DROP TRIGGER IF EXISTS tr_user_api_keys_updated_at ON public.user_api_keys;
CREATE TRIGGER tr_user_api_keys_updated_at
  BEFORE UPDATE ON public.user_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. TABEL: generated_documents
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  jenjang_kelas TEXT NOT NULL DEFAULT 'A (4-5 Tahun)',
  semester TEXT NOT NULL DEFAULT '1 (Gasal)',
  minggu_ke TEXT NOT NULL DEFAULT '1',
  bulan TEXT NOT NULL DEFAULT '',
  topik_subtopik TEXT NOT NULL,
  dpl_selected TEXT[] NOT NULL DEFAULT '{}',
  used_model TEXT DEFAULT 'gemini-3.6-flash',
  document_json JSONB NOT NULL,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_generated_docs_user 
  ON public.generated_documents(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_docs_school 
  ON public.generated_documents(school_id, created_at DESC);

DROP TRIGGER IF EXISTS tr_generated_docs_updated_at ON public.generated_documents;
CREATE TRIGGER tr_generated_docs_updated_at
  BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. TABEL: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
  ON public.audit_logs(created_at DESC);

-- 8. POLICIES (RLS)
DROP POLICY IF EXISTS "Authenticated users can read schools" ON public.schools;
CREATE POLICY "Authenticated users can read schools" ON public.schools
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert and update schools" ON public.schools;
CREATE POLICY "Admins can insert and update schools" ON public.schools
  FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Users view own or admin view all" ON public.profiles;
CREATE POLICY "Users view own or admin view all" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin manage all profiles" ON public.profiles;
CREATE POLICY "Admin manage all profiles" ON public.profiles
  FOR ALL TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Users manage own api keys only" ON public.user_api_keys;
CREATE POLICY "Users manage own api keys only" ON public.user_api_keys
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Guru manage own documents" ON public.generated_documents;
CREATE POLICY "Guru manage own documents" ON public.generated_documents
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin view all documents" ON public.generated_documents;
CREATE POLICY "Admin view all documents" ON public.generated_documents
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.is_admin());

-- 9. AUTH TRIGGER ON auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT := 'guru';
  v_name TEXT := '';
  v_school_id UUID;
BEGIN
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
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
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 10. SEED INITIAL SCHOOLS DATA
INSERT INTO public.schools (name, npsn, address, subdistrict, city_regency, province, principal_name, principal_nip)
VALUES 
  ('TK NEGERI PEMBINA 01', '20108921', 'Jl. Merdeka No. 45', 'Kecamatan Ceria', 'Kota Jakarta Selatan', 'DKI Jakarta', 'Hj. Siti Rahayu, M.Pd.', '197508122002122001'),
  ('TK KARTIKA CENDEKIA', '20109844', 'Jl. Pendidikan No. 12', 'Kecamatan Melati', 'Kota Bandung', 'Jawa Barat', 'Dra. Endang Lestari', '198103152006042003')
ON CONFLICT (npsn) DO NOTHING;
