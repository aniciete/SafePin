import { Help } from '../Help';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Help Component', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
        container = null;
    });

    test('renders with correct ARIA attributes', () => {
        const help = new Help();
        container.appendChild(help.render());

        const helpButton = container.querySelector('[aria-label="Help"]');
        expect(helpButton).toHaveAttribute('aria-expanded', 'false');
        expect(helpButton).toHaveAttribute('role', 'button');
    });

    test('toggles content visibility on click', () => {
        const help = new Help();
        container.appendChild(help.render());

        const helpButton = container.querySelector('[aria-label="Help"]');
        const content = container.querySelector('[role="region"]');

        fireEvent.click(helpButton);
        expect(helpButton).toHaveAttribute('aria-expanded', 'true');
        expect(content).toBeVisible();

        fireEvent.click(helpButton);
        expect(helpButton).toHaveAttribute('aria-expanded', 'false');
        expect(content).not.toBeVisible();
    });

    test('handles keyboard navigation', () => {
        const help = new Help();
        container.appendChild(help.render());

        const helpButton = container.querySelector('[aria-label="Help"]');
        const content = container.querySelector('[role="region"]');

        // Test Enter key
        fireEvent.keyDown(helpButton, { key: 'Enter' });
        expect(helpButton).toHaveAttribute('aria-expanded', 'true');
        expect(content).toBeVisible();

        // Test Space key
        fireEvent.keyDown(helpButton, { key: ' ' });
        expect(helpButton).toHaveAttribute('aria-expanded', 'false');
        expect(content).not.toBeVisible();

        // Test Escape key when open
        fireEvent.keyDown(helpButton, { key: 'Enter' });
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(helpButton).toHaveAttribute('aria-expanded', 'false');
        expect(content).not.toBeVisible();
    });

    test('sections have correct heading structure', () => {
        const help = new Help();
        container.appendChild(help.render());

        const sections = container.querySelectorAll('[role="region"] section');
        sections.forEach(section => {
            const heading = section.querySelector('h3');
            expect(heading).toBeInTheDocument();
            expect(heading).toHaveAttribute('id');
            expect(section).toHaveAttribute('aria-labelledby', heading.id);
        });
    });

    test('expandable sections work correctly', () => {
        const help = new Help();
        container.appendChild(help.render());

        const section = container.querySelector('section');
        const button = section.querySelector('button');
        const content = section.querySelector('[role="region"]');

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(content).not.toBeVisible();

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(content).toBeVisible();
    });

    test('handles reduced motion preference', () => {
        // Mock matchMedia
        window.matchMedia = jest.fn().mockImplementation(query => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));

        const help = new Help();
        container.appendChild(help.render());

        const content = container.querySelector('[role="region"]');
        expect(content).toHaveClass('reduce-motion');
    });
}); 