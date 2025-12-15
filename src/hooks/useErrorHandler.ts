import { useCallback } from 'react';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../redux/reducers/globalLoadingReducer';


const useErrorHandler = () => {
  const dispatch = useDispatch();

  const errorHandler = useCallback((error: any): Promise<PromiseRejectedResult> => {
    dispatch(setGlobalLoading(false));
    
    // Erro de rede (sem response) - ex: Network Error, timeout, etc
    if (!error.response) {
      const networkMessage = error.message || 'Erro de conexão. Verifique sua internet e tente novamente.';
      notification.error({
        message: networkMessage,
        className: 'error-notification',
      });
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorData = error.response.data;

    // Erro 400 - Bad Request (validação)
    if (status === 400 && errorData?.message) {
      notification.error({
        message: errorData.message,
        className: 'error-notification',
      });
    }
    // Erro 401 - Unauthorized (já tratado no interceptor para refresh token)
    else if (status === 401) {
      notification.error({
        message: 'Sessão expirada. Por favor, faça login novamente.',
        className: 'error-notification',
      });
    }
    // Erro 403 - Forbidden
    else if (status === 403) {
      notification.error({
        message: 'Você não tem permissão para realizar esta ação.',
        className: 'error-notification',
      });
    }
    // Erro 404 - Not Found
    else if (status === 404) {
      notification.error({
        message: 'Recurso não encontrado.',
        className: 'error-notification',
      });
    }
    // Erro 500 - Internal Server Error
    else if (status === 500) {
      const serverMessage = errorData?.error || 'Erro interno do servidor. Tente novamente mais tarde.';
      notification.error({
        message: `Erro ${status}: ${serverMessage}`,
        className: 'error-notification',
      });
    }
    // Outros erros HTTP
    else if (errorData?.message) {
      notification.error({
        message: errorData.message,
        className: 'error-notification',
      });
    } else if (errorData?.error) {
      notification.error({
        message: errorData.error,
        className: 'error-notification',
      });
    }
    // Erro genérico
    else {
      notification.error({
        message: `Erro ${status || 'desconhecido'}: Ocorreu algum erro na requisição, por favor tente novamente.`,
        className: 'error-notification',
      });
    }
    
    return Promise.reject(error);
  }, [dispatch]);

  return errorHandler;
};

export default useErrorHandler;