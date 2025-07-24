import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for map view
 *
 * @returns {JSX.Element} Map view skeleton
 */
const MapViewSkeleton = () => {
  return (
    <div className="w-full h-full bg-gray-200 bg-neutral-800 flex items-center justify-center animate-pulse">
      <div className="text-center">
        <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  );
};

export default MapViewSkeleton;