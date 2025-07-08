/**
 * SafePin Footer Component
 * This module provides a reusable footer that can be included across all pages
 */

export class SafePinFooter {
    constructor() {
        this.currentYear = new Date().getFullYear();
    }

    /**
     * Generate the footer HTML
     */
    generateFooter() {
        return `
            <footer>
                <div class="container footer-container">
                    <div class="footer-column">
                        <h4><img src="/SafePin Map Logo.png" alt="SafePin Logo" style="vertical-align: middle; margin-right: 5px; width: 20px; height: 20px;">SafePin</h4>
                        <p>Copyright © ${this.currentYear} SafePin <br> All rights reserved.</p>
                        <div class="social-icons" style="margin-top:10px;">
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="LinkedIn" style="width: 20px; height: 20px;"></a>
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="Twitter/X" style="width: 20px; height: 20px;"></a>
                            <a href="#" style="margin-right:10px;"><img src="/SafePin Map Logo.png" alt="YouTube" style="width: 20px; height: 20px;"></a>
                            <a href="#"><img src="/SafePin Map Logo.png" alt="Instagram" style="width: 20px; height: 20px;"></a>
                        </div>
                    </div>
                    <div class="footer-column">
                        <h4>SafePin</h4>
                        <ul>
                            <li><a href="${this.getAboutLink()}">About us</a></li>
                            <li><a href="${this.getFaqLink()}">FAQ</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help center</a></li>
                            <li><a href="#">Terms of service</a></li>
                            <li><a href="#">Privacy policy</a></li>
                            <li><a href="#">Status</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4>Stay up to date</h4>
                        <form class="newsletter-form" onsubmit="return handleNewsletterSubmit(event)">
                            <input type="email" placeholder="Enter your email address" required>
                            <button type="submit" class="subscribe-btn"><img src="/SafePin Map Logo.png" alt="Send" style="width: 16px; height: 16px;"></button>
                        </form>
                    </div>
                </div>
            </footer>
        `;
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
     * Get FAQ link path based on current page location
     */
    getFaqLink() {
        const path = window.location.pathname;
        if (path.includes('landing-page/')) {
            return 'faq.html';
        }
        return 'landing-page/faq.html';
    }

    /**
     * Insert the footer into the page
     */
    insertFooter() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            footerContainer.innerHTML = this.generateFooter();
        } else {
            console.warn('Footer container not found. Add <div id="footer-container"></div> to your page.');
        }
    }

    /**
     * Initialize the footer
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.insertFooter();
            });
        } else {
            this.insertFooter();
        }
    }
}

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    // Here you would typically send the email to your backend
    console.log('Newsletter subscription:', email);
    
    // Show success message
    alert('Thank you for subscribing to our newsletter!');
    
    // Clear the form
    event.target.reset();
    
    return false;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafePinFooter;
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    const footer = new SafePinFooter();
    footer.init();
} 