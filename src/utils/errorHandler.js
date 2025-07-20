class BaseError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.recoverable = true; 
  }
}

export class ValidationError extends BaseError {}

export class NetworkError extends BaseError {}

export class AuthError extends BaseError {}

export class UploadError extends BaseError {}

export const handleError = (error) => {
  let errorType = 'unknown';
  let errorMessage = 'An unexpected error occurred';
  let isRecoverable = false;

  if (error instanceof ValidationError) {
    errorType = 'validation';
    errorMessage = error.message;
    isRecoverable = error.recoverable;
    console.error('Validation Error:', error);
  } else if (error instanceof NetworkError) {
    errorType = 'network';
    errorMessage = error.message;
    isRecoverable = error.recoverable;
    console.error('Network Error:', error);
  } else if (error instanceof AuthError) {
    errorType = 'auth';
    errorMessage = error.message;
    isRecoverable = error.recoverable;
    console.error('Auth Error:', error);
  } else {
    console.error('Unknown Error:', error);
  }

  return {
    type: errorType,
    message: errorMessage,
    recoverable: isRecoverable,
  };
};