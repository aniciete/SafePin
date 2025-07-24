import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for dashboard widgets
 *
 * @returns {JSX.Element} Dashboard widget skeleton
 */
const DashboardWidgetSkeleton = () => {
  return (
    <div className="p-4 border rounded-lg animate-pulse">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
};

export default DashboardWidgetSkeleton;