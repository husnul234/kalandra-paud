import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uffqfoycagixryyrwpsk.supabase.co';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZnFmb3ljYWdpeHJ5eXJ3cHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5ODMzNzcsImV4cCI6MjEwODU1OTM3N30.ryNWrKHsu4TYRlQpItQ6XkXGkqeJubPddKC7k0sp9GI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
