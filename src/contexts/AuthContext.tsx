import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiCheckAuth, apiLogin, apiLogout } from '../api';

type AuthStatus = 'checking' | 'offline' | 'unauthenticated' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    apiCheckAuth()
      .then((authenticated) => setStatus(authenticated ? 'authenticated' : 'unauthenticated'))
      .catch(() => setStatus('offline'));
  }, []);

  const login = async (password: string) => {
    const ok = await apiLogin(password);
    if (ok) setStatus('authenticated');
    return ok;
  };

  const logout = () => {
    apiLogout().finally(() => setStatus('unauthenticated'));
  };

  return <AuthContext.Provider value={{ status, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
