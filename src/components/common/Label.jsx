import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import PropTypes from 'prop-types';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={`text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

Label.propTypes = {
  className: PropTypes.string,
};

export { Label };