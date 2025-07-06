
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import useErrorHandler from './useErrorHandler';
import { setGlobalLoading } from '../redux/reducers/globalLoadingReducer';
import { api } from '../services/api';


const useApiInterceptors = () => {
  const dispatch = useDispatch();
  const errorHandler = useErrorHandler();


  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (request) => {
        dispatch(setGlobalLoading(true));
        return request;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        dispatch(setGlobalLoading(false));
        return response;
      },
      (error) => errorHandler(error),
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch, errorHandler]);
};


export default useApiInterceptors;