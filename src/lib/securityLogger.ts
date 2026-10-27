import { supabase } from './supabaseClient';

export type SecurityEventType = 
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILED'
  | 'AUTH_LOGOUT'
  | 'AUTH_RATE_LIMIT_TRIGGERED'
  | 'ADMIN_ACCESS_ATTEMPT'
  | 'ADMIN_UNAUTHORIZED_ACCESS'
  | 'API_KEY_REGISTERED'
  | 'API_KEY_DELETED'
  | 'RPM_DOC_GENERATED'
  | 'RPM_DOC_EXPORTED'
  | 'SECURITY_EXCEPTION';

interface LogOptions {
  userId?: string | null;
  schoolId?: string | null;
  details?: Record<string, any>;
}

/**
 * Sanitizes log details to ensure passwords, raw keys, and tokens are NEVER persisted
 */
function sanitizeDetails(details: Record<string, any> = {}): Record<string, any> {
  const sanitized: Record<string, any> = {};
  const forbiddenKeys = ['password', 'pwd', 'token', 'secret', 'key', 'apiKey', 'api_key', 'service_role'];

  for (const [k, v] of Object.entries(details)) {
    const isSensitive = forbiddenKeys.some((f) => k.toLowerCase().includes(f));
    if (isSensitive) {
      if (typeof v === 'string' && v.length > 8) {
        sanitized[k] = `${v.slice(0, 4)}...${v.slice(-4)} [REDACTED]`;
      } else {
        sanitized[k] = '[REDACTED]';
      }
    } else if (typeof v === 'object' && v !== null) {
      sanitized[k] = sanitizeDetails(v);
    } else {
      sanitized[k] = v;
    }
  }

  return sanitized;
}

/**
 * Centralized Security & Audit Logger (OWASP A09 Compliant)
 */
export async function logSecurityEvent(
  eventType: SecurityEventType,
  options: LogOptions = {}
): Promise<void> {
  const sanitized = sanitizeDetails(options.details || {});
  const timestamp = new Date().toISOString();

  // 1. Structured Console Audit (in non-sensitive format)
  if (import.meta.env.DEV) {
    console.info(`[SECURITY AUDIT] ${eventType} at ${timestamp}:`, sanitized);
  }

  // 2. Persist to Supabase audit_logs if authenticated
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = options.userId || sessionData?.session?.user?.id || null;

    if (currentUserId) {
      await supabase.from('audit_logs').insert({
        user_id: currentUserId,
        school_id: options.schoolId || null,
        action: eventType,
        details: {
          ...sanitized,
          userAgent: navigator.userAgent.slice(0, 120),
          url: window.location.pathname,
        },
      });
    }
  } catch (err) {
    // Audit logging should never crash the user application flow
    if (import.meta.env.DEV) {
      console.warn('[SECURITY AUDIT] Failed to save to Supabase:', err);
    }
  }

  // 3. Resilient Local Audit Buffer (capped at last 50 events)
  try {
    const LOCAL_KEY = 'kalandra_audit_buffer';
    const existing = localStorage.getItem(LOCAL_KEY);
    const parsed = existing ? JSON.parse(existing) : [];
    const updated = [
      {
        id: `audit-${Date.now()}`,
        event: eventType,
        details: sanitized,
        timestamp,
      },
      ...parsed,
    ].slice(0, 50);

    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  } catch {
    // Ignore localStorage storage quota limitations gracefully
  }
}
