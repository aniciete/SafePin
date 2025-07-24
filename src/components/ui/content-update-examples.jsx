import React, { useState } from 'react';
import AnimatedContentUpdate from './animated-content-update';
import { Button } from './button';

/**
 * Examples of AnimatedContentUpdate component usage
 */
export function ContentUpdateExamples() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  
  const incrementCount = () => setCount(prev => prev + 1);
  
  const cycleStatus = () => {
    const statuses = ['pending', 'processing', 'completed', 'error'];
    const currentIndex = statuses.indexOf(status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setStatus(statuses[nextIndex]);
  };
  
  const addItem = () => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  };
  
  const removeItem = () => {
    if (items.length > 0) {
      setItems(prev => prev.slice(0, -1));
    }
  };
  
  // Map status to highlight type
  const getHighlightType = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'error': return 'error';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Basic Content Update</h3>
        <div className="flex items-center gap-4">
          <AnimatedContentUpdate value={count} className="p-4 rounded bg-gray-100">
            Count: {count}
          </AnimatedContentUpdate>
          <Button onClick={incrementCount}>Increment</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Status Change with Different Highlight Types</h3>
        <div className="flex items-center gap-4">
          <AnimatedContentUpdate 
            value={status} 
            highlightType={getHighlightType(status)}
            className="p-4 rounded bg-gray-100 capitalize"
          >
            Status: {status}
          </AnimatedContentUpdate>
          <Button onClick={cycleStatus}>Change Status</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">List Updates with Slide Transition</h3>
        <div className="space-y-2">
          {items.map((item, index) => (
            <AnimatedContentUpdate 
              key={index}
              value={item}
              transitionType="slide"
              className="p-2 rounded bg-gray-100"
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={addItem}>Add Item</Button>
          <Button onClick={removeItem} variant="outline">Remove Item</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Data Update Animation</h3>
        <div className="space-y-2">
          <AnimatedContentUpdate 
            compareChildren={true}
            transitionType="slide"
            className="p-4 rounded bg-gray-100"
          >
            <div className="flex justify-between">
              <span>Total Items:</span>
              <span>{items.length}</span>
            </div>
          </AnimatedContentUpdate>
        </div>
      </div>
    </div>
  );
}