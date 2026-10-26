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
  phone?: string;
  is_active: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
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

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, schools(name)')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setProfile({
          id: data.id,
          email: data.email,
          full_name: data.full_name || currentUser.user_metadata?.full_name || (isSuperAdmin ? 'Pak Husnul' : 'Guru PAUD'),
          role: isSuperAdmin ? 'admin' : (data.role || 'guru'),
          nip: data.nip || '',
          assigned_class: data.assigned_class || 'A (4-5 Tahun)',
          school_id: data.school_id,
          school_name: (data.schools as any)?.name || currentUser.user_metadata?.school_name || 'TK NEGERI PEMBINA 01',
          is_active: data.is_active ?? true,
        });
        return;
      }
    } catch (e) {
      console.warn('Profile fetch notice:', e);
    }

    // Fallback profile if database row not yet created
    setProfile({
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: currentUser.user_metadata?.full_name || (isSuperAdmin ? 'Pak Husnul (Administrator)' : 'Guru PAUD'),
      role: isSuperAdmin ? 'admin' : (currentUser.user_metadata?.role || 'guru'),
      assigned_class: currentUser.user_metadata?.assigned_class || 'A (4-5 Tahun)',
      school_name: currentUser.user_metadata?.school_name || (isSuperAdmin ? 'Kalandra PAUD Official' : 'TK NEGERI PEMBINA 01'),
      is_active: true,
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
    const assignedRole = isSuperadminEmail(cleanEmail) ? 'admin' : role;

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

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        refreshProfile,
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
