import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'guru';
  nip?: string;
  assigned_class?: string;
  school_id?: string;
  school_name?: string;
  principal_name?: string;
  principal_nip?: string;
  city?: string;
  phone?: string;
  is_active: boolean;
  tier?: 'standar' | 'pro' | 'free';
  monthly_quota?: number;
}

export interface ProfileUpdateParams {
  full_name?: string;
  school_name?: string;
  nip?: string;
  assigned_class?: string;
  principal_name?: string;
  principal_nip?: string;
  city?: string;
  phone?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isPro: boolean;
  monthlyQuota: number;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: 'admin' | 'guru',
    schoolName?: string,
    assignedClass?: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateParams) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to detect if email is superadmin
export const isSuperadminEmail = (emailToCheck?: string | null): boolean => {
  return emailToCheck?.trim().toLowerCase() === 'pakhusnulid@gmail.com';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Clean up any legacy demo role keys in localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('kalandra_demo_role');
    } catch (e) {}
  }, []);

  // Fetch or setup profile from database
  const fetchProfile = async (currentUser: User) => {
    const isSuperAdmin = isSuperadminEmail(currentUser.email);

    // Read extra local profile metadata if saved on device
    let localMeta: any = {};
    try {
      const savedMeta = localStorage.getItem(`kalandra_profile_meta_${currentUser.id}`);
      if (savedMeta) {
        localMeta = JSON.parse(savedMeta);
      }
    } catch (e) {}

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, schools(*)')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        const detectedTier = (data.tier || (data as any).subscription_tier || currentUser.user_metadata?.tier || (isSuperAdmin ? 'pro' : 'standar')) as 'standar' | 'pro' | 'free';

        // Resolve school name: Priority to user customization (localMeta > metadata > profiles table > schools table > default)
        const schoolObj = data.schools as any;
        const resolvedSchoolName = 
          localMeta.schoolName ||
          currentUser.user_metadata?.school_name ||
          (data as any).school_name ||
          (schoolObj?.name && schoolObj.name !== 'TK NEGERI PEMBINA 01' ? schoolObj.name : null) ||
          localMeta.schoolName ||
          currentUser.user_metadata?.school_name ||
          (schoolObj?.name) ||
          (isSuperAdmin ? 'Kalandra PAUD Official' : 'Satuan PAUD');

        const resolvedPrincipalName =
          localMeta.principalName ||
          currentUser.user_metadata?.principal_name ||
          schoolObj?.principal_name ||
          '';

        const resolvedPrincipalNip =
          localMeta.principalNip ||
          currentUser.user_metadata?.principal_nip ||
          schoolObj?.principal_nip ||
          '';

        const resolvedCity =
          localMeta.city ||
          currentUser.user_metadata?.city ||
          schoolObj?.city_regency ||
          '';

        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name || localMeta.fullName || currentUser.user_metadata?.full_name || (isSuperAdmin ? 'Pak Husnul' : 'Guru PAUD'),
          role: isSuperAdmin ? 'admin' : (data.role || 'guru'),
          nip: data.nip || localMeta.nip || currentUser.user_metadata?.nip || '',
          assigned_class: data.assigned_class || localMeta.assignedClass || currentUser.user_metadata?.assigned_class || 'A (4-5 Tahun)',
          school_id: data.school_id,
          school_name: resolvedSchoolName,
          principal_name: resolvedPrincipalName,
          principal_nip: resolvedPrincipalNip,
          city: resolvedCity,
          is_active: data.is_active ?? true,
          tier: detectedTier,
          monthly_quota: detectedTier === 'standar' ? 15 : 40,
        });
        return;
      }
    } catch (e) {
      console.warn('Profile fetch notice:', e);
    }

    // Fallback profile if database row not yet created
    const fallbackTier = (currentUser.user_metadata?.tier || (isSuperAdmin ? 'pro' : 'standar')) as 'standar' | 'pro' | 'free';
    setProfile({
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: localMeta.fullName || currentUser.user_metadata?.full_name || (isSuperAdmin ? 'Pak Husnul (Administrator)' : 'Guru PAUD'),
      role: isSuperAdmin ? 'admin' : (currentUser.user_metadata?.role || 'guru'),
      nip: localMeta.nip || currentUser.user_metadata?.nip || '',
      assigned_class: localMeta.assignedClass || currentUser.user_metadata?.assigned_class || 'A (4-5 Tahun)',
      school_name: localMeta.schoolName || currentUser.user_metadata?.school_name || (isSuperAdmin ? 'Kalandra PAUD Official' : 'Satuan PAUD'),
      principal_name: localMeta.principalName || currentUser.user_metadata?.principal_name || '',
      principal_nip: localMeta.principalNip || currentUser.user_metadata?.principal_nip || '',
      city: localMeta.city || currentUser.user_metadata?.city || '',
      is_active: true,
      tier: fallbackTier,
      monthly_quota: fallbackTier === 'standar' ? 15 : 40,
    });
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  useEffect(() => {
    // 1. Initial real session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // 2. Real auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        await fetchProfile(data.user);
      }
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Gagal masuk akun' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'admin' | 'guru' = 'guru',
    schoolName: string = 'TK NEGERI PEMBINA 01',
    assignedClass: string = 'A (4-5 Tahun)'
  ) => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const assignedRole = isSuperadminEmail(cleanEmail) ? 'admin' : 'guru';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            role: assignedRole,
            school_name: schoolName,
            assigned_class: assignedClass,
          },
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      setSession(data.session);
      setUser(data.user);
      if (data.user) {
        try {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: cleanEmail,
            full_name: cleanName,
            role: assignedRole,
            assigned_class: assignedClass,
          });
        } catch (dbErr) {
          console.warn('Upsert profile notice:', dbErr);
        }
        await fetchProfile(data.user);
      }
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Gagal mendaftar akun' };
    }
  };

  const updateProfile = async (updates: ProfileUpdateParams) => {
    if (!user) return { success: false, error: 'Belum masuk ke akun.' };

    const cleanName = updates.full_name !== undefined ? updates.full_name.trim() : (profile?.full_name || '');
    const cleanSchool = updates.school_name !== undefined ? updates.school_name.trim() : (profile?.school_name || '');
    const cleanNip = updates.nip !== undefined ? updates.nip.trim() : (profile?.nip || '');
    const cleanClass = updates.assigned_class || profile?.assigned_class || 'A (4-5 Tahun)';
    const cleanPrincipal = updates.principal_name !== undefined ? updates.principal_name.trim() : (profile?.principal_name || '');
    const cleanPrincipalNip = updates.principal_nip !== undefined ? updates.principal_nip.trim() : (profile?.principal_nip || '');
    const cleanCity = updates.city !== undefined ? updates.city.trim() : (profile?.city || '');

    // 1. Instantly update React state for 0-latency UI reflection
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            full_name: cleanName,
            school_name: cleanSchool,
            nip: cleanNip,
            assigned_class: cleanClass,
            principal_name: cleanPrincipal,
            principal_nip: cleanPrincipalNip,
            city: cleanCity,
          }
        : null
    );

    // 2. Persist in localStorage immediately
    try {
      localStorage.setItem(
        `kalandra_profile_meta_${user.id}`,
        JSON.stringify({
          fullName: cleanName,
          schoolName: cleanSchool,
          nip: cleanNip,
          assignedClass: cleanClass,
          principalName: cleanPrincipal,
          principalNip: cleanPrincipalNip,
          city: cleanCity,
        })
      );
      if (cleanSchool) {
        localStorage.setItem('kalandra_user_school_name', cleanSchool);
      }
    } catch (_) {}

    try {
      // 3. Update Supabase auth user_metadata
      await supabase.auth.updateUser({
        data: {
          full_name: cleanName,
          school_name: cleanSchool,
          nip: cleanNip,
          assigned_class: cleanClass,
          principal_name: cleanPrincipal,
          principal_nip: cleanPrincipalNip,
          city: cleanCity,
        },
      });

      // 4. Update profiles table (try with school_name & avatar_url fallback)
      try {
        const { error: pErr } = await supabase
          .from('profiles')
          .update({
            full_name: cleanName,
            nip: cleanNip,
            assigned_class: cleanClass,
            avatar_url: cleanSchool,
            school_name: cleanSchool,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', user.id);

        if (pErr && pErr.message?.includes('column')) {
          await supabase
            .from('profiles')
            .update({
              full_name: cleanName,
              nip: cleanNip,
              assigned_class: cleanClass,
              avatar_url: cleanSchool,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);
        }
      } catch (dbErr) {
        console.warn('Profiles update notice:', dbErr);
      }

      // 5. Update allowed_customers if present (for whitelist record)
      if (user.email) {
        try {
          await supabase
            .from('allowed_customers')
            .update({
              full_name: cleanName,
              school_name: cleanSchool,
              updated_at: new Date().toISOString(),
            })
            .eq('email', user.email.toLowerCase());
        } catch (_) {}
      }

      // 6. Update schools table if user has school_id
      if (profile?.school_id) {
        try {
          await supabase
            .from('schools')
            .update({
              name: cleanSchool,
              principal_name: cleanPrincipal,
              principal_nip: cleanPrincipalNip,
              city_regency: cleanCity,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.school_id);
        } catch (_) {}
      }

      return { success: true };
    } catch (err: any) {
      console.error('updateProfile error:', err);
      return { success: false, error: err.message || 'Gagal menyimpan pembaruan profil' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    isSuperadminEmail(user?.email) ||
    isSuperadminEmail(profile?.email)
  );

  const isPro = Boolean(isAdmin || profile?.tier === 'pro');
  const monthlyQuota = profile?.monthly_quota ?? (profile?.tier === 'standar' ? 15 : 40);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        isAdmin,
        isPro,
        monthlyQuota,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
