import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});




/*
// Configura token JWT para todas as requisições

import { useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export const useApi = () => {
  const { token } = useAuth();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    // Configura token JWT para todas as requisições
    if (token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return instance;
  }, [token]);

  return api;
};

*/