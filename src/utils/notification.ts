import { notification } from 'antd';

export const notifySuccess = (message = 'Operação realizada com sucesso.') =>
  notification.success({ message, className: 'success-notification' });

export const notifyError = (message = 'Erro inesperado, tente novamente mais tarde.') =>
  notification.error({ message, className: 'error-notification' });