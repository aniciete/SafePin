import { validateParams, sanitizeInput, isAllowedOrigin } from '../security';

describe('sanitizeInput', () => {
    test('handles null and undefined inputs', () => {
        expect(sanitizeInput(null)).toBe('');
        expect(sanitizeInput(undefined)).toBe('');
    });

    test('handles non-string inputs', () => {
        expect(sanitizeInput(123)).toBe('');
        expect(sanitizeInput({})).toBe('');
        expect(sanitizeInput([])).toBe('');
    });

    test('sanitizes malicious HTML/JavaScript', () => {
        const malicious = '<script>alert("xss")</script><img src="x" onerror="alert(1)"/>';
        expect(sanitizeInput(malicious)).not.toContain('<script>');
        expect(sanitizeInput(malicious)).not.toContain('onerror');
    });

    test('preserves safe text content', () => {
        expect(sanitizeInput('Hello World')).toBe('Hello World');
        expect(sanitizeInput(' Test ')).toBe('Test');
    });
});

describe('validateParams', () => {
    const rules = {
        name: { type: 'string', validate: (val) => val.length >= 2 },
        age: { type: 'number', validate: (val) => val >= 0 },
        active: { type: 'boolean' }
    };

    test('validates and sanitizes string parameters', () => {
        const params = { name: '  John  ' };
        const result = validateParams(params, rules);
        expect(result.name).toBe('John');
    });

    test('validates and converts number parameters', () => {
        const params = { age: '25' };
        const result = validateParams(params, rules);
        expect(result.age).toBe(25);
    });

    test('validates and converts boolean parameters', () => {
        const params = { active: 'true' };
        const result = validateParams(params, rules);
        expect(result.active).toBe(true);
    });

    test('throws error for invalid parameters', () => {
        const params = { name: 'A' }; // Too short
        expect(() => validateParams(params, rules)).toThrow('Invalid name');
    });

    test('ignores unknown parameters', () => {
        const params = { unknown: 'value' };
        const result = validateParams(params, rules);
        expect(result.unknown).toBeUndefined();
    });
});

describe('isAllowedOrigin', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    test('allows production origins', () => {
        expect(isAllowedOrigin('https://safepin.web.app')).toBe(true);
        expect(isAllowedOrigin('https://safepin.firebaseapp.com')).toBe(true);
    });

    test('rejects unknown origins', () => {
        expect(isAllowedOrigin('https://malicious.com')).toBe(false);
        expect(isAllowedOrigin('http://safepin.web.app')).toBe(false);
    });

    test('allows localhost in development', () => {
        process.env.FUNCTIONS_EMULATOR = 'true';
        expect(isAllowedOrigin('http://localhost:5000')).toBe(true);
    });

    test('handles invalid inputs', () => {
        expect(isAllowedOrigin(null)).toBe(false);
        expect(isAllowedOrigin('')).toBe(false);
        expect(isAllowedOrigin(undefined)).toBe(false);
    });
}); 