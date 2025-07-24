import { useState, useEffect } from 'react';

/**
 * Hook to detect and respond to the user's motion preferences
 * Implements the prefers-reduced-motion media query detection
 * 
 * @returns {boolean} True if the user prefers reduced motion
 */
export const useReducedMotion = () => {
  // Initialize state with the current preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window !== 'undefined' && window.matchMedia) {
      // Create media query for prefers-reduced-motion
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Create event handler for changes
      const onChange = () => setPrefersReducedMotion(mediaQuery.matches);
      
      // Add event listener
      // Use the standard addEventListener API with fallback for older browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', onChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(onChange);
      }
      
      // Clean up event listener on unmount
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', onChange);
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(onChange);
        }
      };
    }
    
    // Default to false if matchMedia is not supported
    return () => {};
  }, []);
  
  return prefersReducedMotion;
};