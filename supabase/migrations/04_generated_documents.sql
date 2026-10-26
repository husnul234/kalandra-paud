-- ==============================================================================
-- MIGRASI 04: TABEL generated_documents (Penyimpanan Draf & Riwayat RPM PAUD)
-- Payload: JSONB terstruktur sesuai skema cetak biru Deep Learning PAUD
-- ==============================================================================

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

-- Index performa query riwayat per guru dan per satuan PAUD
CREATE INDEX IF NOT EXISTS idx_generated_docs_user 
  ON public.generated_documents(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_generated_docs_school 
  ON public.generated_documents(school_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Trigger updated_at
DROP TRIGGER IF EXISTS tr_generated_docs_updated_at ON public.generated_documents;
CREATE TRIGGER tr_generated_docs_updated_at
  BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Kebijakan RLS: Guru dapat mengelola dokumen milik sendiri
DROP POLICY IF EXISTS "Guru manage own documents" ON public.generated_documents;
CREATE POLICY "Guru manage own documents" ON public.generated_documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Kebijakan RLS: Admin platform / Kepala TK dapat melihat dokumen untuk supervisi
DROP POLICY IF EXISTS "Admin view all documents" ON public.generated_documents;
CREATE POLICY "Admin view all documents" ON public.generated_documents
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
