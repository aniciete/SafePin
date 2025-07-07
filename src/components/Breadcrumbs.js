import { getBreadcrumbs } from '../utils/pathUtils.js';

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
            return `
                <li class="breadcrumb-item${isLast ? ' active' : ''}">
                    ${isLast ? 
                        `<span>${crumb.label}</span>` : 
                        `<a href="${crumb.path}">${crumb.label}</a>`
                    }
                </li>
            `;
        }).join('');

        this.container.innerHTML = `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9 22 9 12 15 12 15 22"/>
                            </svg>
                        </a>
                    </li>
                    ${breadcrumbsHtml}
                </ol>
            </nav>
        `;

        // Add styles if not already present
        if (!document.getElementById('breadcrumb-styles')) {
            const styles = document.createElement('style');
            styles.id = 'breadcrumb-styles';
            styles.textContent = `
                .breadcrumb {
                    display: flex;
                    flex-wrap: wrap;
                    padding: 0.75rem 1rem;
                    margin-bottom: 1rem;
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
                    color: var(--color-primary);
                    text-decoration: none;
                }

                .breadcrumb-item a:hover {
                    color: var(--color-primary-dark);
                    text-decoration: underline;
                }

                .breadcrumb-item.active {
                    color: #6c757d;
                }

                .breadcrumb-item svg {
                    width: 16px;
                    height: 16px;
                    margin-right: 0.25rem;
                }
            `;
            document.head.appendChild(styles);
        }
    }
} 