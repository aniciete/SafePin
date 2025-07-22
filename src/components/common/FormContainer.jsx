import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-8">
      {children}
    </div>
  );
};

export default FormContainer;