import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  // Store original matchMedia
  const originalMatchMedia = window.matchMedia;
  
  beforeEach(() => {
    // Mock matchMedia before each test
    window.matchMedia = vi.fn();
  });
  
  afterEach(() => {
    // Restore original matchMedia after each test
    window.matchMedia = originalMatchMedia;
  });
  
  it('should return false when reduced motion is not preferred', () => {
    // Mock matchMedia to return false for prefers-reduced-motion
    window.matchMedia.mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });
  
  it('should return true when reduced motion is preferred', () => {
    // Mock matchMedia to return true for prefers-reduced-motion
    window.matchMedia.mockImplementation(query => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }));
    
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
  
  it('should update when preference changes', () => {
    // Create a mock for the media query with a callback registry
    let listeners = [];
    const mockMediaQueryList = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addEventListener: vi.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: vi.fn((event, listener) => {
        listeners = listeners.filter(l => l !== listener);
      })
    };
    
    window.matchMedia.mockImplementation(() => mockMediaQueryList);
    
    // Render the hook
    const { result, rerender } = renderHook(() => useReducedMotion());
    
    // Initial value should be false
    expect(result.current).toBe(false);
    
    // Simulate a change in preference
    mockMediaQueryList.matches = true;
    
    // Trigger the change event
    listeners.forEach(listener => listener());
    
    // Re-render to update the hook
    rerender();
    
    // Value should now be true
    expect(result.current).toBe(true);
  });
  
  it('should handle older browsers without addEventListener', () => {
    // Create a mock for older browsers that use addListener instead
    let listeners = [];
    const mockMediaQueryList = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      addListener: vi.fn(listener => {
        listeners.push(listener);
      }),
      removeListener: vi.fn(listener => {
        listeners = listeners.filter(l => l !== listener);
      })
    };
    
    window.matchMedia.mockImplementation(() => mockMediaQueryList);
    
    // Render the hook
    const { result, rerender } = renderHook(() => useReducedMotion());
    
    // Initial value should be false
    expect(result.current).toBe(false);
    
    // Simulate a change in preference
    mockMediaQueryList.matches = true;
    
    // Trigger the change event
    listeners.forEach(listener => listener());
    
    // Re-render to update the hook
    rerender();
    
    // Value should now be true
    expect(result.current).toBe(true);
  });
});