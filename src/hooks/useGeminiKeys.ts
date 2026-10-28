import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { testGeminiApiKey } from '../lib/gemini-rpm-engine';
import { getDattioApiKey } from '../lib/dattio-client';

export interface UserApiKey {
  id: string;
  provider: 'gemini' | 'openai' | 'anthropic';
  api_key: string;
  label: string;
  is_active: boolean;
  created_at?: string;
  last_used_at?: string;
}

const LOCAL_STORAGE_KEY = 'kalandra_byok_gemini_keys';

// Helper to validate whether a string is a standard UUID (v4/v1 etc.)
const isValidUuid = (id?: string | null): boolean => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

export function useGeminiKeys(userId?: string) {
  const [keys, setKeys] = useState<UserApiKey[]>([]);
  const [systemKeys, setSystemKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Load keys from Supabase or LocalStorage
  const loadKeys = useCallback(async () => {
    setLoading(true);
    let loaded: UserApiKey[] = [];

    // Try Supabase only if user is logged in with a valid UUID
    if (userId && isValidUuid(userId)) {
      try {
        const { data, error } = await supabase
          .from('user_api_keys')
          .select('*')
          .eq('user_id', userId)
          .in('provider', ['gemini', 'openai'])
          .order('created_at', { ascending: true });

        if (!error && data && data.length > 0) {
          loaded = data;
        }
      } catch (err) {
        console.warn('Supabase key fetch error, falling back to local storage:', err);
      }
    }

    // Fallback to local storage
    if (loaded.length === 0) {
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (local) {
          loaded = JSON.parse(local);
        }
      } catch (e) {
        console.error('Error reading keys from local storage:', e);
      }
    }

    setKeys(loaded);

    // Also fetch system admin keys pool from demo_api_keys or localStorage
    let sysPool: string[] = [];

    // 1. Dattio AI Primary Enterprise Key
    try {
      const dattioKey = getDattioApiKey();
      if (dattioKey && dattioKey.startsWith('sk-')) {
        sysPool.push(dattioKey);
      }
    } catch (_) {}

    try {
      const { data: demoData, error: demoErr } = await supabase
        .from('demo_api_keys')
        .select('api_key')
        .eq('is_active', true);

      if (!demoErr && demoData && demoData.length > 0) {
        const dbDemoKeys = demoData.map((d: { api_key: string }) => d.api_key).filter(Boolean);
        sysPool.push(...dbDemoKeys);
      }
    } catch (e) {
      console.warn('Could not fetch demo_api_keys:', e);
    }

    if (sysPool.length <= 1) {
      try {
        const rawDemo = localStorage.getItem('kalandra_system_demo_keys');
        if (rawDemo) {
          const parsed = JSON.parse(rawDemo);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const localSys = parsed.filter((k: any) => k.is_active && k.api_key).map((k: any) => k.api_key);
            sysPool.push(...localSys);
          }
        }
      } catch (e) {}
    }

    const uniqueSysPool = Array.from(new Set(sysPool.filter(Boolean)));
    setSystemKeys(uniqueSysPool);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  // Save to local storage as continuous sync
  const syncLocalStorage = (updatedKeys: UserApiKey[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedKeys));
    } catch (e) {
      console.error('Failed to sync to local storage:', e);
    }
  };

  // Add new key
  const addKey = async (apiKey: string, label: string = ''): Promise<{ success: boolean; error?: string }> => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) return { success: false, error: 'Kunci API tidak boleh kosong.' };

    const isDattio = cleanKey.startsWith('sk-');
    const newKeyObj: UserApiKey = {
      id: crypto.randomUUID ? crypto.randomUUID() : `key-${Date.now()}`,
      provider: isDattio ? 'openai' : 'gemini',
      api_key: cleanKey,
      label: label.trim() || (isDattio ? `Kunci Dattio AI ${keys.length + 1}` : `Kunci Gemini ${keys.length + 1}`),
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (userId && isValidUuid(userId)) {
      try {
        const { error } = await supabase.from('user_api_keys').insert({
          user_id: userId,
          provider: newKeyObj.provider,
          api_key: newKeyObj.api_key,
          label: newKeyObj.label,
          is_active: true,
        });

        if (error) {
          console.warn('Could not insert key to Supabase, saving locally:', error);
        }

        // Also sync to demo_api_keys pool for shared teacher access
        try {
          await supabase.from('demo_api_keys').insert({
            api_key: newKeyObj.api_key,
            label: newKeyObj.label,
            is_active: true,
          });
        } catch (_) {}
      } catch (e) {
        console.warn('Network error saving to Supabase:', e);
      }
    }

    const updated = [...keys, newKeyObj];
    setKeys(updated);
    syncLocalStorage(updated);
    return { success: true };
  };

  // Toggle key active status
  const toggleKey = async (id: string) => {
    const target = keys.find((k) => k.id === id);
    if (!target) return;
    const newStatus = !target.is_active;

    if (userId && isValidUuid(userId) && isValidUuid(id)) {
      try {
        await supabase
          .from('user_api_keys')
          .update({ is_active: newStatus })
          .eq('id', id);
      } catch (err) {
        console.warn('Supabase toggle error:', err);
      }
    }

    const updated = keys.map((k) => (k.id === id ? { ...k, is_active: newStatus } : k));
    setKeys(updated);
    syncLocalStorage(updated);
  };

  // Delete key
  const deleteKey = async (id: string) => {
    if (userId && isValidUuid(userId) && isValidUuid(id)) {
      try {
        await supabase.from('user_api_keys').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const updated = keys.filter((k) => k.id !== id);
    setKeys(updated);
    syncLocalStorage(updated);
  };

  // Test single key connectivity
  const testKey = async (id: string) => {
    const target = keys.find((k) => k.id === id);
    if (!target) return;

    setTestingKeyId(id);
    setTestResult(null);

    const res = await testGeminiApiKey(target.api_key);
    setTestingKeyId(null);

    if (res.success) {
      setTestResult({
        id,
        success: true,
        message: `Koneksi Berhasil! Model ${res.model} aktif merespons.`,
      });
    } else {
      setTestResult({
        id,
        success: false,
        message: res.error || 'Gagal menghubungi Gemini API.',
      });
    }
  };

  const userActiveKeys = keys.filter((k) => k.is_active).map((k) => k.api_key);
  // If user has personal active keys, use them. Otherwise, seamlessly use admin system pool keys.
  const activeKeys = userActiveKeys.length > 0 ? userActiveKeys : systemKeys;

  return {
    keys,
    activeKeys,
    systemKeys,
    systemKeyCount: systemKeys.length,
    isUsingSystemKeys: userActiveKeys.length === 0 && systemKeys.length > 0,
    loading,
    addKey,
    toggleKey,
    deleteKey,
    testKey,
    testingKeyId,
    testResult,
    refreshKeys: loadKeys,
  };
}
