/**
 * User onboarding component for SafePin
 */
export class Onboarding {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: 'Welcome to SafePin',
                content: 'Let\'s get you started with your new authority account.',
                action: 'Next'
            },
            {
                title: 'Your Dashboard',
                content: 'This is your command center. Here you\'ll find recent reports, statistics, and important notifications.',
                action: 'Next'
            },
            {
                title: 'Managing Reports',
                content: 'You\'ll review and verify incident reports here. Each report needs careful verification before being published.',
                action: 'Next'
            },
            {
                title: 'Interactive Map',
                content: 'Use the map view to see incident locations and identify patterns in your jurisdiction.',
                action: 'Next'
            },
            {
                title: 'Your Profile',
                content: 'Keep your contact information up to date and manage your notification preferences.',
                action: 'Finish'
            }
        ];
    }

    /**
     * Start the onboarding process
     */
    start() {
        // Create onboarding container if not exists
        if (!document.getElementById('onboarding-container')) {
            const container = document.createElement('div');
            container.id = 'onboarding-container';
            document.body.appendChild(container);
        }

        this.render();
        this.addStyles();
    }

    /**
     * Render the current onboarding step
     */
    render() {
        const container = document.getElementById('onboarding-container');
        const step = this.steps[this.currentStep];

        container.innerHTML = `
            <div class="onboarding-overlay">
                <div class="onboarding-modal">
                    <div class="onboarding-progress">
                        ${this.steps.map((_, index) => `
                            <div class="progress-dot${index === this.currentStep ? ' active' : ''}"></div>
                        `).join('')}
                    </div>
                    
                    <h2>${step.title}</h2>
                    <p>${step.content}</p>
                    
                    <div class="onboarding-actions">
                        ${this.currentStep > 0 ? 
                            `<button class="btn-secondary" onclick="window.handlePrevStep()">Back</button>` : 
                            ''
                        }
                        <button class="btn-primary" onclick="window.handleNextStep()">${step.action}</button>
                    </div>
                </div>
            </div>
        `;

        // Add handlers to window object
        window.handleNextStep = () => this.nextStep();
        window.handlePrevStep = () => this.prevStep();
    }

    /**
     * Add onboarding styles
     */
    addStyles() {
        if (!document.getElementById('onboarding-styles')) {
            const styles = document.createElement('style');
            styles.id = 'onboarding-styles';
            styles.textContent = `
                .onboarding-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.75);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .onboarding-modal {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .onboarding-progress {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .progress-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #e2e8f0;
                    transition: all 0.3s ease;
                }

                .progress-dot.active {
                    background: var(--color-primary);
                    transform: scale(1.2);
                }

                .onboarding-modal h2 {
                    color: var(--color-text-primary);
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }

                .onboarding-modal p {
                    color: var(--color-text-secondary);
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .onboarding-actions {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }

                .btn-primary, .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    border-radius: 4px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: var(--color-primary);
                    color: white;
                    border: none;
                }

                .btn-primary:hover {
                    background: var(--color-primary-dark);
                }

                .btn-secondary {
                    background: transparent;
                    color: var(--color-text-secondary);
                    border: 1px solid #e2e8f0;
                }

                .btn-secondary:hover {
                    background: #f8f9fa;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .onboarding-modal {
                    animation: slideIn 0.3s ease-out;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    /**
     * Handle next step
     */
    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.render();
        } else {
            this.complete();
        }
    }

    /**
     * Handle previous step
     */
    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    /**
     * Complete onboarding
     */
    complete() {
        const container = document.getElementById('onboarding-container');
        if (container) {
            container.remove();
        }

        // Store completion in localStorage
        localStorage.setItem('onboardingCompleted', 'true');

        // Show completion message
        const message = document.createElement('div');
        message.className = 'onboarding-complete';
        message.innerHTML = `
            <div class="complete-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <h3>You're all set!</h3>
                <p>You can now start using SafePin to its full potential.</p>
            </div>
        `;
        document.body.appendChild(message);

        // Remove completion message after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
} 