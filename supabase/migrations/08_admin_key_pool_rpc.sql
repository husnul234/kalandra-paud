-- ==============================================================================
-- KALANDRA: MIGRATION 08 - SECURE SYSTEM GEMINI API KEY POOL RPC
-- Allows authenticated teachers to fetch system pool keys without direct table SELECT
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.get_active_system_api_keys()
RETURNS TABLE (api_key TEXT)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only authenticated teachers or administrators may execute this function
  IF auth.role() = 'authenticated' THEN
    RETURN QUERY
    SELECT uak.api_key
    FROM public.user_api_keys uak
    JOIN public.profiles p ON p.id = uak.user_id
    WHERE p.role = 'admin' 
      AND uak.is_active = true 
      AND uak.provider = 'gemini'
    ORDER BY uak.created_at ASC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execution privilege to authenticated users
GRANT EXECUTE ON FUNCTION public.get_active_system_api_keys() TO authenticated;
