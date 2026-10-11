import { useEffect, useState } from 'react';
import API from '../utils/api';
import { AuthContext } from './contextStore';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  const authenticate = (data) => {
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => authenticate(
    (await API.post('/auth/login', { email, password })).data,
  );

  const signup = async (name, email, password) => authenticate(
    (await API.post('/auth/signup', { name, email, password })).data,
  );

  const logout = () => {
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading: false, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
