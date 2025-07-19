# SafePin Migration Plan: From Vanilla JS to React (v2)

This document outlines the detailed migration plan for moving the SafePin web application from a vanilla HTML/CSS/JavaScript stack to a modern React and Vite stack.

## 1. Analysis of Existing Application

The current application is a safety/reporting web application with a clear separation of concerns, even within its vanilla JS structure. The backend is powered by Supabase, and the application is deployed on Netlify.

### Key Feature Breakdown and Relevant Files:

*   **Authentication:**
    *   `src/login.html`: The main login page.
    *   `src/services/auth.service.js`: Handles all Supabase authentication logic.
    *   `src/utils/authUtils.js`: Provides utility functions for authentication.
*   **User Reporting:**
    *   `src/pages/report/ReportPage.jsx`: The main reporting page, built with React.
    *   `src/components/report/ReportForm.jsx`: Manages the report form logic.
    *   `src/services/report.service.js`: Handles report submission to Supabase.
    *   `src/services/report/validation.js`: Contains validation logic for the report form.
*   **Map Integration:**
    *   `src/landing-page/map.js`: Contains the core map logic for the reporting page.
    *   `src/authority-page/map.controller.js`: Manages the map view for the authority dashboard.
*   **Authority Dashboard:**
    *   `src/authority-page/index.html`: The main dashboard page for authorities.
    *   `src/authority-page/dashboard.controller.js`: Handles the logic for the authority dashboard.
    *   `src/authority-page/ui.manager.js`: Manages the UI interactions for the dashboard.

## 2. Proposed React Project Structure

The new project will be organized into a modular and scalable structure that aligns with modern React best practices.

```
/src
|-- /assets
|   |-- /images
|   |-- /styles
|       |-- main.css
|       |-- _variables.css
|-- /components
|   |-- /common
|   |   |-- Button.jsx
|   |   |-- Input.jsx
|   |   |-- Modal.jsx
|   |   |-- Spinner.jsx
|   |-- /layout
|   |   |-- Header.jsx
|   |   |-- Footer.jsx
|   |   |-- Sidebar.jsx
|   |-- /map
|   |   |-- MapView.jsx
|   |   |-- Marker.jsx
|   |-- /report
|   |   |-- ReportForm.jsx
|   |   |-- ReportList.jsx
|   |   |-- ReportDetail.jsx
|   |-- /auth
|   |   |-- LoginForm.jsx
|   |   |-- SignUpForm.jsx
|   |   |-- AuthGuard.jsx
|-- /constants
|   |-- routes.js
|   |-- supabase.js
|-- /contexts
|   |-- AuthContext.jsx
|   |-- SupabaseContext.jsx
|-- /hooks
|   |-- useAuth.js
|   |-- useReports.js
|   |-- useMap.js
|-- /pages
|   |-- /landing
|   |   |-- HomePage.jsx
|   |   |-- AboutPage.jsx
|   |-- /auth
|   |   |-- LoginPage.jsx
|   |   |-- SignUpPage.jsx
|   |   |-- VerificationPage.jsx
|   |-- /report
|   |   |-- ReportPage.jsx
|   |-- /dashboard
|   |   |-- /authority
|   |   |   |-- AuthorityDashboardPage.jsx
|   |   |-- /admin
|   |   |   |-- AdminDashboardPage.jsx
|   |-- NotFoundPage.jsx
|-- /services
|   |-- auth.service.js
|   |-- report.service.js
|   |-- supabase.service.js
|-- /utils
|   |-- errorHandler.js
|   |-- validation.js
|-- App.jsx
|-- main.jsx
```

## 3. Migration Steps by Feature

### 3.1. Authentication (Login/Logout)

1.  **Create `LoginForm.jsx` and `SignUpForm.jsx` Components:**
    *   These components will be responsible for rendering the login and sign-up forms.
    *   They will use the `useAuth` hook to handle form submission and manage loading/error states.
2.  **Develop `useAuth` Custom Hook:**
    *   This hook will encapsulate all authentication-related logic, including login, logout, and session management.
    *   It will interact with the `auth.service.js` to make Supabase API calls.
3.  **Implement `AuthGuard.jsx` Component:**
    *   This component will protect routes that require authentication.
    *   It will check for a valid user session and role before rendering the protected component.
4.  **Integrate with `auth.service.js`:**
    *   The existing `auth.service.js` will be reused to handle all communication with Supabase for authentication.

### 3.2. User Reporting

1.  **Create `ReportForm.jsx` Component:**
    *   This component will render the incident reporting form with controlled inputs.
    *   It will use the `useForm` hook (from a library like `react-hook-form`) for form state management and validation.
2.  **Develop `useMap` Custom Hook:**
    *   This hook will manage all map-related logic, including marker placement, location services, and map initialization.
3.  **Integrate Google Maps API:**
    *   The `@googlemaps/js-api-loader` library will be used to load the Google Maps API.
    *   The `useMap` hook will handle the API loading and map rendering.
4.  **Implement Client-Side Validation:**
    *   The validation logic from `src/services/report/validation.js` will be adapted for use with `react-hook-form`.
5.  **Connect to `report.service.js`:**
    *   The `ReportForm.jsx` will use the `report.service.js` to submit the report data and upload images to Supabase Storage.

### 3.3. Map Integration

1.  **Create `MapView.jsx` Component:**
    *   This component will be responsible for rendering the map and displaying incident markers.
    *   It will use the `useMap` hook to manage the map instance and markers.
2.  **Utilize `@googlemaps/markerclusterer`:**
    *   The marker clusterer will be used to efficiently manage a large number of markers on the map.
3.  **Develop `useReports` Custom Hook:**
    *   This hook will fetch and manage report data from Supabase.
    *   It will provide the report data to the `MapView.jsx` component for rendering markers.
4.  **Implement Interactive Marker Features:**
    *   Markers will be clickable, opening a modal with incident details.

### 3.4. Authority Dashboard

1.  **Create `AuthorityDashboardPage.jsx`:**
    *   This page will serve as the main container for the authority dashboard.
2.  **Develop Dashboard Widgets:**
    *   Individual components will be created for each dashboard widget, such as `ReportsInJurisdiction`, `PendingVerifications`, and `ResolvedIncidents`.
3.  **Use a Charting Library:**
    *   A library like `Chart.js` or `Recharts` will be used to visualize key metrics.
4.  **Implement Real-Time Updates:**
    *   Supabase Realtime subscriptions will be used to keep the dashboard data in sync.

### 3.5. Admin Dashboard

1.  **Design and Implement `AdminDashboardPage.jsx`:**
    *   This page will provide administrative functionalities, such as user and role management.
2.  **Create Admin Components:**
    *   Components like `UserList` and `EditUserModal` will be created for managing users.
3.  **Implement Secure Edge Functions:**
    *   Supabase Edge Functions will be used to handle administrative actions securely.
4.  **Ensure Role-Based Access Control:**
    *   The `AuthGuard` component will be used to restrict access to the admin dashboard.

## 4. Supabase Integration Strategy

*   **`SupabaseContext`**:
    ```javascript
    // src/contexts/SupabaseContext.jsx
    import { createContext, useContext } from 'react';
    import { createClient } from '@supabase/supabase-js';

    const SupabaseContext = createContext();

    export const SupabaseProvider = ({ children }) => {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      return (
        <SupabaseContext.Provider value={{ supabase }}>
          {children}
        </SupabaseContext.Provider>
      );
    };

    export const useSupabase = () => useContext(SupabaseContext);
    ```
*   **`AuthContext`**:
    ```javascript
    // src/contexts/AuthContext.jsx
    import { createContext, useState, useEffect, useContext } from 'react';
    import { useSupabase } from './SupabaseContext';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const { supabase } = useSupabase();
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);

        const { data: listener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
          }
        );

        return () => {
          listener.subscription.unsubscribe();
        };
      }, [supabase]);

      const value = {
        user,
        loading,
        login: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        logout: () => supabase.auth.signOut(),
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => useContext(AuthContext);
    ```

## 5. Routing Strategy with React Router

```javascript
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SupabaseProvider } from './contexts/SupabaseContext';
import HomePage from './pages/landing/HomePage';
import LoginPage from './pages/auth/LoginPage';
import ReportPage from './pages/report/ReportPage';
import AuthorityDashboardPage from './pages/dashboard/authority/AuthorityDashboardPage';
import AuthGuard from './components/auth/AuthGuard';

const App = () => (
  <SupabaseProvider>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/report" element={<AuthGuard><ReportPage /></AuthGuard>} />
          <Route path="/dashboard/authority" element={<AuthGuard role="authority"><AuthorityDashboardPage /></AuthGuard>} />
        </Routes>
      </Router>
    </AuthProvider>
  </SupabaseProvider>
);

export default App;
```

## 6. CSS Migration Strategy

1.  **Global Styles:** Consolidate foundational styles into `src/assets/styles/main.css` and use CSS variables.
2.  **Component-Level Styling:** Use CSS Modules (`.module.css`) for component-specific styles.
3.  **Utility Classes:** Continue to use Tailwind CSS for utility-first styling.

This detailed plan provides a clear and actionable roadmap for migrating the SafePin application to a modern React and Vite stack.