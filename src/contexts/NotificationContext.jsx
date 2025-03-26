import { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
            {children}
            {notification && (
                <div className={`fixed bottom-5 right-5 p-4 rounded-md shadow-lg max-w-xs ${
                    notification.type === 'error' ? 'bg-red-500 text-white' :
                    notification.type === 'success' ? 'bg-green-500 text-white' :
                    'bg-blue-500 text-white'
                }`}>
                    {notification.message}
                    <button 
                        className="ml-2 text-white"
                        onClick={clearNotification}
                    >
                        &times;
                    </button>
                </div>
            )}
        </NotificationContext.Provider>
    );
}; 