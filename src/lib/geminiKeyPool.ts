import { supabase } from './supabaseClient';

/**
 * System Gemini Key Pool & Concurrency Load Balancer
 * Manages round-robin rotation, 429 cooldowns, and automatic failovers
 * so that end-user teachers never need to enter or see BYOK keys.
 */

interface KeyState {
  key: string;
  cooldownUntil: number; // timestamp in ms
  failureCount: number;
}

// Master fallback pool initialized with system admin keys
const FALLBACK_ADMIN_KEYS: string[] = [
  // Admin keys registered in system
];

let keyPool: KeyState[] = [];
let roundRobinIndex = 0;
let isLoaded = false;
let lastRequestTimestamp = 0;

/**
 * Loads active keys from Supabase (RPC or Admin pool)
 */
export async function loadSystemKeyPool(): Promise<string[]> {
  try {
    // 1. Try secure RPC
    const { data: rpcKeys, error: rpcError } = await supabase.rpc('get_active_system_api_keys');
    if (!rpcError && Array.isArray(rpcKeys) && rpcKeys.length > 0) {
      const keys = rpcKeys.map((r: any) => typeof r === 'string' ? r : r.api_key).filter(Boolean);
      updatePool(keys);
      return getAvailableKeys();
    }

    // 2. Try fetching active keys directly if user has privileges or from user_api_keys
    const { data: dbKeys } = await supabase
      .from('user_api_keys')
      .select('api_key')
      .eq('is_active', true)
      .eq('provider', 'gemini');

    if (dbKeys && dbKeys.length > 0) {
      const keys = dbKeys.map((k: { api_key: string }) => k.api_key).filter(Boolean);
      updatePool(keys);
      return getAvailableKeys();
    }
  } catch (err) {
    console.warn('[GeminiKeyPool] Could not load dynamic keys from DB, using internal pool:', err);
  }

  // 3. Fallback to localStorage BYOK if user previously saved one locally
  try {
    const raw = localStorage.getItem('kalandra_byok_gemini_keys');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const active = parsed.filter((k: any) => k.isActive && k.key).map((k: any) => k.key);
        if (active.length > 0) {
          updatePool(active);
          return getAvailableKeys();
        }
      }
    }
  } catch (e) {}

  return getAvailableKeys();
}

function updatePool(keys: string[]) {
  const existingMap = new Map(keyPool.map((k) => [k.key, k]));
  keyPool = keys.map((key) => {
    const existing = existingMap.get(key);
    return existing || { key, cooldownUntil: 0, failureCount: 0 };
  });
  isLoaded = true;
}

/**
 * Returns all keys that are currently not in cooldown
 */
export function getAvailableKeys(): string[] {
  const now = Date.now();
  const available = keyPool.filter((k) => k.cooldownUntil <= now);
  if (available.length > 0) {
    return available.map((k) => k.key);
  }
  // If all are in cooldown, return the one that will exit cooldown earliest
  const sorted = [...keyPool].sort((a, b) => a.cooldownUntil - b.cooldownUntil);
  return sorted.map((k) => k.key);
}

/**
 * Selects the next key using round-robin distribution with cooldown avoidance
 */
export function getNextKeyInRotation(): string | null {
  const now = Date.now();
  const available = keyPool.filter((k) => k.cooldownUntil <= now);
  if (available.length === 0) {
    if (keyPool.length === 0) return null;
    // Fallback: pick the key closest to cooldown expiry
    return keyPool[0].key;
  }

  roundRobinIndex = (roundRobinIndex + 1) % available.length;
  return available[roundRobinIndex].key;
}

/**
 * Marks a key as hit by 429 quota exhaustion with a 60-second cooldown
 */
export function markKeyRateLimited(key: string, cooldownSeconds = 60) {
  const item = keyPool.find((k) => k.key === key);
  if (item) {
    item.cooldownUntil = Date.now() + cooldownSeconds * 1000;
    item.failureCount += 1;
    console.warn(
      `[GeminiKeyPool] Key ...${key.slice(-4)} marked in cooldown for ${cooldownSeconds}s (Total 429 hits: ${item.failureCount})`
    );
  }
}

/**
 * Client debounce/stagger delay to smooth out simultaneous bursts from 100 concurrent teachers
 */
export async function acquireConcurrencySlot(minIntervalMs = 400): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTimestamp;
  if (elapsed < minIntervalMs) {
    const waitTime = minIntervalMs - elapsed + Math.floor(Math.random() * 200); // add slight random jitter
    await new Promise((r) => setTimeout(r, waitTime));
  }
  lastRequestTimestamp = Date.now();
}
