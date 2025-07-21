import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import PropTypes from 'prop-types';

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  tertiary: 'bg-transparent text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
};

const Button = React.forwardRef(
  ({ asChild = false, variant = 'primary', className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

Button.propTypes = {
  asChild: PropTypes.bool,
  variant: PropTypes.oneOf(Object.keys(buttonVariants)),
  className: PropTypes.string,
};

export { Button };