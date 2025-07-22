import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const statusMap = {
  pending_verification: {
    title: 'Submitted',
    description: 'Your report has been received and is awaiting verification.',
    step: 1,
  },
  verified: {
    title: 'Verified',
    description: 'The report has been verified and forwarded to the relevant authorities.',
    step: 2,
  },
  resolved: {
    title: 'Action Taken',
    description: 'The authorities have reviewed and addressed this report. The case is now closed.',
    step: 3,
  },
};

const StatusTimeline = ({ status }) => {
  const currentStep = statusMap[status]?.step || 0;
  const steps = [
    statusMap.pending_verification,
    statusMap.verified,
    statusMap.resolved,
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <ol className="relative border-l border-gray-200 dark:border-neutral-700">
        {steps.map((stepInfo, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep >= stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <li key={stepInfo.title} className="mb-10 ml-6">
              <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-8 ring-white dark:ring-neutral-900 ${isCompleted ? 'bg-primary' : 'bg-gray-300'}`}>
                {isCompleted ? (
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-gray-600">{stepNumber}</span>
                )}
              </span>
              <h3 className={`flex items-center mb-1 text-lg font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                {stepInfo.title}
                {isCurrent && <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">Current</span>}
              </h3>
              <p className="text-base font-normal text-gray-500">{stepInfo.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default StatusTimeline;