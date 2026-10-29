-- ==============================================================================
-- KALANDRA PAUD: MIGRATION 10 - COMPREHENSIVE SECURITY & PRIVILEGE HARDENING
-- Resolves Audit Findings:
-- 1. Self-Registration Privilege Escalation (Forces role 'guru' on signup)
-- 2. Closes Public PII Leak on allowed_customers table
-- 3. Secures System API Key Pool (Restricts execution to verified admins)
-- ==============================================================================

-- 1. HARDEN SIGNUP TRIGGER (Pencegahan Eskalasi Akses Diri)
-- Memaksa peran 'guru' bagi semua pendaftaran umum dari auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT := 'guru';
  v_name TEXT := '';
  v_school_id UUID;
  v_clean_email TEXT := lower(trim(NEW.email));
BEGIN
  -- Superadmin default strictly pinned to verified administrator email
  IF v_clean_email = 'pakhusnulid@gmail.com' THEN
    v_role := 'admin';
  ELSE
    v_role := 'guru';
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

-- 2. HARDEN allowed_customers RLS (Pencegahan Kebocoran Nomor WhatsApp & PII)
DROP POLICY IF EXISTS "Public check allowed email" ON public.allowed_customers;
DROP POLICY IF EXISTS "Admins full access to allowed_customers" ON public.allowed_customers;

CREATE POLICY "Admins full access to allowed_customers" ON public.allowed_customers
  FOR ALL TO authenticated USING (public.is_admin());

-- Fungsi aman verifikasi lisensi mandiri tanpa mengekspos tabel ke publik
CREATE OR REPLACE FUNCTION public.check_user_license_status(user_email TEXT)
RETURNS TABLE (
  is_whitelisted BOOLEAN,
  account_type TEXT,
  subscription_tier TEXT,
  is_active BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true,
    ac.account_type,
    ac.subscription_tier,
    ac.is_active
  FROM public.allowed_customers ac
  WHERE lower(trim(ac.email)) = lower(trim(user_email))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.check_user_license_status(TEXT) TO authenticated;

-- 3. HARDEN SYSTEM API KEY POOL (Pencegahan Pencurian Kunci Sistem)
DROP POLICY IF EXISTS "Users can read active demo keys" ON public.demo_api_keys;
DROP POLICY IF EXISTS "Admins full access to demo_api_keys" ON public.demo_api_keys;

CREATE POLICY "Admins full access to demo_api_keys" ON public.demo_api_keys
  FOR ALL TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.get_active_system_api_keys()
RETURNS TABLE (api_key TEXT) AS $$
BEGIN
  -- Kunci sistem hanya diberikan kepada administrator terverifikasi
  IF public.is_admin() OR auth.jwt() ->> 'email' = 'pakhusnulid@gmail.com' THEN
    RETURN QUERY
    SELECT d.api_key
    FROM public.demo_api_keys d
    WHERE d.is_active = true
    ORDER BY d.created_at DESC;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_active_system_api_keys() TO authenticated;

