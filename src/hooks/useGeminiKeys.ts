import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { testGeminiApiKey } from '../lib/gemini-rpm-engine';

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

export function useGeminiKeys(userId?: string) {
  const [keys, setKeys] = useState<UserApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Load keys from Supabase or LocalStorage
  const loadKeys = useCallback(async () => {
    setLoading(true);
    let loaded: UserApiKey[] = [];

    // Try Supabase if user is logged in
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('user_api_keys')
          .select('*')
          .eq('user_id', userId)
          .eq('provider', 'gemini')
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

    const newKeyObj: UserApiKey = {
      id: crypto.randomUUID ? crypto.randomUUID() : `key-${Date.now()}`,
      provider: 'gemini',
      api_key: cleanKey,
      label: label.trim() || `Kunci Gemini ${keys.length + 1}`,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    if (userId) {
      try {
        const { error } = await supabase.from('user_api_keys').insert({
          user_id: userId,
          provider: 'gemini',
          api_key: newKeyObj.api_key,
          label: newKeyObj.label,
          is_active: true,
        });

        if (error) {
          console.warn('Could not insert key to Supabase, saving locally:', error);
        }
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

    if (userId && !id.startsWith('key-')) {
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
    if (userId && !id.startsWith('key-')) {
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

  const activeKeys = keys.filter((k) => k.is_active).map((k) => k.api_key);

  return {
    keys,
    activeKeys,
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
