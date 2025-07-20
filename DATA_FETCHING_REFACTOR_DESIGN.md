# Data Fetching Refactor Design

This document outlines the design for a new, efficient data fetching architecture for reports in the SafePin application. The new design uses a React Context for centralized state management and a paginated custom hook to prevent redundant data fetches and support scalability.

## 1. `ReportsContext` API

The `ReportsContext` will provide a global state for reports, including the list of reports, loading and error status, and pagination details.

### State Shape

The context state will have the following structure:

```typescript
interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: Error | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  filters: {
    status?: 'pending' | 'resolved' | 'in_progress';
    // Other filterable fields can be added here
  };
}
```

### Exposed Functions

The context will expose functions to manage the state:

*   `fetchReports(page: number, filters: object)`: A function to fetch a paginated and filtered list of reports from the server. This function will be called by the provider when the page or filters change.
*   `setFilters(filters: object)`: A function to update the current filters. When filters are updated, it should trigger a new data fetch for the first page of the results with the new filters.

## 2. `useReports` Hook API

The redesigned `useReports` hook will consume the `ReportsContext` and provide components with the reports data and functions to interact with it.

### Returned Data and Functions

The hook will return an object with the following properties:

```typescript
interface UseReportsAPI {
  reports: Report[];
  loading: boolean;
  error: Error | null;
  pagination: ReportsState['pagination'];
  filters: ReportsState['filters'];
  fetchNextPage: () => void;
  fetchPrevPage: () => void;
  applyFilters: (filters: object) => void;
}
```

*   **`reports`**: An array of reports for the current page and active filters.
*   **`loading`**, **`error`**, **`pagination`**, **`filters`**: Direct access to the corresponding state from the `ReportsContext`.
*   **`fetchNextPage()`**: A function to fetch the next page of reports.
*   **`fetchPrevPage()`**: A function to fetch the previous page of reports.
*   **`applyFilters(filters: object)`**: A function that allows components to apply new filters to the report list, which will trigger a new data fetch.

## 3. Component Interaction Diagram

The following diagram illustrates how the components will interact:

```mermaid
graph TD
    A[ReportsProvider] --> B[AuthorityDashboardPage];
    B --> C[ReportsInJurisdiction];
    B --> D[PendingVerifications];
    B --> E[ResolvedIncidents];

    subgraph "Data Flow"
        F[API] -- Fetches data --> A;
        A -- Provides context --> C;
        A -- Provides context --> D;
        A -- Provides context --> E;
    end

    subgraph "Hook Usage"
        C -- Uses --> G{useReports};
        D -- Uses --> G;
        E -- Uses --> G;
    end

    subgraph "User Interaction"
        H[User clicks 'Next Page' in ReportsInJurisdiction] --> I[fetchNextPage()];
        I -- Triggers --> A;
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
```

**Description:**

1.  The `ReportsProvider` wraps the `AuthorityDashboardPage`, creating a single source of truth for all report data.
2.  The `ReportsProvider` is responsible for all interactions with the API, fetching data based on pagination and filter state.
3.  Child components like `ReportsInJurisdiction`, `PendingVerifications`, and `ResolvedIncidents` use the `useReports` hook to access the shared state.
4.  When a component needs to display a specific subset of data (e.g., only pending reports), it will use the `applyFilters` function from the hook. This updates the central state and triggers a new API call with the appropriate filters.
5.  Pagination controls in any component will call `fetchNextPage` or `fetchPrevPage`, which will also trigger an API call for the new page.

This design ensures that data is fetched only when needed and that all components are synchronized with the same state.

## 4. Usage Example

Here is a code snippet demonstrating how a component would use the new `useReports` hook to display a paginated list of pending reports.

```jsx
import React, { useEffect } from 'react';
import { useReports } from '../hooks/useReports';

const PendingReportsList = () => {
  const {
    reports,
    loading,
    error,
    pagination,
    applyFilters,
    fetchNextPage,
    fetchPrevPage,
  } = useReports();

  useEffect(() => {
    // Apply a filter to show only pending reports when the component mounts.
    applyFilters({ status: 'pending' });
  }, [applyFilters]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Pending Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>{report.incidentType}</li>
        ))}
      </ul>
      <div>
        <button
          onClick={fetchPrevPage}
          disabled={pagination.currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={fetchNextPage}
          disabled={pagination.currentPage >= pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingReportsList;