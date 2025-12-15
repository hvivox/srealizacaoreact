import { notification } from 'antd';

export const notifySuccess = (message = 'Operação realizada com sucesso.') =>
  notification.success({ message, className: 'success-notification' });

export const notifyError = (message = 'Erro inesperado, tente novamente mais tarde.') =>
  notification.error({ message, className: 'error-notification' });

/**
 * Extrai uma mensagem de erro específica de um objeto de erro
 * @param error - Objeto de erro que pode conter response.data.message, response.data.error, ou message
 * @param defaultMessage - Mensagem padrão caso não seja possível extrair uma mensagem específica
 * @returns Mensagem de erro específica ou a mensagem padrão
 */
export const getErrorMessage = (
  error: any,
  defaultMessage = 'Erro inesperado, tente novamente mais tarde.'
): string => {
  // Tenta extrair mensagem do response.data.message (erros de validação)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Tenta extrair mensagem do response.data.error (erros do servidor)
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  // Tenta extrair mensagem direta do error.message (erros de rede, etc)
  if (error?.message) {
    return error.message;
  }

  // Retorna mensagem padrão se não conseguir extrair nenhuma mensagem
  return defaultMessage;
};