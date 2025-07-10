/**
 * Footer component with enhanced accessibility
 */
export class Footer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
    }

    /**
     * Render the footer
     */
    render() {
        const currentYear = new Date().getFullYear();
        
        this.container.innerHTML = `
            <footer class="site-footer" role="contentinfo">
                <div class="footer-content">
                    <div class="footer-section">
                        <h2 class="footer-heading">About SafePin</h2>
                        <p>SafePin is a web-based crime/safety reporting platform that enables secure, anonymous reporting while implementing a tiered information access system.</p>
                    </div>

                    <div class="footer-section">
                        <h2 class="footer-heading">Quick Links</h2>
                        <nav aria-label="Footer navigation">
                            <ul class="footer-links" role="list">
                                <li>
                                    <a href="/about-us" class="footer-link">
                                        About Us
                                        <span class="sr-only">(Opens in the same window)</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/features" class="footer-link">
                                        Features
                                        <span class="sr-only">(Opens in the same window)</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/faq" class="footer-link">
                                        FAQ
                                        <span class="sr-only">(Opens in the same window)</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/privacy-policy" class="footer-link">
                                        Privacy Policy
                                        <span class="sr-only">(Opens in the same window)</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="footer-section">
                        <h2 class="footer-heading">Contact Us</h2>
                        <address class="footer-contact">
                            <a href="mailto:support@safepin.org" class="footer-link">
                                support@safepin.org
                                <span class="sr-only">(Opens email client)</span>
                            </a>
                            <a href="tel:+639123456789" class="footer-link">
                                +63 912 345 6789
                                <span class="sr-only">(Opens phone dialer)</span>
                            </a>
                        </address>
                    </div>

                    <div class="footer-section">
                        <h2 class="footer-heading">Follow Us</h2>
                        <ul class="social-links" role="list" aria-label="Social media links">
                            <li>
                                <a href="https://facebook.com/safepin" 
                                   class="social-link"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Follow us on Facebook (Opens in a new window)">
                                    <svg class="social-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://twitter.com/safepin" 
                                   class="social-link"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Follow us on Twitter (Opens in a new window)">
                                    <svg class="social-icon" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
                                        <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.58v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom" role="presentation">
                    <p class="copyright">
                        © ${currentYear} SafePin. All rights reserved.
                        <span class="sr-only">Copyright notice</span>
                    </p>
                </div>
            </footer>
        `;

        this.addStyles();
        this.setupKeyboardNavigation();
    }

    /**
     * Setup keyboard navigation
     * @private
     */
    setupKeyboardNavigation() {
        const footerLinks = this.container.querySelectorAll('.footer-link, .social-link');
        
        footerLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                const links = Array.from(footerLinks);
                const currentIndex = links.indexOf(e.target);
                let nextIndex;

                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        nextIndex = (currentIndex + 1) % links.length;
                        links[nextIndex].focus();
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        nextIndex = currentIndex - 1;
                        if (nextIndex < 0) nextIndex = links.length - 1;
                        links[nextIndex].focus();
                        break;
                    case 'Home':
                        e.preventDefault();
                        links[0].focus();
                        break;
                    case 'End':
                        e.preventDefault();
                        links[links.length - 1].focus();
                        break;
                }
            });
        });
    }

    /**
     * Add styles for the footer
     * @private
     */
    addStyles() {
        if (!document.getElementById('footer-styles')) {
            const styles = document.createElement('style');
            styles.id = 'footer-styles';
            styles.textContent = `
                .site-footer {
                    background-color: #1a1a1a;
                    color: #ffffff;
                    padding: 3rem 1rem;
                    margin-top: auto;
                }

                .footer-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }

                .footer-section {
                    padding: 0 1rem;
                }

                .footer-heading {
                    color: #ffffff;
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .footer-links,
                .social-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li,
                .social-links li {
                    margin-bottom: 0.5rem;
                }

                .footer-link,
                .social-link {
                    color: #e5e5e5;
                    text-decoration: none;
                    transition: color 0.2s ease-in-out;
                    display: inline-block;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                }

                .footer-link:hover,
                .social-link:hover {
                    color: #ffffff;
                    text-decoration: underline;
                }

                .footer-link:focus,
                .social-link:focus {
                    outline: 2px solid #ffffff;
                    outline-offset: 2px;
                }

                .footer-link:focus:not(:focus-visible),
                .social-link:focus:not(:focus-visible) {
                    outline: none;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                }

                .social-icon {
                    width: 24px;
                    height: 24px;
                    fill: currentColor;
                }

                .footer-bottom {
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid #333;
                    text-align: center;
                }

                .copyright {
                    color: #999;
                    font-size: 0.875rem;
                }

                .footer-contact {
                    font-style: normal;
                }

                .footer-contact .footer-link {
                    display: block;
                    margin-bottom: 0.5rem;
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
                    .footer-link,
                    .social-link {
                        transition: none;
                    }
                }

                @media screen and (max-width: 640px) {
                    .site-footer {
                        padding: 2rem 1rem;
                    }

                    .footer-content {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }

                    .footer-section {
                        padding: 0;
                    }

                    .footer-heading {
                        font-size: 1.125rem;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }
}
