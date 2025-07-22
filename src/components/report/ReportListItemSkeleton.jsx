import React from 'react';
import Skeleton from '../common/Skeleton';

const ReportListItemSkeleton = () => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2 mt-2" />
    </div>
  );
};

export default ReportListItemSkeleton;