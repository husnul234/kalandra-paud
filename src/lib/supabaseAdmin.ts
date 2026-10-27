import { supabase } from './supabaseClient';

// Export the authenticated client. For admin operations on tables (profiles, schools, generated_documents),
// the user's JWT already grants full admin privileges via Supabase RLS (is_admin() = true).
// NO service_role master key is ever exposed or bundled into the client.
export const supabaseAdmin = supabase;

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'guru';
  tier?: 'standar' | 'pro' | 'free';
  duration?: '1_bulan' | '6_bulan' | '1_tahun';
  school_name?: string;
  assigned_class?: string;
  phone?: string;
}

/**
 * Creates a new user securely through Supabase Auth and links profile & subscription
 */
export async function adminCreateUser(input: CreateUserInput) {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = input.full_name.trim();
  const tier = input.tier || 'pro';
  const duration = input.duration || '1_tahun';
  const quota = tier === 'standar' ? 15 : 40;

  // Calculate subscription expiry
  const now = new Date();
  const daysToAdd = duration === '1_bulan' ? 30 : duration === '6_bulan' ? 180 : 365;
  const expiresAt = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  // Register user via Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: cleanEmail,
    password: input.password,
    options: {
      data: {
        full_name: cleanName,
        role: input.role,
        tier,
        school_name: input.school_name || 'TK NEGERI PEMBINA 01',
      },
    },
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('Gagal mendapatkan ID pengguna baru.');
  }

  // Ensure school exists or find default
  const { data: schools } = await supabase
    .from('schools')
    .select('id')
    .limit(1);
  const schoolId = schools?.[0]?.id;

  // 1. Sync Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: cleanEmail,
      full_name: cleanName,
      role: input.role,
      school_id: schoolId || null,
      assigned_class: input.assigned_class || '',
      is_active: true,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    console.warn('[adminCreateUser] Profile sync notice:', profileError.message);
  }

  // 2. Sync allowed_customers for whitelist & licensing
  try {
    await supabase.from('allowed_customers').upsert({
      email: cleanEmail,
      full_name: cleanName,
      whatsapp: input.phone || '',
      school_name: input.school_name || 'Satuan PAUD',
      account_type: duration === '1_tahun' ? 'annual' : 'lite',
      subscription_start: now.toISOString(),
      subscription_end: expiresAt.toISOString(),
      is_active: true,
      notes: `Tier: ${tier.toUpperCase()} | Durasi: ${duration}`,
    }, { onConflict: 'email' });
  } catch (custErr) {
    console.warn('[adminCreateUser] allowed_customers sync note:', custErr);
  }

  return { user: authData.user, password: input.password, tier, expiresAt };
}

/**
 * Deletes a user profile from the database
 */
export async function adminDeleteUser(userId: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Sends a secure password reset email to the user
 */
export async function adminResetPassword(userEmail: string) {
  const cleanEmail = userEmail.trim().toLowerCase();
  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

/**
 * Updates a user's active/inactive status (Protected by RLS is_admin())
 */
export async function adminToggleUserStatus(userId: string, isActive: boolean) {
  const { error } = await supabase
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Updates a user's role (Protected by RLS is_admin())
 */
export async function adminToggleUserRole(userId: string, newRole: 'admin' | 'guru') {
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);
  if (error) {
    throw new Error(error.message);
  }
}

export interface UpdateUserInput {
  userId: string;
  email: string;
  full_name: string;
  role: 'admin' | 'guru';
  tier?: 'standar' | 'pro' | 'free';
  duration?: '1_bulan' | '6_bulan' | '1_tahun' | 'lifetime';
  expiryDate?: string;
  school_name?: string;
  assigned_class?: string;
  phone?: string;
  is_active: boolean;
  new_password?: string;
}

/**
 * Comprehensive user update (Profile, Allowed Customers, and Auth Password)
 */
export async function adminUpdateUser(input: UpdateUserInput) {
  const cleanEmail = input.email.trim().toLowerCase();
  const cleanName = input.full_name.trim();

  // 1. Update profiles table
  const profileUpdates: any = {
    full_name: cleanName,
    role: input.role,
    assigned_class: input.assigned_class || '',
    phone: input.phone || '',
    is_active: input.is_active,
    tier: input.tier || 'pro',
    updated_at: new Date().toISOString(),
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileUpdates)
    .eq('id', input.userId);

  if (profileError) {
    throw new Error(`Gagal memperbarui profil: ${profileError.message}`);
  }

  // 2. Sync allowed_customers
  try {
    const custUpdates: any = {
      full_name: cleanName,
      whatsapp: input.phone || '',
      school_name: input.school_name || 'Satuan PAUD',
      is_active: input.is_active,
      subscription_tier: input.tier || 'pro',
      account_type: input.duration === 'lifetime' ? 'lifetime' : input.duration === '1_tahun' ? 'annual' : 'lite',
    };

    if (input.expiryDate) {
      custUpdates.subscription_end = input.expiryDate;
    }

    await supabase
      .from('allowed_customers')
      .update(custUpdates)
      .eq('email', cleanEmail);
  } catch (custErr) {
    console.warn('[adminUpdateUser] allowed_customers sync note:', custErr);
  }

  // 3. Update password if provided
  if (input.new_password && input.new_password.trim().length >= 6) {
    try {
      const { error: authErr } = await supabase.auth.admin.updateUserById(input.userId, {
        password: input.new_password.trim(),
      });
      if (authErr) {
        // Fallback: send password reset email if client admin auth lacks service role
        console.warn('admin.updateUserById notice, falling back to reset email:', authErr.message);
        await adminResetPassword(cleanEmail);
      }
    } catch (authE) {
      console.warn('Password update notice:', authE);
    }
  }

  return true;
}
