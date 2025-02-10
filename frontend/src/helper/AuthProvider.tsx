import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import User from '../model/User';

interface AuthContextType {
    currentUser: User;
    setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
    return useContext(AuthContext);
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser({ email: user.email! } as User);
            } else {
                setCurrentUser({} as User);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const logout = () => {
        signOut(auth);
    };

    const value: AuthContextType = {
        currentUser,
        setCurrentUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
