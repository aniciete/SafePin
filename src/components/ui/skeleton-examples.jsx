import React from 'react';
import { AnimatedSkeleton } from './animated-skeleton';
import { Card, CardHeader, CardContent } from './card';

/**
 * Example component showcasing different skeleton variants
 */
const SkeletonExamples = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Skeleton Variants</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="w-24">Text:</span>
            <AnimatedSkeleton variant="text" className="w-full max-w-md" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="w-24">Heading:</span>
            <AnimatedSkeleton variant="heading" className="w-full max-w-md" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="w-24">Button:</span>
            <AnimatedSkeleton variant="button" className="w-32" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="w-24">Avatar:</span>
            <AnimatedSkeleton variant="avatar" className="w-12 h-12" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="w-24">Circle:</span>
            <AnimatedSkeleton variant="circle" className="w-16 h-16" />
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="w-24">Thumbnail:</span>
            <AnimatedSkeleton variant="thumbnail" className="w-48" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Card Loading State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <AnimatedSkeleton variant="heading" className="w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatedSkeleton variant="text" className="w-full" />
              <AnimatedSkeleton variant="text" className="w-5/6" />
              <AnimatedSkeleton variant="text" className="w-4/6" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <AnimatedSkeleton variant="avatar" className="w-12 h-12" />
              <div className="space-y-2 flex-1">
                <AnimatedSkeleton variant="heading" className="w-1/2" />
                <AnimatedSkeleton variant="text" className="w-1/3" />
              </div>
            </CardHeader>
            <CardContent>
              <AnimatedSkeleton variant="thumbnail" className="w-full mb-4" />
              <div className="space-y-2">
                <AnimatedSkeleton variant="text" className="w-full" />
                <AnimatedSkeleton variant="text" className="w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">List Loading State</h3>
        <div className="border rounded-md divide-y">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4">
              <div className="flex items-center space-x-4">
                <AnimatedSkeleton variant="avatar" className="w-10 h-10" />
                <div className="space-y-2 flex-1">
                  <AnimatedSkeleton variant="text" className="w-1/3" />
                  <AnimatedSkeleton variant="text" className="w-1/2" />
                </div>
                <AnimatedSkeleton variant="button" className="w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Table Loading State</h3>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5">
                <th className="p-4 text-left">
                  <AnimatedSkeleton variant="text" className="w-24" />
                </th>
                <th className="p-4 text-left">
                  <AnimatedSkeleton variant="text" className="w-32" />
                </th>
                <th className="p-4 text-left">
                  <AnimatedSkeleton variant="text" className="w-24" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((item) => (
                <tr key={item} className="border-t">
                  <td className="p-4">
                    <AnimatedSkeleton variant="text" className="w-full" />
                  </td>
                  <td className="p-4">
                    <AnimatedSkeleton variant="text" className="w-full" />
                  </td>
                  <td className="p-4">
                    <AnimatedSkeleton variant="text" className="w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkeletonExamples;