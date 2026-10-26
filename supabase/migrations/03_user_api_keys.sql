-- ==============================================================================
-- MIGRASI 03: TABEL user_api_keys (BYOK Multi-Key Pooling)
-- Aturan Keamanan: Row Level Security Kepemilikan Mutlak (Strict Isolation)
-- ==============================================================================

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

-- Index performa pencarian kunci aktif per pengguna
CREATE INDEX IF NOT EXISTS idx_user_api_keys_lookup 
  ON public.user_api_keys(user_id, provider, is_active);

-- Enable Row Level Security
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Trigger updated_at
DROP TRIGGER IF EXISTS tr_user_api_keys_updated_at ON public.user_api_keys;
CREATE TRIGGER tr_user_api_keys_updated_at
  BEFORE UPDATE ON public.user_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Kebijakan RLS: Kepemilikan Mutlak (Hanya pemilik yang dapat membaca/mengubah kuncinya sendiri)
DROP POLICY IF EXISTS "Users manage own api keys only" ON public.user_api_keys;
CREATE POLICY "Users manage own api keys only" ON public.user_api_keys
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
