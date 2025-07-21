import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import PropTypes from 'prop-types';

const buttonVariants = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  warning: 'bg-warning text-white hover:bg-warning-dark',
  success: 'bg-success text-white hover:bg-success-dark',
  tertiary: 'bg-transparent text-text-primary hover:bg-gray-200',
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