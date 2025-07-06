/**
 * SafePin Header Component
 * This module provides a reusable header that can be included across all pages
 */

class SafePinHeader {
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
                    <a href="${this.getHomeLink()}" class="logo">
                        <img src="${this.getLogoPath()}" alt="SafePin Logo">
                        SafePin
                    </a>
                    <nav>
                        <ul>
                            <li><a href="${this.getHomeLink()}" ${this.currentPage === 'home' ? 'style="color: #6ab04c; font-weight: bold;"' : ''}>Home</a></li>
                            <li><a href="${this.getFeaturesLink()}" ${this.currentPage === 'features' ? 'style="color: #6ab04c; font-weight: bold;"' : ''}>Features</a></li>
                            <li><a href="${this.getAboutLink()}" ${this.currentPage === 'about' ? 'style="color: #6ab04c; font-weight: bold;"' : ''}>About Us</a></li>
                            <li><a href="${this.getFaqLink()}" ${this.currentPage === 'faq' ? 'style="color: #6ab04c; font-weight: bold;"' : ''}>FAQ</a></li>
                            <li><a href="${this.getLoginLink()}" class="nav-button">Authority Access</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }

    /**
     * Get the appropriate home link based on current page location
     */
    getHomeLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return '../index.html';
        }
        return 'index.html';
    }

    /**
     * Get the appropriate logo path based on current page location
     */
    getLogoPath() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return '../landing-page/SafePin Logo Green.svg';
        }
        return 'landing-page/SafePin Logo Green.svg';
    }

    /**
     * Get the appropriate about link based on current page location
     */
    getAboutLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return 'about-us.html';
        }
        return 'landing-page/about-us.html';
    }

    /**
     * Get the appropriate features link based on current page location
     */
    getFeaturesLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return 'features.html';
        }
        return 'landing-page/features.html';
    }

    /**
     * Get the appropriate FAQ link based on current page location
     */
    getFaqLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return 'faq.html';
        }
        return 'landing-page/faq.html';
    }

    /**
     * Get the appropriate login link based on current page location
     */
    getLoginLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return '../login.html';
        }
        return 'login.html';
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

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafePinHeader;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    const header = new SafePinHeader();
    header.init();
} 