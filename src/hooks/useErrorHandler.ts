import { useCallback } from 'react';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import axios, { AxiosError } from 'axios';
import { setGlobalLoading } from '../redux/reducers/globalLoadingReducer';

type ErrorBody = {
  message?: string;
  error?: string;
};

const useErrorHandler = () => {
  const dispatch = useDispatch();

  const errorHandler = useCallback(
    (error: unknown): Promise<never> => {
      dispatch(setGlobalLoading(false));

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<ErrorBody>;

        if (!axiosErr.response) {
          const networkMessage =
            axiosErr.message ||
            'Erro de conexão. Verifique sua internet e tente novamente.';
          notification.error({
            message: networkMessage,
            className: 'error-notification',
          });
          return Promise.reject(error);
        }

        const status = axiosErr.response.status;
        const errorData = axiosErr.response.data;

        if (status === 400 && errorData?.message) {
          notification.error({
            message: errorData.message,
            className: 'error-notification',
          });
        } else if (status === 401) {
          notification.error({
            message: 'Sessão expirada. Por favor, faça login novamente.',
            className: 'error-notification',
          });
        } else if (status === 403) {
          notification.error({
            message: 'Você não tem permissão para realizar esta ação.',
            className: 'error-notification',
          });
        } else if (status === 404) {
          notification.error({
            message: 'Recurso não encontrado.',
            className: 'error-notification',
          });
        } else if (status === 500) {
          const serverMessage =
            errorData?.error ||
            'Erro interno do servidor. Tente novamente mais tarde.';
          notification.error({
            message: `Erro ${status}: ${serverMessage}`,
            className: 'error-notification',
          });
        } else if (errorData?.message) {
          notification.error({
            message: errorData.message,
            className: 'error-notification',
          });
        } else if (errorData?.error) {
          notification.error({
            message: errorData.error,
            className: 'error-notification',
          });
        } else {
          notification.error({
            message: `Erro ${status || 'desconhecido'}: Ocorreu algum erro na requisição, por favor tente novamente.`,
            className: 'error-notification',
          });
        }

        return Promise.reject(error);
      }

      const fallback =
        error instanceof Error
          ? error.message
          : 'Erro de conexão. Verifique sua internet e tente novamente.';
      notification.error({
        message: fallback,
        className: 'error-notification',
      });
      return Promise.reject(error);
    },
    [dispatch]
  );

  return errorHandler;
};

export default useErrorHandler;
