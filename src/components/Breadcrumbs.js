import { getBreadcrumbs } from '../utils/pathUtils.js';

/**
 * Breadcrumbs component with enhanced accessibility
 */
export class Breadcrumbs {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
    }

    /**
     * Render breadcrumbs in the container
     */
    render() {
        const breadcrumbs = getBreadcrumbs();
        const breadcrumbsHtml = breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const position = index + 2; // +2 because home is position 1
            const total = breadcrumbs.length + 1; // +1 for home

            if (isLast) {
                return `
                    <li class="breadcrumb-item active" aria-current="page">
                        <span>${crumb.label}</span>
                    </li>
                `;
            }

            return `
                <li class="breadcrumb-item">
                    <a href="${crumb.path}" 
                       aria-label="${crumb.label}, breadcrumb ${position} of ${total}"
                       ${index === 0 ? 'aria-describedby="breadcrumb-desc"' : ''}>
                        ${crumb.label}
                    </a>
                </li>
            `;
        }).join('');

        this.container.innerHTML = `
            <nav aria-label="Breadcrumb" class="breadcrumb-nav">
                <p id="breadcrumb-desc" class="sr-only">You are here:</p>
                <ol class="breadcrumb" role="list">
                    <li class="breadcrumb-item">
                        <a href="/" 
                           aria-label="Home, breadcrumb 1 of ${breadcrumbs.length + 1}"
                           aria-describedby="breadcrumb-desc">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                 width="16" 
                                 height="16" 
                                 viewBox="0 0 24 24" 
                                 fill="none" 
                                 stroke="currentColor" 
                                 stroke-width="2" 
                                 stroke-linecap="round" 
                                 stroke-linejoin="round"
                                 aria-hidden="true"
                                 focusable="false">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                            <span class="sr-only">Home</span>
                        </a>
                    </li>
                    ${breadcrumbsHtml}
                </ol>
            </nav>
        `;

        this.addStyles();
        this.setupKeyboardNavigation();
    }

    /**
     * Setup keyboard navigation for breadcrumbs
     * @private
     */
    setupKeyboardNavigation() {
        const breadcrumbLinks = this.container.querySelectorAll('.breadcrumb-item a');
        
        breadcrumbLinks.forEach((link) => {
            link.addEventListener('keydown', (e) => {
                const items = Array.from(breadcrumbLinks);
                const currentIndex = items.indexOf(e.target);
                let nextIndex;

                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        nextIndex = Math.max(currentIndex - 1, 0);
                        items[nextIndex].focus();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        nextIndex = Math.min(currentIndex + 1, items.length - 1);
                        items[nextIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        items[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        items[items.length - 1].focus();
                        break;
                }
            });
        });
    }

    /**
     * Add styles for breadcrumbs
     * @private
     */
    addStyles() {
        if (!document.getElementById('breadcrumb-styles')) {
            const styles = document.createElement('style');
            styles.id = 'breadcrumb-styles';
            styles.textContent = `
                .breadcrumb-nav {
                    margin-bottom: 1rem;
                }

                .breadcrumb {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.75rem 1rem;
                    margin: 0;
                    list-style: none;
                    background-color: #f8f9fa;
                    border-radius: 0.25rem;
                }

                .breadcrumb-item {
                    display: flex;
                    align-items: center;
                }

                .breadcrumb-item + .breadcrumb-item {
                    padding-left: 0.5rem;
                }

                .breadcrumb-item + .breadcrumb-item::before {
                    display: inline-block;
                    padding-right: 0.5rem;
                    color: #6c757d;
                    content: "/";
                }

                .breadcrumb-item a {
                    color: var(--color-primary, #0d6efd);
                    text-decoration: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.25rem;
                    transition: all 0.2s ease-in-out;
                }

                .breadcrumb-item a:hover {
                    color: var(--color-primary-dark, #0a58ca);
                    text-decoration: underline;
                    background-color: rgba(13, 110, 253, 0.1);
                }

                .breadcrumb-item a:focus {
                    outline: 2px solid var(--color-primary, #0d6efd);
                    outline-offset: 2px;
                }

                .breadcrumb-item a:focus:not(:focus-visible) {
                    outline: none;
                }

                .breadcrumb-item.active {
                    color: #6c757d;
                    font-weight: 500;
                }

                .breadcrumb-item svg {
                    width: 16px;
                    height: 16px;
                    margin-right: 0.25rem;
                    vertical-align: text-bottom;
                }

                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }

                @media (prefers-reduced-motion: reduce) {
                    .breadcrumb-item a {
                        transition: none;
                    }
                }

                @media screen and (max-width: 640px) {
                    .breadcrumb {
                        padding: 0.5rem;
                        font-size: 0.875rem;
                    }

                    .breadcrumb-item + .breadcrumb-item {
                        padding-left: 0.25rem;
                    }

                    .breadcrumb-item + .breadcrumb-item::before {
                        padding-right: 0.25rem;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
} 