import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const UserListItemSkeleton = () => {
  // Renders a table row (tr) with table cells (td) to be a valid child of <tbody>
  return (
    <tr>
      <td className="p-4">
        <Skeleton className="h-5 w-48" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-24" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-32" />
      </td>
      <td className="p-4">
        <Skeleton className="h-5 w-24" />
      </td>
      <td className="p-4">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </td>
    </tr>
  );
};

export default UserListItemSkeleton;