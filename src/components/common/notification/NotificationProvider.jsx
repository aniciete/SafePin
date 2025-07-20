import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification, duration = 5000) => {
    const id = uuidv4();
    let notificationData;

    if (typeof notification === 'string') {
      notificationData = {
        id,
        message: notification,
        type: 'success',
        duration,
      };
    } else {
      // Assumes error object structure from design doc
      notificationData = {
        id,
        message: notification.message,
        type: notification.severity === 'HIGH' ? 'error' : 'warning',
        details: notification.stack,
        duration,
      };
    }

    setNotifications((prev) => [...prev, notificationData]);

    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};