import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 1. Criação do Contexto
export const NotificationContext = createContext();

// 2. Provedor do Contexto
export const NotificationProvider = ({ children }) => {
    console.log("NotificationProvider: Componente Provedor renderizando..."); // DEBUG LOG
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', details = {}) => { // Adicionei 'details' novamente, caso seja usado
        console.log("addNotification: Adicionando notificação ->", message); // DEBUG LOG
        const newNotification = {
            id: Date.now() + Math.random(), // <<< AGORA O ID É REALMENTE ÚNICO
            message,
            type,
            read: false,
            timestamp: new Date().toISOString(),
            details // Garantir que detalhes sejam passados e armazenados
        };
        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    }, []);

    const markAsRead = useCallback((id) => {
        console.log("markAsRead: Marcando notificação como lida ->", id); // DEBUG LOG
        setNotifications(prevNotifications =>
            prevNotifications.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    }, []);

    const removeNotification = useCallback((id) => {
        console.log("removeNotification: Removendo notificação ->", id); // DEBUG LOG
        setNotifications(prevNotifications =>
            prevNotifications.filter(notif => notif.id !== id)
        );
    }, []);

    const contextValue = {
        notifications,
        addNotification,
        markAsRead,
        removeNotification
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {console.log("NotificationProvider: Contexto provido com valores.")} {/* DEBUG LOG */}
            {children}
        </NotificationContext.Provider>
    );
};

// 3. Hook customizado para fácil consumo
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    console.log("useNotifications: Hook sendo usado, context:", context); // DEBUG LOG
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};