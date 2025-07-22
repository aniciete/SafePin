import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import PropTypes from 'prop-types';

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary',
  warning: 'bg-warning text-white hover:bg-yellow-600 focus-visible:ring-warning',
  success: 'bg-success text-white hover:bg-primary-dark focus-visible:ring-success',
  tertiary: 'bg-transparent text-text hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700 focus-visible:ring-gray-500',
};

const Button = React.forwardRef(
  ({ asChild = false, variant = 'primary', className, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${className}`}
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