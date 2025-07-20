# Data Fetching Redesign for Reports

This document outlines a new architecture for fetching and managing reports data in the SafePin application. The design addresses the inefficiencies of the current `useReports` hook by introducing a centralized, context-based approach with pagination.

## 1. `ReportsContext` API

The `ReportsContext` will serve as the centralized store for all reports-related data.

### State Shape

The context state will have the following structure:

```javascript
{
  reports: [],       // Array of report objects for the current page
  loading: true,     // Boolean indicating if a data fetch is in progress
  error: null,       // Error object if a fetch fails
  pagination: {
    currentPage: 1,  // The current page number
    totalPages: 1,   // The total number of pages
    pageSize: 10,    // The number of reports per page
    totalCount: 0    // The total number of reports
  }
}
```

### Provided Functions

The context will provide the following functions to consumers:

*   `fetchReports(page, filters)`: A function to fetch a specific page of reports, with optional filters.
*   `fetchNextPage()`: A convenience function to fetch the next page of reports.
*   `fetchPrevPage()`: A convenience function to fetch the previous page of reports.


## 2. `useReports` Hook API

The `useReports` hook will be the primary way for components to access and interact with the reports data. It will consume the `ReportsContext` and expose a clean API to the components.

### Returned Data and Functions

The hook will return an object with the following properties:

```javascript
{
  // Direct state from context
  reports: [],
  loading: true,
  error: null,
  pagination: { ... },

  // Functions from context
  fetchNextPage: () => {},
  fetchPrevPage: () => {},

  // Selector/filter functions (optional, for more complex scenarios)
  getReportById: (id) => { ... },
  getReportsByStatus: (status) => { ... }
}
```


## 3. Component Interaction Diagram

The following diagram illustrates the flow of data and interactions between the new components:

```
[ AuthorityDashboardPage ]
       |
       | Wraps child components with
       v
[ ReportsProvider ]
   |   |   |
   |   |   | Fetches data and provides context
   |   |   v
   |   | [ ReportsContext ]
   |   |   ^
   |   |   | Consumes context
   |   v   v
   | [ PendingVerifications ]  <-- uses useReports()
   v
[ ReportsInJurisdiction ] <-- uses useReports()
   |
   v
[ ResolvedIncidents ] <-- uses useReports()

```

**Description:**

1.  The `AuthorityDashboardPage` will be wrapped by the `ReportsProvider`.
2.  The `ReportsProvider` fetches the initial data and makes the `ReportsContext` available to all its children.
3.  Child components like `ReportsInJurisdiction`, `PendingVerifications`, and `ResolvedIncidents` will use the `useReports` hook to access the data and functions from the `ReportsContext`.
4.  This ensures that data is fetched only once at the provider level, and all child components share the same state.


## 4. Usage Example

Here is an example of how a component would use the new `useReports` hook to display a paginated list of reports.

```javascript
import React from 'react';
import { useReports } from '../hooks/useReports';

const PaginatedReportsList = () => {
  const {
    reports,
    loading,
    error,
    pagination,
    fetchNextPage,
    fetchPrevPage,
  } = useReports();

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h3>Reports</h3>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>{report.incidentType}</li>
        ))}
      </ul>

      <div>
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button onClick={fetchPrevPage} disabled={pagination.currentPage <= 1}>
          Previous
        </button>
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

export default PaginatedReportsList;
```
