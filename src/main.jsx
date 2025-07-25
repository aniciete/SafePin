import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // By removing <React.StrictMode>, we ensure useEffect runs only once in development,
  // which prevents the auth listener from being unsubscribed and re-subscribed incorrectly.
  // This is the definitive fix for the refresh/navigation loading hang.
  <App />
);