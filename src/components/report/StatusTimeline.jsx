import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusMap = {
  pending_verification: {
    title: 'Submitted',
    description: 'Your report has been received and is awaiting verification.',
    step: 1,
    color: 'yellow',
  },
  verified: {
    title: 'Verified',
    description: 'The report has been verified and forwarded to the relevant authorities.',
    step: 2,
    color: 'blue',
  },
  resolved: {
    title: 'Action Taken',
    description: 'The authorities have reviewed and addressed this report. The case is now closed.',
    step: 3,
    color: 'green',
  },
};

/**
 * Status Timeline component
 * Shows the current status of a report
 *
 * @param {Object} props - Component props
 * @param {string} props.status - Current status of the report
 * @returns {JSX.Element} Status timeline
 */
const StatusTimeline = ({ status }) => {
  const currentStep = statusMap[status]?.step || 0;
  const steps = [
    statusMap.pending_verification,
    statusMap.verified,
    statusMap.resolved,
  ];

  // Get status badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Current status badge */}
      <div className="mb-4">
        <div
          className={`inline-block px-3 py-1 rounded-full ${getStatusBadgeClass(status)}`}
        >
          <span className={`inline-block w-2 h-2 rounded-full mr-1`}
            style={{
              backgroundColor: `rgb(var(--status-${status === 'pending_verification' ? 'pending' :
                status === 'verified' ? 'verified' : 'resolved'}))`
            }}
          ></span>
          {statusMap[status]?.title || 'Unknown Status'}
        </div>
      </div>
      
      <ol className="relative border-l border-gray-200 border-neutral-700">
        {steps.map((stepInfo, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <motion.li
              key={stepInfo.title}
              className="mb-10 ml-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span
                className={cn(
                  `absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8
                  ring-white ring-neutral-900 transition-all duration-500`,
                  isCompleted ? 'bg-primary' : 'bg-gray-300'
                )}
              >
                {isCompleted ? (
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-gray-600">{stepNumber}</span>
                )}
              </span>
              
              <div>
                <h3 className={cn(
                  `flex items-center mb-1 text-lg font-semibold transition-colors duration-300`,
                  isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {stepInfo.title}
                  {isCurrent && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">
                      Current
                    </span>
                  )}
                </h3>
                <p className="text-base font-normal text-gray-500 dark:text-gray-400">{stepInfo.description}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default StatusTimeline;