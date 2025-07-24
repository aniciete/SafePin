import React, { useState } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';

/**
 * Example component showcasing form elements
 */
export function FormExamples() {
  // State for form values and validation
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [validationStates, setValidationStates] = useState({
    name: undefined,
    email: undefined,
    message: undefined
  });
  
  // State for form submission status
  const [submitStatus, setSubmitStatus] = useState('idle');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // Simple validation
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidationStates(prev => ({
        ...prev,
        email: value ? (emailRegex.test(value) ? 'valid' : 'invalid') : undefined
      }));
    } else if (name === 'name' || name === 'message') {
      setValidationStates(prev => ({
        ...prev,
        [name]: value.length > 2 ? 'valid' : value.length > 0 ? 'invalid' : undefined
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set loading state
    setSubmitStatus('loading');
    
    // Validate form
    const isValid = Object.values(validationStates).every(state => state === 'valid');
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (isValid) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
      
      // Reset after a delay
      setTimeout(() => setSubmitStatus('idle'), 2000);
    }, 1500);
  };
  
  return (
    <div className="space-y-8 p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Form Elements</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formValues.name}
            onChange={handleChange}
            className={cn(
              validationStates.name === 'valid' && 'border-green-500',
              validationStates.name === 'invalid' && 'border-red-500'
            )}
          />
          {validationStates.name === 'invalid' && (
            <p className="text-sm text-red-500">Name must be at least 3 characters</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formValues.email}
            onChange={handleChange}
            className={cn(
              validationStates.email === 'valid' && 'border-green-500',
              validationStates.email === 'invalid' && 'border-red-500'
            )}
          />
          {validationStates.email === 'invalid' && (
            <p className="text-sm text-red-500">Please enter a valid email address</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={formValues.message}
            onChange={handleChange}
            className={cn(
              validationStates.message === 'valid' && 'border-green-500',
              validationStates.message === 'invalid' && 'border-red-500'
            )}
          />
          {validationStates.message === 'invalid' && (
            <p className="text-sm text-red-500">Message must be at least 3 characters</p>
          )}
        </div>
        
        <div className="space-y-4">
          <Button
            type="submit"
            disabled={submitStatus === 'loading'}
            className="w-full"
          >
            {submitStatus === 'loading' && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />}
            {submitStatus === 'success' && 'Submitted!'}
            {submitStatus === 'error' && 'Failed!'}
            {submitStatus === 'idle' && 'Submit Form'}
          </Button>
        </div>
      </form>
    </div>
  );
}