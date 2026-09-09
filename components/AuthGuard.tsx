import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { get } from '../helpers/api_helper';
import { AUTH_CHANGED_EVENT, getTokenExpiry, getValidAuthToken, removeAuthToken } from '../helpers/authHelper';

// These pages intentionally support visitors; every other page requires a session.
export const isPublicPage = (pathname: string) =>
  ['/', '/login', '/catalogue', '/privacypolicy', '/terms&condition', '/404'].includes(pathname.replace(/\/+$/, '') || '/');

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const publicPage = isPublicPage(router.pathname);
  const [allowed, setAllowed] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!router.isReady || publicPage) return;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    let generation = 0;
    const rejectSession = () => {
      setAllowed(false);
      // removeAuthToken emits a same-tab event; remove it here to avoid recursion.
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChange);
      void removeAuthToken();
      void router.replace('/login').catch(() => {});
    };
    const scheduleExpiry = (token: string) => {
      clearTimeout(timer);
      const remaining = (getTokenExpiry(token) || 0) - Date.now();
      timer = setTimeout(onAuthChange, Math.min(Math.max(remaining, 0), 2147483647));
    };
    async function validate() {
      const current = ++generation;
      const token = getValidAuthToken();
      if (!token) { rejectSession(); return; }
      setError(false);
      try {
        // Expiry checks in the browser are only a UI gate; server verifies the signature.
        const result = await get('/user/auth/session');
        if (disposed || current !== generation) return;
        if (result.isError || !result.data?.authenticated || getValidAuthToken() !== token) {
          rejectSession(); return;
        }
        setAllowed(true);
        scheduleExpiry(token);
      } catch (error: any) {
        if (disposed || current !== generation) return;
        setAllowed(false);
        if (error.response?.status === 401) rejectSession();
        else setError(true);
      }
    }
    function onAuthChange() {
      if (disposed) return;
      if (!getValidAuthToken()) setAllowed(false);
      void validate();
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'authToken' || event.key === null) onAuthChange();
    };
    const onVisibility = () => { if (document.visibilityState === 'visible') onAuthChange(); };
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChange);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onAuthChange);
    document.addEventListener('visibilitychange', onVisibility);
    void validate();
    return () => {
      disposed = true;
      clearTimeout(timer);
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChange);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onAuthChange);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [router.isReady, publicPage, router]);

  if (publicPage) return <>{children}</>;
  if (!allowed) return error ? <div role="alert">Unable to verify your session. <button onClick={() => window.location.reload()}>Retry</button></div> : null;
  return <>{children}</>;
}
