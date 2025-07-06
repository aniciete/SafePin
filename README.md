# SafePin

SafePin is a web application designed for real-time incident reporting and mapping. It allows users to submit reports, which are then displayed on a live map for administrators and authorities to manage.

## ✨ Features

- **Real-time Reporting:** Users can submit incident reports that appear instantly.
- **Interactive Map:** Utilizes Leaflet to display reports on an interactive map.
- **User Authentication:** Secure login and signup functionality for users and authorities.
- **Admin Dashboard:** A dedicated interface for administrators to view, edit, and delete reports.

## 🚀 Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Vite](https://vitejs.dev/) - Next-generation frontend tooling
  - [Leaflet](https://leafletjs.com/) - Interactive map library
- **Backend & Database:**
  - [Firebase](https://firebase.google.com/)
    - **Firestore:** Real-time NoSQL database for storing reports.
    - **Authentication:** Manages user authentication and sessions.
    - **Hosting:** Deploys and hosts the web application.
- **Code Quality:**
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/) (Recommended)

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/aniciete/SafePin.git
    cd SafePin
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Firebase configuration keys. You can get these from your Firebase project settings.
    ```
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Open http://localhost:5173 to view it in your browser.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run test`: Runs the test suite.