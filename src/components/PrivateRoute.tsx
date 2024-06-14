// src/components/PrivateRoute.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

function PrivateRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                navigate('/');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return <p>{"Loading..."}</p>;
    }

    return authenticated ? children : null;
}

export default PrivateRoute;
