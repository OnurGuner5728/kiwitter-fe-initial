import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        // Sayfa yüklendiğinde local storage'dan kullanıcı bilgisini al
        const userData = localStorage.getItem('user');
        if (userData && token) {
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]);

    const logout = () => {
        setToken('');
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <UserContext.Provider value={{ 
            token, 
            setToken, 
            user, 
            setUser, 
            isAuthenticated, 
            logout 
        }}>
            {children}
        </UserContext.Provider>
    );
};
