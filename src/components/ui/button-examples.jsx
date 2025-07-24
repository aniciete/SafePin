import React, { useState } from 'react';
import { Button } from './button';

/**
 * Example component showcasing buttons
 */
export function ButtonExamples() {
  const [demoStatus, setDemoStatus] = useState('idle');
  
  // Demo the form submission flow
  const handleDemoSubmit = () => {
    setDemoStatus('loading');
    
    setTimeout(() => {
      // Randomly succeed or fail
      const success = Math.random() > 0.5;
      setDemoStatus(success ? 'success' : 'error');
    }, 1500);
  };
  
  return (
    <div className="space-y-8 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Buttons</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Default Variants</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button>Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">States</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">With Icons</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Item
            </Button>
            <Button variant="outline">
              Save
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Form Submission</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Click the button below to see the submission flow (loading → success/error)
            </p>
            
            <Button
              onClick={handleDemoSubmit}
              disabled={demoStatus === 'loading'}
              className="w-full"
            >
              {demoStatus === 'loading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
              {demoStatus === 'success' && 'Success!'}
              {demoStatus === 'error' && 'Error!'}
              {demoStatus === 'idle' && 'Demo Submission'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}