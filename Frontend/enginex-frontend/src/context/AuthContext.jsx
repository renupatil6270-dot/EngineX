// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const migrateLegacyToken = () => {
    const token = localStorage.getItem('token');
    const legacyToken = localStorage.getItem('authToken');
    if (!token && legacyToken) {
      localStorage.setItem('token', legacyToken);
      localStorage.removeItem('authToken');
      return legacyToken;
    }
    return token;
  };

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(migrateLegacyToken);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed', { cause: error });
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await API.post('/auth/signup', { name, email, password });
      const { token: jwtToken, user: userData } = response.data;

      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', jwtToken);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed', { cause: error });
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}