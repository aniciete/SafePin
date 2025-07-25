import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const requirements = [
  { text: 'At least 8 characters', regex: /.{8,}/ },
  { text: 'An uppercase letter', regex: /[A-Z]/ },
  { text: 'A lowercase letter', regex: /[a-z]/ },
  { text: 'A number', regex: /[0-9]/ },
  { text: 'A special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

const PasswordRequirements = ({ password }) => {
  // Add a check for null or undefined password
  const currentPassword = password || '';

  return (
    // Use a two-column grid for better layout
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
      {requirements.map((req, index) => {
        const isValid = req.regex.test(currentPassword);
        return (
          <div key={index} className="flex items-center text-sm">
            {isValid ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
            ) : (
              // Use a more noticeable color for the unmet requirement icon
              <XCircle className="h-4 w-4 mr-2 text-destructive flex-shrink-0" />
            )}
            <span className={cn(
              // Met requirements are standard text color
              isValid ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {req.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;