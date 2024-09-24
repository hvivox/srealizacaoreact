import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import useErrorHandler from './useErrorHandler';
import { setGlobalLoading } from '../redux/reducers/globalLoading';

const useApiInterceptors = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (request) => {
        dispatch(setGlobalLoading(true));
        return request;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        dispatch(setGlobalLoading(false));
        return response;
      },
      (error) => errorHandler(error),
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, errorHandler]);
};

export default useApiInterceptors;