import { sanitizeHtml, sanitizeText } from '../security';

describe('sanitizeHtml', () => {
    test('handles null and undefined inputs', () => {
        expect(sanitizeHtml(null)).toBe('');
        expect(sanitizeHtml(undefined)).toBe('');
    });

    test('handles non-string inputs', () => {
        expect(sanitizeHtml(123)).toBe('123');
        expect(sanitizeHtml(true)).toBe('true');
        expect(sanitizeHtml({})).toBe('[object Object]');
    });

    test('removes dangerous HTML', () => {
        const input = '<script>alert("xss")</script><p>Hello</p>';
        expect(sanitizeHtml(input)).toBe('<p>Hello</p>');
    });

    test('allows whitelisted tags and attributes', () => {
        const input = '<p class="text">Hello <strong>World</strong></p>';
        expect(sanitizeHtml(input)).toBe('<p class="text">Hello <strong>World</strong></p>');
    });

    test('removes non-whitelisted tags and attributes', () => {
        const input = '<p onclick="alert(1)" style="color:red">Hello</p>';
        expect(sanitizeHtml(input)).toBe('<p>Hello</p>');
    });

    test('handles link sanitization when allowLinks is true', () => {
        const input = '<a href="http://example.com">Link</a>';
        const result = sanitizeHtml(input, { allowLinks: true });
        expect(result).toContain('target="_blank"');
        expect(result).toContain('rel="noopener noreferrer"');
    });

    test('removes unsafe links', () => {
        const input = '<a href="javascript:alert(1)">Link</a>';
        const result = sanitizeHtml(input, { allowLinks: true });
        expect(result).not.toContain('javascript:');
    });

    test('respects custom tag whitelist', () => {
        const input = '<div>Hello</div><span>World</span>';
        const result = sanitizeHtml(input, { 
            allowedTags: ['div']
        });
        expect(result).toBe('<div>Hello</div>World');
    });
});

describe('sanitizeText', () => {
    test('handles null and undefined inputs', () => {
        expect(sanitizeText(null)).toBe('');
        expect(sanitizeText(undefined)).toBe('');
    });

    test('handles non-string inputs', () => {
        expect(sanitizeText(123)).toBe('123');
        expect(sanitizeText(true)).toBe('true');
    });

    test('removes all HTML tags', () => {
        const input = '<p>Hello <strong>World</strong></p>';
        expect(sanitizeText(input)).toBe('Hello World');
    });

    test('decodes HTML entities', () => {
        const input = 'Hello &amp; World &lt;script&gt;';
        expect(sanitizeText(input)).toBe('Hello & World <script>');
    });
}); 