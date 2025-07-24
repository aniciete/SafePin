import React from 'react';
import { AnimatedCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './animated-card';

/**
 * Example component showcasing different AnimatedCard variations
 */
export function CardExamples() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Animated Card Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic card with hover effect */}
        <AnimatedCard>
          <CardHeader>
            <CardTitle>Basic Card</CardTitle>
            <CardDescription>With default hover animation</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card has the default hover animation with elevation change.</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Last updated: Today</p>
          </CardFooter>
        </AnimatedCard>
        
        {/* Card without elevation change */}
        <AnimatedCard elevationChange={false}>
          <CardHeader>
            <CardTitle>No Elevation Change</CardTitle>
            <CardDescription>Only scales on hover</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card scales slightly on hover but doesn't change elevation.</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Last updated: Yesterday</p>
          </CardFooter>
        </AnimatedCard>
        
        {/* Card without hover effect */}
        <AnimatedCard hoverEffect={false}>
          <CardHeader>
            <CardTitle>No Hover Effect</CardTitle>
            <CardDescription>Static card without animations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card doesn't have any hover animations but still responds to clicks.</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">Last updated: 2 days ago</p>
          </CardFooter>
        </AnimatedCard>
        
        {/* Interactive card with button */}
        <AnimatedCard className="cursor-pointer">
          <CardHeader>
            <CardTitle>Interactive Card</CardTitle>
            <CardDescription>Click or tap me</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This card is fully interactive and has a pointer cursor.</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Action
            </button>
          </CardFooter>
        </AnimatedCard>
      </div>
    </div>
  );
}