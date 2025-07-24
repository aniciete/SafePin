import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for report list items
 *
 * @returns {JSX.Element} Report list item skeleton
 */
const ReportListItemSkeleton = () => {
  return (
    <div className="p-4 border-b border-gray-200 border-neutral-700 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2 mt-2" />
    </div>
  );
};

export default ReportListItemSkeleton;