import React from 'react';
import Skeleton from '../common/Skeleton';

const UserListItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-700">
      <div className="flex items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
};

export default UserListItemSkeleton;