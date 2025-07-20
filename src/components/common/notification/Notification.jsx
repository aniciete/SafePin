import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

export const Notification = ({ id, message, type, details }) => {
  const { removeNotification } = useContext(NotificationContext);

  return (
    <div className={`notification ${type}`}>
      <div className="notification-message">
        <p>{message}</p>
        {details && <pre>{details}</pre>}
      </div>
      <button onClick={() => removeNotification(id)} className="notification-close">
        &times;
      </button>
    </div>
  );
};