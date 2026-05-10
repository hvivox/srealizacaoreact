import { notification } from 'antd';
import axios from 'axios';

export const notifySuccess = (message = 'Operação realizada com sucesso.') =>
  notification.success({ message, className: 'success-notification' });

export const notifyError = (message = 'Erro inesperado, tente novamente mais tarde.') =>
  notification.error({ message, className: 'error-notification' });

type ErrorBody = {
  message?: string;
  error?: string;
};

/**
 * Extrai uma mensagem de erro específica de um objeto de erro
 * @param error - Objeto de erro que pode conter response.data.message, response.data.error, ou message
 * @param defaultMessage - Mensagem padrão caso não seja possível extrair uma mensagem específica
 * @returns Mensagem de erro específica ou a mensagem padrão
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage = 'Erro inesperado, tente novamente mais tarde.'
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorBody | undefined;
    if (data?.message) {
      return data.message;
    }
    if (data?.error) {
      return data.error;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return defaultMessage;
};
