import { useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import useErrorHandler from './useErrorHandler';
import { setGlobalLoading } from '../redux/reducers/globalLoadingReducer';
import { api } from '../services/api';
import { TOKEN_KEY } from '../types/Constantes';
import { isTokenExpired, getTokenFromStorage } from '../utils/tokenUtils';
import KeycloakSingleton from '../contexto/Keycloak';

const useApiInterceptors = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();
  const errorHandlerRef = useRef(errorHandler);

  // Atualiza a ref sempre que errorHandler mudar (que só acontece se dispatch mudar, o que é raro)
  useEffect(() => {
    errorHandlerRef.current = errorHandler;
  }, [errorHandler]);

  useEffect(() => {
    let isRefreshing = false;
    let failedQueue: Array<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (value?: any) => void;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      reject: (reason?: any) => void;
    }> = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processQueue = (error: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (error) {
          prom.reject(error);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    const requestInterceptor = api.interceptors.request.use(
      async (request) => {
        dispatch(setGlobalLoading(true));
        
        // Obtém o token do sessionStorage
        let token = getTokenFromStorage();
        
        // Valida se o token está expirado
        if (token && isTokenExpired(token)) {
          // Se está renovando, aguarda
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((newToken) => {
              request.headers.Authorization = `Bearer ${newToken}`;
              return request;
            }).catch((error) => {
              return Promise.reject(error);
            });
          }

          // Inicia renovação do token
          isRefreshing = true;
          try {
            const keycloak = KeycloakSingleton.getInstance();
            const refreshed = await keycloak.updateToken(30);
            
            if (refreshed && keycloak.token) {
              token = keycloak.token;
              sessionStorage.setItem(TOKEN_KEY, token);
              processQueue(null, token);
            } else {
              // Token não foi renovado, mas ainda pode ser válido
              token = getTokenFromStorage();
              processQueue(null, token);
            }
          } catch (error) {
            processQueue(error);
            // Se falhar na renovação, pode tentar continuar com o token atual
            token = getTokenFromStorage();
          } finally {
            isRefreshing = false;
          }
        }

        // Adiciona o token no header se existir
        if (token) {
          request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        dispatch(setGlobalLoading(false));
        return response;
      },
      async (error) => {
        dispatch(setGlobalLoading(false));
        
        // Se receber 401 (não autorizado), tenta renovar o token
        const originalRequest = error.config;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (originalRequest as any)._retry = true;

          try {
            const keycloak = KeycloakSingleton.getInstance();
            const refreshed = await keycloak.updateToken(30);
            
            if (refreshed && keycloak.token) {
              const newToken = keycloak.token;
              sessionStorage.setItem(TOKEN_KEY, newToken);
              
              // Repete a requisição original com o novo token
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api.request(originalRequest);
            }
          } catch (refreshError) {
            console.error("Erro ao renovar token após 401:", refreshError);
            // Se falhar, chama o errorHandler que pode fazer logout
          }
        }

        return errorHandlerRef.current(error);
      },
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);
};


export default useApiInterceptors;