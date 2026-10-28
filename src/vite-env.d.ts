/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_EDGE_FUNCTION_URL?: string;
  readonly VITE_DATTIO_API_KEY?: string;
  readonly VITE_DATTIO_BASE_URL?: string;
  readonly VITE_DATTIO_PRIMARY_MODEL?: string;
  readonly VITE_DATTIO_FAST_MODEL?: string;
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
