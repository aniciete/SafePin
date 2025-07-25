import { useState, useEffect } from 'react';

/**
 * Hook to track the window's scroll position.
 * 
 * @returns {{scrollY: number}} An object containing the current vertical scroll position.
 */
export const useScroll = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add event listener for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollY };
};