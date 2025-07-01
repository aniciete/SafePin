import { formatNumber } from '../utils/helpers.js';

/**
 * Statistics Component
 * A reusable component for displaying animated statistics
 */
class Statistics extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.stats = {
            reports: 0,
            users: 0,
            incidents: 0,
            authorities: 0
        };
        this.targetStats = {
            reports: 1738,
            users: 47,
            incidents: 279,
            authorities: 9
        };
    }

    connectedCallback() {
        this.render();
        this.setupIntersectionObserver();
    }

    /**
     * Render the statistics component
     */
    render() {
        const styles = `
            <style>
                :host {
                    display: block;
                    background: var(--color-white);
                    padding: var(--spacing-xxl) 0;
                }

                .container {
                    max-width: var(--container-max-width);
                    margin: 0 auto;
                    padding: 0 var(--container-padding);
                }

                .title {
                    text-align: center;
                    margin-bottom: var(--spacing-xl);
                    font-size: 2rem;
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: var(--spacing-xl);
                }

                .stat-card {
                    text-align: center;
                    padding: var(--spacing-lg);
                    background: var(--color-white);
                    border-radius: var(--border-radius-lg);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform var(--transition-fast);
                }

                .stat-card:hover {
                    transform: translateY(-4px);
                }

                .stat-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 64px;
                    height: 64px;
                    margin-bottom: var(--spacing-md);
                    background: rgba(106, 176, 76, 0.1);
                    border-radius: 50%;
                    color: var(--color-primary);
                }

                .stat-number {
                    font-size: 2.5rem;
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text);
                    margin-bottom: var(--spacing-sm);
                    line-height: 1;
                }

                .stat-label {
                    font-size: 1rem;
                    color: var(--color-text-light);
                    margin: 0;
                }

                @media (max-width: 992px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 576px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .title {
                        font-size: 1.5rem;
                    }

                    .stat-number {
                        font-size: 2rem;
                    }
                }
            </style>
        `;

        const template = `
            <section>
                <div class="container">
                    <h2 class="title">SafePin Statistics</h2>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                            </div>
                            <div class="stat-number" id="reportsCount">0</div>
                            <p class="stat-label">Total Reports</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                            <div class="stat-number" id="usersCount">0</div>
                            <p class="stat-label">Active Users</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                            </div>
                            <div class="stat-number" id="incidentsCount">0</div>
                            <p class="stat-label">Total Incidents</p>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                                    <circle cx="8.5" cy="7" r="4"/>
                                    <line x1="20" y1="8" x2="20" y2="14"/>
                                    <line x1="23" y1="11" x2="17" y2="11"/>
                                </svg>
                            </div>
                            <div class="stat-number" id="authoritiesCount">0</div>
                            <p class="stat-label">Participating Authorities</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.shadowRoot.innerHTML = styles + template;
    }

    /**
     * Set up intersection observer for animation triggers
     */
    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.animateNumbers();
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        observer.observe(this.shadowRoot.querySelector('section'));
    }

    animateNumbers() {
        const duration = 2000; // Animation duration in milliseconds
        const fps = 60; // Frames per second
        const frames = duration / (1000 / fps);
        let frame = 0;

        const elements = {
            reports: this.shadowRoot.querySelector('#reportsCount'),
            users: this.shadowRoot.querySelector('#usersCount'),
            incidents: this.shadowRoot.querySelector('#incidentsCount'),
            authorities: this.shadowRoot.querySelector('#authoritiesCount')
        };

        const animate = () => {
            const progress = frame / frames;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Easing function

            Object.keys(this.targetStats).forEach((key) => {
                const target = this.targetStats[key];
                const current = Math.round(target * easeOutQuart);
                if (elements[key]) {
                    elements[key].textContent = formatNumber(current);
                }
            });

            frame++;

            if (frame <= frames) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Update statistics with new values
     * @param {Object} newStats - Object containing new statistics values
     */
    updateStats(newStats) {
        this.targetStats = { ...this.targetStats, ...newStats };
        this.animateNumbers();
    }
}

customElements.define('app-statistics', Statistics);

// CSS styles for the statistics component
const style = document.createElement('style');
style.textContent = `
    .stats-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-lg);
        padding: var(--spacing-xl) 0;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: var(--spacing-lg);
        background: var(--color-white);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        opacity: 0;
        transform: translateY(20px);
    }

    .stat-item.animate {
        animation: fadeInUp 0.6s ease forwards;
    }

    .stat-icon {
        font-size: 2em;
        margin-bottom: var(--spacing-sm);
    }

    .number {
        font-size: 2.5em;
        font-weight: var(--font-weight-bold);
        color: var(--color-primary);
        margin-bottom: var(--spacing-xs);
        line-height: 1;
    }

    .label {
        color: var(--color-text-light);
        font-size: 0.9em;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 768px) {
        .stats-container {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
        }

        .number {
            font-size: 2em;
        }
    }

    @media (max-width: 480px) {
        .stats-container {
            grid-template-columns: 1fr;
        }

        .stat-item {
            padding: var(--spacing-md);
        }
    }
`;

document.head.appendChild(style); 