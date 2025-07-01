import { mountHeader } from '../components/Header.js';
import { debounce, formatNumber, isInViewport } from '../utils/helpers.js';

// Constants
const API_ENDPOINTS = {
    ALERTS: '/api/alerts',
    STATS: '/api/stats',
    SUBSCRIBE: '/api/subscribe'
};

class SafePinApp {
    constructor() {
        this.stats = {
            reports: 1738,
            users: 47,
            incidents: 279,
            authorities: 9
        };
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        // Mount header component
        mountHeader();
        
        // Initialize features
        this.initializeAnimations();
        this.initializeNewsletterForm();
        this.initializeStatistics();
        this.loadRecentAlerts();
        
        // Add scroll event listener for animations
        window.addEventListener('scroll', debounce(() => {
            this.checkAndAnimateElements();
        }, 100));
    }

    /**
     * Initialize scroll-based animations
     */
    initializeAnimations() {
        const animatedElements = document.querySelectorAll('.step, .stat-item, .about-content');
        
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }

    /**
     * Check and animate elements as they come into view
     */
    checkAndAnimateElements() {
        const animatedElements = document.querySelectorAll('.step:not(.animate), .stat-item:not(.animate), .about-content:not(.animate)');
        
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('animate');
            }
        });
    }

    /**
     * Initialize statistics counter animations
     */
    initializeStatistics() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(item => {
            const numberElement = item.querySelector('.number');
            if (!numberElement) return;

            const finalNumber = parseInt(numberElement.textContent.replace(/,/g, ''), 10);
            let currentNumber = 0;
            const duration = 2000; // 2 seconds
            const steps = 60;
            const increment = finalNumber / steps;
            const stepDuration = duration / steps;

            const updateNumber = () => {
                if (currentNumber < finalNumber) {
                    currentNumber = Math.min(currentNumber + increment, finalNumber);
                    numberElement.textContent = formatNumber(Math.round(currentNumber));
                }
            };

            const interval = setInterval(updateNumber, stepDuration);
            setTimeout(() => clearInterval(interval), duration);
        });
    }

    /**
     * Load and display recent alerts
     */
    async loadRecentAlerts() {
        const alertsGrid = document.querySelector('.alerts-grid');
        if (!alertsGrid) return;

        try {
            // Simulated alerts data (replace with actual API call)
            const alerts = [
                {
                    image: 'https://od2-image-api.abs-cbn.com/prod/20250613130620/5babc293462ef2bee1831a07fa07bdd858c85184c1c0ac7dc139131757ecb32a.jpg',
                    title: '3 sugatan sa banggaan ng 2 motorsiklo sa QC',
                    description: 'Tatlo ang sugatan sa banggaan ng dalawang motorsiklo sa Quezon City...',
                    url: 'https://www.abs-cbn.com/news/nation/2025/6/13/tv-patrol-3-sugatan-sa-banggaan-ng-2-motorsiklo-sa-qc-2022'
                },
                {
                    image: 'https://od2-image-api.abs-cbn.com/prod/20250613010640/99bc67940a8ae9a983e6b9714c1696ea46279812c2485cb1a7b5d8a298a41a06.jpg',
                    title: 'Lalaking naaresto sa pagsusugal, nahulihan ng baril nang kapkapan ng pulis',
                    description: 'Arestado ang 25-anyos na lalaki matapos mahuling nagsusugal...',
                    url: 'https://www.abs-cbn.com/news/nation/2025/6/13/lalaking-naaresto-sa-pagsusugal-nahulihan-ng-baril-nang-kapkapan-ng-pulis-1252'
                },
                {
                    image: 'https://od2-image-api.abs-cbn.com/prod/20250611140636/65ca9f803a900067dbc9564bf0e0c4625e60ebe9ace494916cd8183f704b94ff.jpg',
                    title: 'Higit 1 toneladang shabu na nakuha sa dagat galing sa Sam Gor syndicate',
                    description: 'Ibinunyag ng Philippine Drug Enforcement Agency na konektado...',
                    url: 'https://www.abs-cbn.com/news/nation/2025/6/11/tv-patrol-higit-1-toneladang-shabu-na-nakuha-sa-dagat-galing-sa-sam-gor-syndicate-pdea-2139'
                }
            ];

            alertsGrid.innerHTML = alerts.map(alert => this.createAlertCard(alert)).join('');

            // Initialize lazy loading for alert images
            this.initializeLazyLoading();
        } catch (error) {
            console.error('Error loading recent alerts:', error);
            alertsGrid.innerHTML = '<p class="error-message">Failed to load recent alerts. Please try again later.</p>';
        }
    }

    /**
     * Create HTML for an alert card
     * @param {Object} alert - Alert data
     * @returns {string} HTML string for the alert card
     */
    createAlertCard(alert) {
        return `
            <article class="alert-card">
                <img src="${alert.image}" 
                     alt="Image related to: ${alert.title}"
                     width="100%" 
                     height="180"
                     loading="lazy"
                     style="object-fit: cover;">
                <div class="alert-content">
                    <h3>${alert.title}</h3>
                    <p>${alert.description}</p>
                    <a href="${alert.url}" 
                       class="read-more"
                       target="_blank"
                       rel="noopener noreferrer">Read More →</a>
                </div>
            </article>
        `;
    }

    /**
     * Initialize lazy loading for images
     */
    initializeLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }

        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Initialize newsletter form submission
     */
    initializeNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value;

            try {
                const response = await fetch(API_ENDPOINTS.SUBSCRIBE, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) throw new Error('Subscription failed');

                // Show success message
                emailInput.value = '';
                alert('Thank you for subscribing!');
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                alert('Failed to subscribe. Please try again later.');
            }
        });
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SafePinApp();
}); 