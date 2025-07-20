import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';
import { Notification } from './Notification';
import './notification.css';

export const NotificationContainer = () => {
  const { notifications } = useContext(NotificationContext);

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification key={notification.id} {...notification} />
      ))}
    </div>
  );
};