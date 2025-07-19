# SafePin

A secure web application for anonymous crime reporting and community safety monitoring in Metro Manila.

## Technology Stack

- **Frontend:** React, Vite
- **Backend:** Supabase
- **Testing:** Playwright

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Security Settings
SESSION_SECRET=your_session_secret_here
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Environment
NODE_ENV=development
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
- Email verification required
- Rate limiting on authentication endpoints
- Session management with timeout
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

#### Keyboard Navigation
- Full keyboard support for all interactive elements
- Focus management and trapping in modals
- Skip links for main content
- Visible focus indicators
- Logical tab order

#### Screen Reader Support
- ARIA landmarks and labels
- Semantic HTML structure
- Descriptive link text
- Form input labels
- Status announcements
- Image alt text

#### Visual Accessibility
- High contrast mode support
- Adjustable text size
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

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## Testing

```bash
# Run unit and integration tests
npm run test

# Run E2E tests with Playwright
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

## License

[Your license here]