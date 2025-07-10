import { Footer } from '../Footer';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Footer Component', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    test('renders with correct semantic structure', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const footerElement = container.querySelector('footer');
        expect(footerElement).toBeInTheDocument();
        expect(footerElement).toHaveAttribute('role', 'contentinfo');
    });

    test('navigation sections have proper ARIA landmarks', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const navSections = container.querySelectorAll('nav');
        navSections.forEach(nav => {
            expect(nav).toHaveAttribute('aria-label');
            expect(nav).toHaveAttribute('role', 'navigation');
        });
    });

    test('links have descriptive text and proper attributes', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const links = container.querySelectorAll('a');
        links.forEach(link => {
            expect(link).toHaveAttribute('href');
            expect(link.textContent.trim()).not.toBe('');
            
            // External links should have proper attributes
            if (link.getAttribute('href').startsWith('http')) {
                expect(link).toHaveAttribute('rel', 'noopener noreferrer');
                expect(link).toHaveAttribute('target', '_blank');
            }
        });
    });

    test('handles keyboard navigation', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const links = container.querySelectorAll('a');
        const firstLink = links[0];
        const lastLink = links[links.length - 1];

        // Test Tab navigation
        firstLink.focus();
        expect(document.activeElement).toBe(firstLink);
        
        // Test focus trap in footer
        fireEvent.keyDown(lastLink, { key: 'Tab' });
        expect(document.activeElement).toBe(firstLink);
    });

    test('social media links have proper accessibility attributes', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const socialLinks = container.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            expect(link).toHaveAttribute('aria-label');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            expect(link).toHaveAttribute('target', '_blank');
        });
    });

    test('contact information is properly structured', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const contactSection = container.querySelector('.contact-info');
        expect(contactSection).toBeInTheDocument();
        expect(contactSection).toHaveAttribute('role', 'region');
        expect(contactSection).toHaveAttribute('aria-label', 'Contact Information');
    });

    test('language selector works correctly', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const langSelect = container.querySelector('select[aria-label="Select language"]');
        expect(langSelect).toBeInTheDocument();
        
        fireEvent.change(langSelect, { target: { value: 'tl' } });
        expect(langSelect.value).toBe('tl');
    });

    test('newsletter form has proper accessibility attributes', () => {
        const footer = new Footer();
        container.appendChild(footer.render());

        const form = container.querySelector('form');
        expect(form).toHaveAttribute('aria-label', 'Newsletter signup');
        
        const emailInput = form.querySelector('input[type="email"]');
        expect(emailInput).toHaveAttribute('aria-required', 'true');
        expect(emailInput).toHaveAttribute('aria-label', 'Email address for newsletter');
        
        const submitButton = form.querySelector('button[type="submit"]');
        expect(submitButton).toHaveAttribute('aria-label', 'Subscribe to newsletter');
    });
}); 