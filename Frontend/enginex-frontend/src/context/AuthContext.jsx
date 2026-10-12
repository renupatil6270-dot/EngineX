import { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;
    API.get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const authenticate = ({ user: authenticatedUser, token: authenticatedToken }) => {
    setUser(authenticatedUser);
    setToken(authenticatedToken);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    localStorage.setItem('token', authenticatedToken);
  };

  const login = async (email, password) => authenticate((await API.post('/auth/login', { email, password })).data);
  const signup = async (name, email, password) => authenticate((await API.post('/auth/signup', { name, email, password })).data);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
