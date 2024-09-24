import { notification, message } from 'antd';
import { useDispatch } from 'react-redux';
import { setGlobalLoading } from '../redux/reducers/globalLoading';


const useErrorHandler = () => {
  const dispatch = useDispatch();

  const errorHandler = (error: {
    response: { status: number; data: { error: string; message: string } };
  }): Promise<PromiseRejectedResult> => {
    dispatch(setGlobalLoading(false));
    if (error?.response?.data && error.response.status === 400) {
      notification.error({
        message: `${error.response.data.message}`,
        className: 'error-notification',
      });
    } else if (error?.response?.data && error.response.status === 500) {
      notification.error({
        message: `Erro ${error.response.status}: ${error.response.data.error}`,
        className: 'error-notification',
      });
    } else {
      message.error(
        'Ocorreu algum erro na requisição, por favor tente novamente.',
      );
    }
    return Promise.reject(error);
  };

  return errorHandler;
};

export default useErrorHandler;