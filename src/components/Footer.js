/**
 * Footer Component
 * A reusable footer component with newsletter subscription
 */
import { isValidEmail } from '../utils/helpers.js';

class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.socialLinks = {
            linkedin: 'https://linkedin.com/company/safepin',
            twitter: 'https://twitter.com/safepin',
            youtube: 'https://youtube.com/safepin',
            instagram: 'https://instagram.com/safepin'
        };
        
        this.navigationLinks = {
            safepin: [
                { text: 'About us', url: '/pages/about.html' },
                { text: 'FAQ', url: '/pages/faq.html' },
                { text: 'Contact us', url: '/pages/contact.html' },
                { text: 'Terms of Service', url: '/pages/terms.html' },
                { text: 'Privacy policy', url: '/pages/privacy.html' }
            ],
            support: [
                { text: 'Help center', url: '/pages/help.html' },
                { text: 'Terms of service', url: '/pages/terms.html' },
                { text: 'Privacy policy', url: '/pages/privacy.html' },
                { text: 'Status', url: '/pages/status.html' }
            ]
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const styles = `
            <style>
                :host {
                    display: block;
                    background: var(--color-text);
                    color: var(--color-white);
                    padding: var(--spacing-xxl) 0;
                }

                .container {
                    max-width: var(--container-max-width);
                    margin: 0 auto;
                    padding: 0 var(--container-padding);
                }

                .footer-grid {
                    display: grid;
                    grid-template-columns: 2fr repeat(2, 1fr) 1.5fr;
                    gap: var(--spacing-xl);
                }

                .footer-brand {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    color: var(--color-white);
                    font-size: 1.5rem;
                    font-weight: var(--font-weight-bold);
                    text-decoration: none;
                }

                .footer-logo img {
                    height: 32px;
                }

                .footer-description {
                    color: rgba(255, 255, 255, 0.7);
                    line-height: 1.6;
                    margin: 0;
                }

                .footer-social {
                    display: flex;
                    gap: var(--spacing-md);
                    margin-top: var(--spacing-md);
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: var(--color-white);
                    transition: background var(--transition-fast);
                }

                .social-link:hover {
                    background: var(--color-primary);
                }

                .footer-nav h3 {
                    color: var(--color-white);
                    font-size: 1.125rem;
                    margin: 0 0 var(--spacing-lg);
                }

                .footer-nav ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-nav li:not(:last-child) {
                    margin-bottom: var(--spacing-sm);
                }

                .footer-nav a {
                    color: rgba(255, 255, 255, 0.7);
                    text-decoration: none;
                    transition: color var(--transition-fast);
                }

                .footer-nav a:hover {
                    color: var(--color-white);
                }

                .newsletter {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                }

                .newsletter h3 {
                    color: var(--color-white);
                    font-size: 1.125rem;
                    margin: 0;
                }

                .newsletter p {
                    color: rgba(255, 255, 255, 0.7);
                    margin: 0;
                    line-height: 1.6;
                }

                .newsletter-form {
                    display: flex;
                    gap: var(--spacing-sm);
                }

                .newsletter-input {
                    flex: 1;
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: var(--border-radius-md);
                    color: var(--color-white);
                    font-size: 0.875rem;
                    transition: all var(--transition-fast);
                }

                .newsletter-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .newsletter-input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(255, 255, 255, 0.3);
                }

                .newsletter-button {
                    padding: var(--spacing-sm) var(--spacing-lg);
                    background: var(--color-primary);
                    border: none;
                    border-radius: var(--border-radius-md);
                    color: var(--color-white);
                    font-weight: var(--font-weight-medium);
                    cursor: pointer;
                    transition: background var(--transition-fast);
                }

                .newsletter-button:hover {
                    background: var(--color-primary-dark);
                }

                .newsletter-button:disabled {
                    background: var(--color-secondary);
                    cursor: not-allowed;
                }

                .footer-bottom {
                    margin-top: var(--spacing-xxl);
                    padding-top: var(--spacing-lg);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.875rem;
                }

                .footer-bottom a {
                    color: var(--color-white);
                    text-decoration: none;
                }

                .footer-bottom a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 992px) {
                    .footer-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .footer-brand {
                        grid-column: 1 / -1;
                    }
                }

                @media (max-width: 576px) {
                    .footer-grid {
                        grid-template-columns: 1fr;
                        gap: var(--spacing-lg);
                    }

                    .newsletter-form {
                        flex-direction: column;
                    }

                    .newsletter-button {
                        width: 100%;
                    }

                    .footer-bottom {
                        flex-direction: column;
                        text-align: center;
                        gap: var(--spacing-md);
                    }
                }
            </style>
        `;

        const template = `
            <footer>
                <div class="container">
                    <div class="footer-grid">
                        <div class="footer-brand">
                            <a href="/" class="footer-logo">
                                <img src="/assets/SafePin Logo Green.svg" alt="SafePin Logo">
                                SafePin
                            </a>
                            <p class="footer-description">
                                Creating safer communities through anonymous incident reporting and real-time safety alerts.
                            </p>
                            <div class="footer-social">
                                <a href="https://facebook.com/safepin" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"/>
                                    </svg>
                                </a>
                                <a href="https://twitter.com/safepin" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                                    </svg>
                                </a>
                                <a href="https://instagram.com/safepin" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/>
                                    </svg>
                                </a>
                                <a href="https://linkedin.com/company/safepin" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                        <circle cx="4" cy="4" r="2"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <nav class="footer-nav">
                            <h3>Company</h3>
                            <ul>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/careers">Careers</a></li>
                                <li><a href="/press">Press</a></li>
                                <li><a href="/blog">Blog</a></li>
                            </ul>
                        </nav>
                        <nav class="footer-nav">
                            <h3>Support</h3>
                            <ul>
                                <li><a href="/help">Help Center</a></li>
                                <li><a href="/safety">Safety Center</a></li>
                                <li><a href="/community">Community Guidelines</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                            </ul>
                        </nav>
                        <div class="newsletter">
                            <h3>Stay Updated</h3>
                            <p>Subscribe to our newsletter for safety tips and community updates.</p>
                            <form class="newsletter-form" id="newsletterForm">
                                <input type="email" class="newsletter-input" placeholder="Enter your email" required>
                                <button type="submit" class="newsletter-button">Subscribe</button>
                            </form>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <p>&copy; ${new Date().getFullYear()} SafePin. All rights reserved.</p>
                        <div>
                            <a href="/privacy">Privacy Policy</a>
                            <span style="margin: 0 8px;">•</span>
                            <a href="/terms">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        this.shadowRoot.innerHTML = styles + template;
    }

    setupEventListeners() {
        const form = this.shadowRoot.querySelector('#newsletterForm');
        const input = form?.querySelector('input[type="email"]');
        const button = form?.querySelector('button');

        if (form && input && button) {
            let isSubmitting = false;

            input.addEventListener('input', () => {
                button.disabled = !isValidEmail(input.value);
            });

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (isSubmitting) return;

                const email = input.value;
                if (!isValidEmail(email)) {
                    this.showToast('Please enter a valid email address', 'error');
                    return;
                }

                isSubmitting = true;
                button.disabled = true;
                button.textContent = 'Subscribing...';

                try {
                    // Here you would typically make an API call to your backend
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
                    
                    input.value = '';
                    this.showToast('Thanks for subscribing!', 'success');
                } catch (error) {
                    console.error('Newsletter subscription error:', error);
                    this.showToast('Failed to subscribe. Please try again later.', 'error');
                } finally {
                    isSubmitting = false;
                    button.disabled = false;
                    button.textContent = 'Subscribe';
                }
            });
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
            color: white;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

customElements.define('app-footer', Footer); 