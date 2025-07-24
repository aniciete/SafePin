import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Report submission progress indicator component
 * Shows the current step in the report submission process with animations
 *
 * @param {Object} props - Component props
 * @param {string} props.currentStep - Current submission step ('verifying', 'optimizing', 'uploading', 'submitting', 'complete')
 * @param {number} props.progress - Progress percentage (0-100)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Progress indicator component
 */
const ReportSubmissionProgress = ({
  currentStep = 'verifying',
  progress = 0,
  className,
  ...props
}) => {
  // Define submission steps
  const steps = [
    { id: 'verifying', label: 'Verifying reCAPTCHA', icon: '🔒', ariaLabel: 'Verifying security check' },
    { id: 'optimizing', label: 'Optimizing image', icon: '🖼️', ariaLabel: 'Optimizing uploaded image' },
    { id: 'uploading', label: 'Uploading image', icon: '📤', ariaLabel: 'Uploading image to server' },
    { id: 'submitting', label: 'Submitting report', icon: '📝', ariaLabel: 'Submitting report data' },
    { id: 'complete', label: 'Complete', icon: '✓', ariaLabel: 'Submission complete' }
  ];
  
  // Find current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  // Calculate progress description for screen readers
  const progressDescription = `${progress}% complete. Current step: ${
    steps[currentStepIndex]?.label || 'Processing'
  }`;
  
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {/* Progress bar */}
      <div
        className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={progressDescription}
      >
        <motion.div
          className="bg-primary h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex || (index === currentStepIndex && currentStep === 'complete');
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center p-2 rounded-md transition-colors',
                isActive && 'bg-primary/10',
                isCompleted && 'text-green-500',
              )}
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center mr-3',
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                )}
                aria-hidden="true"
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              
              <span className="flex-grow">{step.label}</span>
              
              {isActive && currentStep !== 'complete' && (
                <div
                  className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin ml-auto"
                  role="status"
                  aria-label={`${step.ariaLabel} in progress`}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Completion message */}
      <AnimatePresence>
        {currentStep === 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center p-4 bg-green-100 dark:bg-green-900/50 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <p className="font-semibold text-green-700 dark:text-green-300">Report submission complete!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportSubmissionProgress;