import React from 'react';
import Skeleton from '../common/Skeleton';

const MapViewSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
      <div className="text-center">
        <Skeleton className="h-12 w-12 mx-auto mb-4" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  );
};

export default MapViewSkeleton;