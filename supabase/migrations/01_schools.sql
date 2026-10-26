-- ==============================================================================
-- MIGRASI 01: TABEL schools (Profil Satuan PAUD / TK)
-- Regulasi: Profil Lembaga TK/PAUD Berstandar Kemendikdasmen
-- ==============================================================================

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

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_schools_updated_at ON public.schools;
CREATE TRIGGER tr_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Kebijakan RLS: Siapapun yang terautentikasi dapat membaca data sekolah
CREATE POLICY "Authenticated users can read schools" ON public.schools
  FOR SELECT
  TO authenticated
  USING (true);

-- Kebijakan RLS: Hanya admin yang dapat membuat atau memperbarui profil sekolah
CREATE POLICY "Admins can insert and update schools" ON public.schools
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Sample Data Satuan PAUD
INSERT INTO public.schools (name, npsn, address, subdistrict, city_regency, province, principal_name, principal_nip)
VALUES 
  ('TK NEGERI PEMBINA 01', '20108921', 'Jl. Merdeka No. 45', 'Kecamatan Ceria', 'Kota Jakarta Selatan', 'DKI Jakarta', 'Hj. Siti Rahayu, M.Pd.', '197508122002122001'),
  ('TK KARTIKA CENDEKIA', '20109844', 'Jl. Pendidikan No. 12', 'Kecamatan Melati', 'Kota Bandung', 'Jawa Barat', 'Dra. Endang Lestari', '198103152006042003')
ON CONFLICT (npsn) DO NOTHING;
