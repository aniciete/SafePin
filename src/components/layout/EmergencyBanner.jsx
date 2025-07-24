import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import './EmergencyBanner.css';

const EmergencyBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setIsVisible(false), 1000); // Corresponds to animation duration
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`bg-red-600 text-white p-3 text-center flex items-center justify-center ${
        isFadingOut ? 'fade-out' : ''
      }`}
    >
      <AlertTriangle className="h-5 w-5 mr-2" />
      <p className="font-semibold">
        If this is an emergency, call 911 immediately.
      </p>
    </div>
  );
};

export default EmergencyBanner;