import { Spin } from 'antd';
import { useAppSelector } from '../../redux/hooks/useAppSelector';

const LoadingSpinner = () => {
    const isLoading = useAppSelector((state) => state.globalLoading.isActivetedglobalLoading);

    return (
        <>
            {isLoading &&
                <div className="loading-spinner">
                    <div style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                        <h3 style={{ color: '#333', marginTop: 16 }}>Carregando...</h3>
                    </div>
                </div>
            }
        </>
    );
};

export default LoadingSpinner;

