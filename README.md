# SafePin: A Supabase-Powered Crime Reporting Platform

**SafePin** is a web-based crime-reporting platform, now fully powered by Supabase. It empowers citizens to anonymously report crimes and threats via an interactive map, leveraging Supabase for database, authentication, storage, and real-time capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Supabase Setup](#supabase-setup)
- [Running Locally](#running-locally)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

-   **Interactive Map**: Report incidents using Google Maps.
-   **Anonymous Reporting**: Submit reports without revealing personal identity.
-   **Role-Based Access**: Differentiated permissions for Users, Authorities, and Admins, enforced by Postgres Row Level Security (RLS).
-   **Real-Time Updates**: See new reports appear instantly with Supabase Realtime.
-   **Secure Image Uploads**: Attach images to reports using Supabase Storage.
-   **Offline Support**: Reports created offline are synced automatically when connectivity is restored.

## Tech Stack

-   **Frontend**: HTML, CSS, Vanilla JavaScript
-   **Build Tool**: Vite
-   **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime)
-   **Mapping**: Google Maps API

## Project Structure

```
/src
├── assets         # Static assets (images, icons)
├── components     # Reusable UI components (e.g., AuthModal.js)
├── config         # Configuration files (e.g., supabase.js)
├── services       # Core services (auth.service.js, report.service.js)
├── styles         # CSS stylesheets
├── utils          # Utility functions
└── main.js        # Main application entry point

/supabase
├── functions      # Supabase Edge Functions
├── migrations     # Database migration files
└── schema.sql     # Main database schema definition
```

## Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   Supabase CLI
-   A Google Cloud project with the Maps JavaScript API enabled.

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/aniciete/SafePin.git
    cd SafePin
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    -   Copy the example environment file:
        ```bash
        cp .env.example .env.local
        ```
    -   Open `.env.local` and add your Supabase project URL, anon key, and Google Maps API key.

## Supabase Setup

1.  **Link your project**:
    -   Log in to the Supabase CLI:
        ```bash
        supabase login
        ```
    -   Link your local repository to your Supabase project:
        ```bash
        supabase link --project-ref YOUR_PROJECT_ID
        ```

2.  **Deploy Database Schema**:
    -   Apply the database schema and migrations to your Supabase instance:
        ```bash
        supabase db push
        ```

3.  **Deploy Edge Functions**:
    -   Deploy the serverless functions required for secure operations:
        ```bash
        supabase functions deploy
        ```

## Running Locally

1.  **Start the development server**:
    ```bash
    npm run dev
    ```
2.  Open your browser to the URL provided by Vite (usually `http://localhost:5173`).

## Scripts

-   `npm run dev`: Starts the Vite development server.
-   `npm run build`: Builds the application for production.
-   `npm run serve`: Serves the production build locally.
-   `npm run lint`: Lints the source code.
-   `npm test`: Runs unit tests with Vitest.
-   `npm run test:e2e`: Runs end-to-end tests with Playwright.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
```

## License

[Your license here]