import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const storedNotifications = localStorage.getItem('notifications');
      const parsedNotifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      return parsedNotifications.map(n => ({ ...n, timestamp: new Date(n.timestamp) }));
    } catch (error) {
      console.error("Erro ao carregar notificações do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações no localStorage:", error);
    }
  }, [notifications]);

  const addNotification = useCallback((message, type = 'info', details = {}) => {
    setNotifications(prevNotifications => {
      const newNotification = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        message,
        type,
        read: false,
        timestamp: new Date(),
        details
      };
      return [newNotification, ...prevNotifications];
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== id)
    );
  }, []);

  const value = {
    notifications,
    addNotification,
    markAsRead,
    removeNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
