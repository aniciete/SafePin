import { handleError, ValidationError, NetworkError, AuthError } from '../errorHandler';

describe('Error Handler', () => {
    describe('ValidationError', () => {
        test('creates validation error with correct properties', () => {
            const error = new ValidationError('Invalid input');
            expect(error.name).toBe('ValidationError');
            expect(error.message).toBe('Invalid input');
            expect(error.recoverable).toBe(true);
        });
    });

    describe('NetworkError', () => {
        test('creates network error with correct properties', () => {
            const error = new NetworkError('Connection failed');
            expect(error.name).toBe('NetworkError');
            expect(error.message).toBe('Connection failed');
            expect(error.recoverable).toBe(true);
        });
    });

    describe('AuthError', () => {
        test('creates auth error with correct properties', () => {
            const error = new AuthError('Invalid credentials');
            expect(error.name).toBe('AuthError');
            expect(error.message).toBe('Invalid credentials');
            expect(error.recoverable).toBe(true);
        });
    });

    describe('handleError', () => {
        let consoleSpy;
        
        beforeEach(() => {
            consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleSpy.mockRestore();
        });

        test('handles ValidationError correctly', () => {
            const error = new ValidationError('Invalid form data');
            const result = handleError(error);
            
            expect(result).toEqual({
                type: 'validation',
                message: 'Invalid form data',
                recoverable: true
            });
            expect(consoleSpy).toHaveBeenCalledWith('Validation Error:', error);
        });

        test('handles NetworkError correctly', () => {
            const error = new NetworkError('API request failed');
            const result = handleError(error);
            
            expect(result).toEqual({
                type: 'network',
                message: 'API request failed',
                recoverable: true
            });
            expect(consoleSpy).toHaveBeenCalledWith('Network Error:', error);
        });

        test('handles AuthError correctly', () => {
            const error = new AuthError('Session expired');
            const result = handleError(error);
            
            expect(result).toEqual({
                type: 'auth',
                message: 'Session expired',
                recoverable: true
            });
            expect(consoleSpy).toHaveBeenCalledWith('Auth Error:', error);
        });

        test('handles unknown errors correctly', () => {
            const error = new Error('Unknown error');
            const result = handleError(error);
            
            expect(result).toEqual({
                type: 'unknown',
                message: 'An unexpected error occurred',
                recoverable: false
            });
            expect(consoleSpy).toHaveBeenCalledWith('Unknown Error:', error);
        });

        test('handles null/undefined errors', () => {
            const result = handleError(null);
            
            expect(result).toEqual({
                type: 'unknown',
                message: 'An unexpected error occurred',
                recoverable: false
            });
            expect(consoleSpy).toHaveBeenCalledWith('Unknown Error:', null);
        });
    });
}); 