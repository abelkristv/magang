import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        const verifyToken = async () => {
            if (!token) {
                console.log("no tokenn")
                navigate('/enrichment-documentation/login');
                setLoading(false);
                return;
            }

            try {
                // Call the backend API to verify the token
                const response = await fetch(`${import.meta.env.VITE_BACKEND_PREFIX_URL}/api/verify-token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setAuthenticated(true);
                } else {
                    navigate('/enrichment-documentation/login');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                navigate('/enrichment-documentation/login');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return authenticated ? children : null;
}

export default PrivateRoute;
