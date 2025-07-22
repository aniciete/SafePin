import React from 'react';

const Card = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md flex flex-col items-center ${className}`}>
      {children}
    </div>
  );
};

export default Card;