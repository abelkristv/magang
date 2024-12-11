import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../helper/AuthProvider';

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const token = localStorage.getItem('token');
    const { setCurrentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/user/current-user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const user = await response.json();
                        setCurrentUser(user.user);
                    } else {
                        console.error('Failed to fetch user:', response.statusText);
                        navigate('/enrichment-documentation/login');
                        
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    navigate('/enrichment-documentation/login');
                }
            };

            fetchUser();
        }
    }, [token, setCurrentUser]);

    if (!token) {
        return <Navigate to="/enrichment-documentation/login" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;
