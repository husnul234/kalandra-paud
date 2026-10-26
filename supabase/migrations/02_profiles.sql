-- ==============================================================================
-- MIGRASI 02: TABEL profiles & AUTO-CREATE TRIGGER DARI auth.users
-- Role-based access control: 'admin' (Kepala TK / Creator) vs 'guru' (Pendidik)
-- ==============================================================================

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

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper Function: Memeriksa apakah pemanggil adalah Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger updated_at
DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Kebijakan RLS Profiles
DROP POLICY IF EXISTS "Users view own or admin view all" ON public.profiles;
CREATE POLICY "Users view own or admin view all" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin manage all profiles" ON public.profiles;
CREATE POLICY "Admin manage all profiles" ON public.profiles
  FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Trigger otomatis saat user baru mendaftar di auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT := 'guru';
  v_name TEXT := '';
  v_school_id UUID;
BEGIN
  -- Ambil data dari raw_user_meta_data jika tersedia
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

  -- Defaultkan ke sekolah pertama jika ada
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
