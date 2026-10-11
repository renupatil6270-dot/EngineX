import { useContext } from 'react';
import { AuthContext } from './contextStore';

export function useAuth() {
  return useContext(AuthContext);
}
