/**
 * SafePin Header Component
 * This module provides a reusable header that can be included across all pages
 */

export class SafePinHeader {
    constructor() {
        this.currentPage = this.getCurrentPage();
    }

    /**
     * Get the current page name for navigation highlighting
     */
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path === '/' || path === '') {
            return 'home';
        } else if (path.includes('about-us.html')) {
            return 'about';
        } else if (path.includes('features.html')) {
            return 'features';
        } else if (path.includes('faq.html')) {
            return 'faq';
        } else if (path.includes('report.html')) {
            return 'report';
        } else if (path.includes('verification.html')) {
            return 'verification';
        }
        return 'home';
    }

    /**
     * Generate the header HTML
     */
    generateHeader() {
        return `
            <header>
                <div class="container">
                    <a href="/index.html" class="logo">
                        <img src="/SafePin Logo Green.svg" alt="SafePin Logo">
                        SafePin
                    </a>
                    <nav>
                        <ul>
                            <li><a href="/index.html" class="${this.currentPage === 'home' ? 'active' : ''}">Home</a></li>
                            <li><a href="/landing-page/features.html" class="${this.currentPage === 'features' ? 'active' : ''}">Features</a></li>
                            <li><a href="/landing-page/about-us.html" class="${this.currentPage === 'about' ? 'active' : ''}">About Us</a></li>
                            <li><a href="/landing-page/faq.html" class="${this.currentPage === 'faq' ? 'active' : ''}">FAQ</a></li>
                            <li><a href="/login.html" class="nav-button">Authority Access</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }


    /**
     * Insert the header into the page
     */
    insertHeader() {
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = this.generateHeader();
        } else {
            console.warn('Header container not found. Add <div id="header-container"></div> to your page.');
        }
    }

    /**
     * Initialize the header
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.insertHeader();
            });
        } else {
            this.insertHeader();
        }
    }
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    const header = new SafePinHeader();
    header.init();
} 