# SafePin

A secure web application for anonymous crime reporting and community safety monitoring in Metro Manila.

## Project Status

This project is currently in a stable state. All major features have been implemented, and all known bugs have been resolved. The application is ready for deployment.

## Technology Stack

- **Frontend:** React, Vite
- **Backend:** Supabase
- **Database:** PostgreSQL
- **Testing:** Playwright

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Features

### Security
- Session management
- Input validation and sanitization
- CSRF protection
- XSS prevention

### Error Handling
- Custom error types for different scenarios
- Automatic error recovery where possible
- Consistent error messaging
- Comprehensive error logging
- Retry mechanisms for network operations

### Accessibility
SafePin is committed to providing an accessible experience for all users. Our accessibility features include:

#### Screen Reader Support
- ARIA landmarks and labels
- Semantic HTML structure
- Descriptive link text
- Form input labels
- Status announcements
- Image alt text

#### Visual Accessibility
- Color-independent design
- Clear visual hierarchy
- Consistent layout

#### Motion and Animation
- Reduced motion support
- No auto-playing content
- Pausable animations
- Optional transitions

#### Assistive Components
1. **Help Component**
   - Expandable sections
   - Keyboard-accessible navigation
   - Screen reader announcements
   - Context-sensitive help

2. **Breadcrumbs Component**
   - Clear navigation path
   - Current page indication
   - ARIA landmark navigation
   - Semantic list structure

3. **Footer Component**
   - Organized navigation sections
   - Accessible forms
   - Language selection
   - Contact information

### User Management
- **Admin Role:** Admins can create, edit, and delete users, as well as view all reports.
- **Authority Role:** Authorities can view and manage reports within their assigned jurisdiction.

## Development Guidelines

1. **Code Organization**
   - Keep frontend and backend code separate
   - Use services for business logic
   - Keep components focused and reusable

2. **Security**
   - Never commit sensitive data or API keys
   - Always validate user input
   - Use environment variables for configuration

3. **Testing**
   - Write unit tests for critical functionality
   - Test security measures thoroughly
   - Run tests before committing

4. **Accessibility**
   - Follow WCAG 2.1 Level AA guidelines
   - Test with screen readers
   - Support keyboard navigation
   - Maintain color contrast
   - Provide text alternatives

5. **Database Migrations**
   - Create a new migration file for each schema change.
   - Run `npx supabase db push` to apply the changes to the database.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request
