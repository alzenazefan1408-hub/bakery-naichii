import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../api';
import useLocalStorage from '../hooks/useLocalStorage';

interface User {
  id: number;
  nama: string;
  email: string;
  role: string;
  foto?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [stored, setStored] = useLocalStorage<AuthState>('naichii-auth', { user: null, token: null, loading: true });
  const [state, setState] = useState<AuthState>(stored);

  useEffect(() => {
    setAuthToken(state.token);
    setStored(state);
  }, [state, setStored]);

  const login = (token: string, user: User) => setState({ user, token, loading: false });
  const logout = () => setState({ user: null, token: null, loading: false });

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
