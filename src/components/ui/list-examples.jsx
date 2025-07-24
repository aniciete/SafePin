import React from 'react';
import { AnimatedList, AnimatedListItem } from './animated-list-item';

/**
 * Example component showcasing different AnimatedList variations
 */
export function ListExamples() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Animated List Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interactive list */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive List</h3>
          <AnimatedList>
            <AnimatedListItem>
              <div className="flex justify-between items-center">
                <span>Interactive List Item 1</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem>
              <div className="flex justify-between items-center">
                <span>Interactive List Item 2</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem>
              <div className="flex justify-between items-center">
                <span>Interactive List Item 3</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
          </AnimatedList>
        </div>
        
        {/* Non-interactive list */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Non-interactive List</h3>
          <AnimatedList>
            <AnimatedListItem interactive={false}>
              <div className="flex justify-between items-center">
                <span>Non-interactive List Item 1</span>
                <span className="text-muted-foreground">Read-only</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem interactive={false}>
              <div className="flex justify-between items-center">
                <span>Non-interactive List Item 2</span>
                <span className="text-muted-foreground">Read-only</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem interactive={false}>
              <div className="flex justify-between items-center">
                <span>Non-interactive List Item 3</span>
                <span className="text-muted-foreground">Read-only</span>
              </div>
            </AnimatedListItem>
          </AnimatedList>
        </div>
        
        {/* List with no elevation change */}
        <div>
          <h3 className="text-lg font-semibold mb-4">No Elevation Change</h3>
          <AnimatedList>
            <AnimatedListItem elevationChange={false}>
              <div className="flex justify-between items-center">
                <span>List Item without elevation</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem elevationChange={false}>
              <div className="flex justify-between items-center">
                <span>List Item without elevation</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem elevationChange={false}>
              <div className="flex justify-between items-center">
                <span>List Item without elevation</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
          </AnimatedList>
        </div>
        
        {/* List with no hover effect */}
        <div>
          <h3 className="text-lg font-semibold mb-4">No Hover Effect</h3>
          <AnimatedList>
            <AnimatedListItem hoverEffect={false}>
              <div className="flex justify-between items-center">
                <span>List Item without hover</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem hoverEffect={false}>
              <div className="flex justify-between items-center">
                <span>List Item without hover</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
            <AnimatedListItem hoverEffect={false}>
              <div className="flex justify-between items-center">
                <span>List Item without hover</span>
                <span className="text-muted-foreground">→</span>
              </div>
            </AnimatedListItem>
          </AnimatedList>
        </div>
      </div>
    </div>
  );
}