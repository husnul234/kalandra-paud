import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uffqfoycagixryyrwpsk.supabase.co';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZnFmb3ljYWdpeHJ5eXJ3cHNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjk4MzM3NywiZXhwIjoyMTA4NTU5Mzc3fQ.ocH55NnfiQj8HLeW-UI9dv9cTyDZ3ivpoYreAqzFQFs';

// Dedicated administrative client bypassing RLS with full Auth Admin access
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'guru';
  school_name?: string;
  assigned_class?: string;
  phone?: string;
}

/**
 * Creates a real authenticated user in auth.users, confirmed, and synced to profiles
 */
export async function adminCreateUser(input: CreateUserInput) {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = input.full_name.trim();

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: cleanEmail,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      full_name: cleanName,
      role: input.role,
      school_name: input.school_name || 'TK NEGERI PEMBINA 01',
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('Gagal mendapatkan ID pengguna baru');
  }

  // 2. Ensure or update profile entry with role, assigned class, and school
  // Wait a brief moment for database trigger to create profile row if needed
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find or use default school ID
  const { data: schools } = await supabaseAdmin
    .from('schools')
    .select('id')
    .limit(1);
  const schoolId = schools?.[0]?.id;

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: userId,
      email: cleanEmail,
      full_name: cleanName,
      role: cleanEmail === 'pakhusnulid@gmail.com' ? 'admin' : input.role,
      school_id: schoolId || null,
      assigned_class: input.assigned_class || '',
      is_active: true,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.warn('Profile sync notice:', profileError.message);
  }

  return authData.user;
}

/**
 * Deletes a user completely from auth.users (cascades to profiles, documents, keys)
 */
export async function adminDeleteUser(userId: string) {
  // Delete from profiles first
  await supabaseAdmin.from('profiles').delete().eq('id', userId);
  
  // Delete from auth.users
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Resets a user's password directly in auth.users
 */
export async function adminResetPassword(userId: string, newPassword: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
}

/**
 * Updates a user's active/inactive status
 */
export async function adminToggleUserStatus(userId: string, isActive: boolean) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Updates a user's role (admin vs guru)
 */
export async function adminToggleUserRole(userId: string, newRole: 'admin' | 'guru') {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}
