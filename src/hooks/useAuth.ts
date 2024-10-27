import { useContext } from 'react';
import { AuthContext } from '../contexto/AuthProvider';

export const useAuth = () => useContext(AuthContext);