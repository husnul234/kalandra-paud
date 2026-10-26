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

export interface AllowedCustomerInfo {
  allowed: boolean;
  fullName?: string;
  schoolName?: string;
  accountType?: string;
  isActive?: boolean;
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
  switchToDemoRole: (role: 'admin' | 'guru') => void;
  checkAllowedCustomer: (email: string) => Promise<AllowedCustomerInfo>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Default initial guest/demo profile
  const defaultGuruProfile: UserProfile = {
    id: 'demo-guru-123',
    email: 'guru.dewi@paudceria.sch.id',
    full_name: 'Dewi Rahmawati, S.Pd.',
    role: 'guru',
    nip: '198906142015032002',
    assigned_class: 'A (4-5 Tahun)',
    school_name: 'TK NEGERI PEMBINA 01',
    is_active: true,
  };

  const defaultAdminProfile: UserProfile = {
    id: 'admin-husnul-root',
    email: 'pakhusnulid@gmail.com',
    full_name: 'Pak Husnul (Administrator)',
    role: 'admin',
    nip: '197508122002122001',
    school_name: 'Kalandra PAUD Official',
    is_active: true,
  };

  // Helper to detect if email is superadmin
  const isSuperadminEmail = (emailToCheck?: string | null): boolean => {
    return emailToCheck?.trim().toLowerCase() === 'pakhusnulid@gmail.com';
  };

  // Fetch or setup profile
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
          full_name: data.full_name || currentUser.email?.split('@')[0] || 'Guru PAUD',
          // pakhusnulid@gmail.com selalu menjadi admin
          role: isSuperAdmin ? 'admin' : (data.role || 'guru'),
          nip: data.nip,
          assigned_class: data.assigned_class || 'A (4-5 Tahun)',
          school_id: data.school_id,
          school_name: (data.schools as any)?.name || 'TK NEGERI PEMBINA 01',
          is_active: data.is_active ?? true,
        });
        return;
      }
    } catch (e) {
      console.warn('Profile fetch warning:', e);
    }

    // Fallback profile if database row not yet created
    setProfile({
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: (currentUser.user_metadata as any)?.full_name || (isSuperAdmin ? 'Pak Husnul (Administrator)' : 'Dewi Rahmawati, S.Pd.'),
      role: isSuperAdmin ? 'admin' : ((currentUser.user_metadata as any)?.role || 'guru'),
      assigned_class: 'A (4-5 Tahun)',
      school_name: isSuperAdmin ? 'Kalandra PAUD Official' : 'TK NEGERI PEMBINA 01',
      is_active: true,
    });
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  // Check whitelist in allowed_customers
  const checkAllowedCustomer = async (emailToCheck: string): Promise<AllowedCustomerInfo> => {
    if (isSuperadminEmail(emailToCheck)) {
      return {
        allowed: true,
        fullName: 'Pak Husnul (Administrator)',
        schoolName: 'Kalandra PAUD Official',
        accountType: 'lifetime',
        isActive: true,
      };
    }

    try {
      const { data, error } = await supabase
        .from('allowed_customers')
        .select('*')
        .ilike('email', emailToCheck.trim())
        .maybeSingle();

      if (error || !data) {
        return { allowed: false };
      }

      return {
        allowed: true,
        fullName: data.full_name,
        schoolName: data.school_name,
        accountType: data.account_type,
        isActive: data.is_active,
      };
    } catch (err) {
      console.error('Error checking allowed customer:', err);
      return { allowed: false };
    }
  };

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        const savedDemoRole = localStorage.getItem('kalandra_demo_role');
        setProfile(savedDemoRole === 'admin' ? defaultAdminProfile : defaultGuruProfile);
        setLoading(false);
      }
    });

    // 2. Auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).finally(() => setLoading(false));
      } else {
        const savedDemoRole = localStorage.getItem('kalandra_demo_role');
        setProfile(savedDemoRole === 'admin' ? defaultAdminProfile : defaultGuruProfile);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
    const assignedRole = isSuperadminEmail(email) ? 'admin' : role;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
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
            email,
            full_name: fullName,
            role: assignedRole,
            assigned_class: assignedClass,
          });
        } catch (dbErr) {
          console.warn('Upsert profile error:', dbErr);
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
    setProfile(defaultGuruProfile);
    localStorage.removeItem('kalandra_demo_role');
  };

  const switchToDemoRole = (role: 'admin' | 'guru') => {
    localStorage.setItem('kalandra_demo_role', role);
    setProfile(role === 'admin' ? defaultAdminProfile : defaultGuruProfile);
  };

  const isAdmin = profile?.role === 'admin' || isSuperadminEmail(user?.email) || isSuperadminEmail(profile?.email);

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
        switchToDemoRole,
        checkAllowedCustomer,
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
