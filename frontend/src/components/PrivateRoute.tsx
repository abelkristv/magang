import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/enrichment-documentation/login" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
