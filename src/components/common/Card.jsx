import React from 'react';

const Card = ({ children }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      {children}
    </div>
  );
};

export default Card;