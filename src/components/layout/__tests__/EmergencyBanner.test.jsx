import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import EmergencyBanner from '../EmergencyBanner';

vi.useFakeTimers();

describe('EmergencyBanner', () => {
  it('should be visible initially', () => {
    render(<EmergencyBanner />);
    expect(screen.getByText('If this is an emergency, call 911 immediately.')).toBeInTheDocument();
  });

  it('should disappear after 30 seconds', async () => {
    render(<EmergencyBanner />);
    expect(screen.getByText('If this is an emergency, call 911 immediately.')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(31000);
    });

    expect(screen.queryByText('If this is an emergency, call 911 immediately.')).not.toBeInTheDocument();
  });
});