import './setup';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import Header from '../Header';
import * as AuthContextModule from '../../../contexts/AuthContext';

// Mock the useAuth hook
const mockAuthContext = {
  user: null,
  profile: null,
  logout: vi.fn(),
  loading: false
};

// Helper function to render Header with mocked AuthContext
const renderHeader = (authContextValue = mockAuthContext) => {
  // Mock the useAuth hook to return our test values
  vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(authContextValue);
  
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders logo and brand name', () => {
    renderHeader();
    
    const logo = screen.getByAltText('SafePin Logo');
    const brandName = screen.getByText('SafePin');
    
    expect(logo).toBeInTheDocument();
    expect(brandName).toBeInTheDocument();
  });

  test('displays "Check Report Status" instead of "Track a Report"', () => {
    renderHeader();
    
    const checkStatusLink = screen.getByText('Check Report Status');
    expect(checkStatusLink).toBeInTheDocument();
    
    // Ensure the old text is not present
    const trackReportText = screen.queryByText('Track a Report');
    expect(trackReportText).not.toBeInTheDocument();
  });

  test('displays "Partner Login" instead of "Login"', () => {
    renderHeader();
    
    const partnerLoginLink = screen.getByText('Partner Login');
    expect(partnerLoginLink).toBeInTheDocument();
    
    // Ensure the old text is not present
    const loginText = screen.queryByText('Login');
    expect(loginText).not.toBeInTheDocument();
  });

  test('ensures "Report an Incident" button has visual prominence', () => {
    renderHeader();
    
    const reportButton = screen.getByText('Report an Incident').closest('a');
    
    // Check that the button has the primary styling classes
    expect(reportButton.parentElement).toHaveClass('bg-primary');
    expect(reportButton.parentElement).toHaveClass('text-white');
  });

  test('toggles mobile menu when menu button is clicked', () => {
    renderHeader();
    
    // Mobile menu should be hidden initially
    const mobileNav = screen.queryByRole('navigation', { hidden: true });
    expect(mobileNav).not.toBeVisible();
    
    // Find and click the menu toggle button
    const menuToggle = screen.getByRole('button');
    fireEvent.click(menuToggle);
    
    // Mobile menu should now be visible
    expect(mobileNav).toBeVisible();
    
    // Click again to hide
    fireEvent.click(menuToggle);
    expect(mobileNav).not.toBeVisible();
  });

  test('displays dashboard link for admin users', () => {
    const adminAuthContext = {
      ...mockAuthContext,
      user: { uid: 'admin-uid' },
      profile: { role: 'admin' }
    };
    
    renderHeader(adminAuthContext);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard/admin');
  });

  test('displays dashboard link for authority users', () => {
    const authorityAuthContext = {
      ...mockAuthContext,
      user: { uid: 'authority-uid' },
      profile: { role: 'authority' }
    };
    
    renderHeader(authorityAuthContext);
    
    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard/authority');
  });

  test('displays logout button for authenticated users', () => {
    const authenticatedAuthContext = {
      ...mockAuthContext,
      user: { uid: 'user-uid' },
      profile: { role: 'user' }
    };
    
    renderHeader(authenticatedAuthContext);
    
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    
    // Click logout button
    fireEvent.click(logoutButton);
    expect(authenticatedAuthContext.logout).toHaveBeenCalledTimes(1);
  });

  test('displays loading state when auth is loading', () => {
    const loadingAuthContext = {
      ...mockAuthContext,
      loading: true
    };
    
    renderHeader(loadingAuthContext);
    
    // Should show loading indicator
    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
  });
});