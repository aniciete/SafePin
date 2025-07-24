import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  createTransition, 
  calculateStaggerDelay,
  shouldSimplifyAnimations,
  throttleAnimation
} from '../../lib/animations/utils';
import { ANIMATION_DURATIONS, EASING } from '../../lib/animations/constants';

describe('Animation Utilities', () => {
  describe('createTransition', () => {
    it('should create a transition string with default values', () => {
      const result = createTransition();
      expect(result).toBe(`all ${ANIMATION_DURATIONS.medium}ms ${EASING.standard}`);
    });

    it('should create a transition string with custom property', () => {
      const result = createTransition('opacity');
      expect(result).toBe(`opacity ${ANIMATION_DURATIONS.medium}ms ${EASING.standard}`);
    });

    it('should create a transition string with multiple properties', () => {
      const result = createTransition(['opacity', 'transform']);
      expect(result).toBe(
        `opacity ${ANIMATION_DURATIONS.medium}ms ${EASING.standard}, ` +
        `transform ${ANIMATION_DURATIONS.medium}ms ${EASING.standard}`
      );
    });

    it('should create a transition string with custom duration and easing', () => {
      const result = createTransition('opacity', 'fast', 'decelerate');
      expect(result).toBe(`opacity ${ANIMATION_DURATIONS.fast}ms ${EASING.decelerate}`);
    });

    it('should accept custom duration and easing values', () => {
      const result = createTransition('opacity', '200ms', 'ease-in-out');
      expect(result).toBe('opacity 200ms ease-in-out');
    });
  });

  describe('calculateStaggerDelay', () => {
    it('should calculate delay based on index with default values', () => {
      expect(calculateStaggerDelay(0)).toBe(0);
      expect(calculateStaggerDelay(1)).toBe(50);
      expect(calculateStaggerDelay(2)).toBe(100);
    });

    it('should calculate delay with custom base delay', () => {
      expect(calculateStaggerDelay(0, 100)).toBe(100);
      expect(calculateStaggerDelay(1, 100)).toBe(150);
    });

    it('should calculate delay with custom item delay', () => {
      expect(calculateStaggerDelay(0, 0, 100)).toBe(0);
      expect(calculateStaggerDelay(1, 0, 100)).toBe(100);
      expect(calculateStaggerDelay(2, 0, 100)).toBe(200);
    });
  });

  describe('throttleAnimation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throttle function calls', () => {
      const mockFn = vi.fn();
      const throttled = throttleAnimation(mockFn, 100);

      throttled();
      expect(mockFn).toHaveBeenCalledTimes(1);

      throttled();
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(101);
      throttled();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('shouldSimplifyAnimations', () => {
    const originalNavigator = global.navigator;

    beforeEach(() => {
      // Mock navigator
      global.navigator = {
        ...originalNavigator,
        deviceMemory: undefined,
        hardwareConcurrency: undefined,
        getBattery: undefined
      };
    });

    afterEach(() => {
      global.navigator = originalNavigator;
    });

    it('should return false for high-end devices', () => {
      global.navigator.deviceMemory = 8;
      global.navigator.hardwareConcurrency = 8;
      
      expect(shouldSimplifyAnimations()).toBe(false);
    });

    it('should return true for low memory devices', () => {
      global.navigator.deviceMemory = 2;
      global.navigator.hardwareConcurrency = 8;
      
      expect(shouldSimplifyAnimations()).toBe(true);
    });

    it('should return true for low CPU devices', () => {
      global.navigator.deviceMemory = 8;
      global.navigator.hardwareConcurrency = 2;
      
      expect(shouldSimplifyAnimations()).toBe(true);
    });
  });
});