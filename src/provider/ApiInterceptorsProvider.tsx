import React from 'react';
import useApiInterceptors from '../hooks/useApiInterceptors.ts';

export const ApiInterceptorsProvider = ({ children }: { children: React.ReactNode }) => {
    useApiInterceptors();
    return <React.Fragment>{children}</React.Fragment>;
};