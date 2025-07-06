# SafePin

SafePin is a web application for reporting and managing safety incidents, leveraging Firebase for backend services and scalable hosting.

## Project Structure

- `src/` - Frontend source code
  - `modules/` - Core JS modules (auth, firebase-init, UI, etc.)
  - `utils/` - Utility scripts (validation, error handling, security)
  - `landing-page/` - Public-facing pages and scripts
  - `admin-page/` - Admin dashboard
  - `authority-page/` - Authority dashboard
  - `assets/` - Images, SVGs, and other static assets
- `functions/` - Firebase backend functions
- `dist/` - Production build output

## Setup

1. Clone the repository
2. Run `npm install` in the root and in `functions/`
3. Configure Firebase credentials in `.env` or `firebase.json`
4. Use `npm run dev` to start the frontend (Vite)
5. Deploy with `firebase deploy`

## Usage

- Visit the landing page to submit or view reports
- Admins and authorities can log in for dashboard access

## Contribution Guidelines

- Use kebab-case for files, camelCase for variables
- Add JSDoc comments to all exported functions
- Run `npm run lint` and `npm run format` before committing

## License

MIT

