import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import PropTypes from 'prop-types';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = ({ className, children, ...props }) => (
  <DialogPrimitive.Portal className={className} {...props}>
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {children}
    </div>
  </DialogPrimitive.Portal>
);
ModalPortal.displayName = DialogPrimitive.Portal.displayName;
ModalPortal.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const ModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in ${className}`}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;
ModalOverlay.propTypes = {
  className: PropTypes.string,
};

const ModalContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`fixed z-50 grid w-full gap-4 rounded-b-lg border bg-white p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0 ${className}`}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <Cross2Icon className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;
ModalContent.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

const ModalHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
    {...props}
  />
);
ModalHeader.displayName = 'ModalHeader';
ModalHeader.propTypes = {
  className: PropTypes.string,
};

const ModalFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';
ModalFooter.propTypes = {
  className: PropTypes.string,
};

const ModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;
ModalTitle.propTypes = {
  className: PropTypes.string,
};

const ModalDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`text-sm text-text-secondary ${className}`}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;
ModalDescription.propTypes = {
  className: PropTypes.string,
};

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};