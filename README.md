# SafePin

A secure web application for anonymous crime reporting and community safety monitoring in Metro Manila.

## Project Structure

```
SafePin/
├── src/                    # Frontend source code
│   ├── config/            # Configuration files
│   │   └── firebase.js    # Firebase initialization
│   ├── services/          # Service layer
│   │   └── auth.service.js # Authentication service
│   ├── components/        # Reusable UI components
│   ├── utils/             # Utility functions
│   └── pages/             # Page components
├── functions/             # Backend (Firebase Functions)
│   ├── src/              # Backend source code
│   └── test/             # Backend tests
└── public/               # Static assets
```

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_auth_domain_here
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
FIREBASE_APP_ID=your_app_id_here

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
cd functions && npm install
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

### Accessibility Checklist for Contributors

When contributing to SafePin, ensure your changes meet these accessibility requirements:

1. **Semantic HTML**
   - Use appropriate HTML elements
   - Maintain proper heading hierarchy
   - Include ARIA attributes when needed

2. **Keyboard Support**
   - All interactive elements are focusable
   - Logical tab order
   - Keyboard shortcuts where appropriate
   - Focus management in modals/popups

3. **Screen Readers**
   - Meaningful alt text for images
   - Descriptive link text
   - Form labels and instructions
   - Status updates and notifications

4. **Visual Design**
   - Sufficient color contrast (WCAG AA)
   - Text resizing support
   - Visible focus indicators
   - Flexible layouts

5. **Motion and Animation**
   - Respect reduced motion preferences
   - No flashing content
   - Pausable animations
   - Optional transitions

## Testing

```bash
# Run unit and integration tests
npm run test

# Run E2E tests
npm run cypress:open  # Interactive mode
npm run cypress:run   # Headless mode

# Run accessibility tests
npm run test:a11y
```

## License

[Your license here]