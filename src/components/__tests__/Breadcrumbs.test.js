import { Breadcrumbs } from '../Breadcrumbs';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Breadcrumbs Component', () => {
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
        const breadcrumbs = new Breadcrumbs([
            { text: 'Home', href: '/' },
            { text: 'Reports', href: '/reports' },
            { text: 'Submit', href: '/reports/submit' }
        ]);
        container.appendChild(breadcrumbs.render());

        const nav = container.querySelector('nav');
        expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
        expect(nav).toHaveAttribute('role', 'navigation');

        const list = nav.querySelector('ol');
        expect(list).toHaveAttribute('role', 'list');
    });

    test('renders correct number of items with proper structure', () => {
        const items = [
            { text: 'Home', href: '/' },
            { text: 'Reports', href: '/reports' },
            { text: 'Submit', href: '/reports/submit' }
        ];
        const breadcrumbs = new Breadcrumbs(items);
        container.appendChild(breadcrumbs.render());

        const listItems = container.querySelectorAll('li');
        expect(listItems).toHaveLength(items.length);

        listItems.forEach((item, index) => {
            const link = item.querySelector('a');
            expect(link).toHaveAttribute('href', items[index].href);
            expect(link).toHaveTextContent(items[index].text);
            
            if (index < items.length - 1) {
                expect(item).toHaveAttribute('aria-current', 'false');
            } else {
                expect(item).toHaveAttribute('aria-current', 'page');
            }
        });
    });

    test('handles keyboard navigation', () => {
        const breadcrumbs = new Breadcrumbs([
            { text: 'Home', href: '/' },
            { text: 'Reports', href: '/reports' }
        ]);
        container.appendChild(breadcrumbs.render());

        const links = container.querySelectorAll('a');
        const firstLink = links[0];
        const secondLink = links[1];

        // Test Tab navigation
        firstLink.focus();
        expect(document.activeElement).toBe(firstLink);
        
        fireEvent.keyDown(firstLink, { key: 'Tab' });
        expect(document.activeElement).toBe(secondLink);
    });

    test('separators are properly hidden from screen readers', () => {
        const breadcrumbs = new Breadcrumbs([
            { text: 'Home', href: '/' },
            { text: 'Reports', href: '/reports' }
        ]);
        container.appendChild(breadcrumbs.render());

        const separators = container.querySelectorAll('[aria-hidden="true"]');
        expect(separators).toHaveLength(1); // One separator for two items
    });

    test('handles empty items gracefully', () => {
        const breadcrumbs = new Breadcrumbs([]);
        container.appendChild(breadcrumbs.render());

        const nav = container.querySelector('nav');
        expect(nav).toBeInTheDocument();
        expect(nav.querySelector('ol')).toBeEmptyDOMElement();
    });

    test('applies correct visual styles for current page', () => {
        const breadcrumbs = new Breadcrumbs([
            { text: 'Home', href: '/' },
            { text: 'Current', href: '/current' }
        ]);
        container.appendChild(breadcrumbs.render());

        const currentItem = container.querySelector('[aria-current="page"]');
        expect(currentItem).toHaveClass('current');
        expect(currentItem.querySelector('a')).toHaveClass('current-page');
    });
}); 