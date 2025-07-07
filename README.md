# SafePin

A secure web application for [brief description of your app].

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

## Security Features

- Email verification required
- Rate limiting on authentication endpoints
- Session management with timeout
- Input validation and sanitization
- CSRF protection
- XSS prevention

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

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

[Your license here]