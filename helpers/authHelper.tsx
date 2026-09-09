export const AUTH_CHANGED_EVENT = 'gajra-auth-changed';

export const getTokenExpiry = (token: string): number | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || parts.some(part => !part)) return null;
    const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')));
    return typeof payload.exp === 'number' && Number.isFinite(payload.exp) ? payload.exp * 1000 : null;
  } catch { return null; }
};

export const getValidAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem('authToken');
    const token = stored ? JSON.parse(stored) : null;
    if (typeof token !== 'string') return null;
    const expiresAt = getTokenExpiry(token);
    return expiresAt !== null && expiresAt > Date.now() ? token : null;
  } catch { return null; }
};

export const setLoginAuthToken = (data: string) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('authToken', JSON.stringify(data));
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

// Keep the serialized return value for existing callers.
export const getAuthToken = async () => {
  if (typeof window === 'undefined') return null;
  try { return window.localStorage.getItem('authToken'); } catch { return null; }
};

export const removeAuthToken = async () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('authInfo');
  window.localStorage.removeItem('authToken');
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const isUserLoggedIn = async (_data?: string) => !!getValidAuthToken();
