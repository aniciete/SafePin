import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded-md ${className}`}
    />
  );
};

export default Skeleton;