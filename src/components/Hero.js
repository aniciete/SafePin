/**
 * Hero Component
 * A reusable hero section component with animations
 */
export class Hero extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupParallax();
    }

    render() {
        const styles = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    height: 100vh;
                    min-height: 600px;
                    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
                    overflow: hidden;
                }

                .parallax-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .parallax-layer {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    will-change: transform;
                }

                .layer-1 {
                    background: url('/assets/Shield Image.svg') no-repeat center;
                    background-size: contain;
                    opacity: 0.1;
                    transform: translateZ(-1px) scale(2);
                }

                .layer-2 {
                    background: url('/assets/Shield Alt Image.svg') no-repeat center;
                    background-size: contain;
                    opacity: 0.05;
                    transform: translateZ(-2px) scale(3);
                }

                .container {
                    position: relative;
                    max-width: var(--container-max-width);
                    margin: 0 auto;
                    padding: 0 var(--container-padding);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    color: var(--color-white);
                    z-index: 1;
                }

                .hero-content {
                    max-width: 800px;
                    animation: fadeInUp 1s ease-out;
                }

                .hero-logo {
                    width: 120px;
                    height: 120px;
                    margin-bottom: var(--spacing-lg);
                    animation: float 6s ease-in-out infinite;
                }

                .hero-title {
                    font-size: 3.5rem;
                    font-weight: var(--font-weight-bold);
                    line-height: 1.2;
                    margin: 0 0 var(--spacing-md);
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .hero-description {
                    font-size: 1.25rem;
                    line-height: 1.6;
                    margin: 0 0 var(--spacing-xl);
                    opacity: 0.9;
                }

                .hero-buttons {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                }

                .hero-button {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-md) var(--spacing-xl);
                    border-radius: var(--border-radius-md);
                    font-size: 1.125rem;
                    font-weight: var(--font-weight-medium);
                    text-decoration: none;
                    transition: all var(--transition-fast);
                }

                .hero-button.primary {
                    background: var(--color-white);
                    color: var(--color-primary);
                }

                .hero-button.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .hero-button.secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--color-white);
                    backdrop-filter: blur(4px);
                }

                .hero-button.secondary:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .scroll-indicator {
                    position: absolute;
                    bottom: var(--spacing-xl);
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-sm);
                    color: var(--color-white);
                    text-decoration: none;
                    opacity: 0.7;
                    transition: opacity var(--transition-fast);
                    animation: bounce 2s infinite;
                }

                .scroll-indicator:hover {
                    opacity: 1;
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

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateX(-50%) translateY(0);
                    }
                    40% {
                        transform: translateX(-50%) translateY(-10px);
                    }
                    60% {
                        transform: translateX(-50%) translateY(-5px);
                    }
                }

                @media (max-width: 992px) {
                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .hero-description {
                        font-size: 1.125rem;
                    }
                }

                @media (max-width: 576px) {
                    :host {
                        min-height: 500px;
                    }

                    .hero-logo {
                        width: 80px;
                        height: 80px;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }

                    .hero-description {
                        font-size: 1rem;
                    }

                    .hero-buttons {
                        flex-direction: column;
                        width: 100%;
                    }

                    .hero-button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            </style>
        `;

        const template = `
            <div class="parallax-container">
                <div class="parallax-layer layer-1"></div>
                <div class="parallax-layer layer-2"></div>
            </div>
            <div class="container">
                <div class="hero-content">
                    <img src="/assets/SafePin Map Logo.png" alt="SafePin Logo" class="hero-logo">
                    <h1 class="hero-title">Creating Safer Communities Together</h1>
                    <p class="hero-description">
                        Join SafePin in building a safer community through anonymous incident reporting and real-time safety alerts. Your voice matters in making our neighborhoods more secure.
                    </p>
                    <div class="hero-buttons">
                        <a href="/report" class="hero-button primary">
                            Report Incident
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                                <polyline points="10 17 15 12 10 7"/>
                                <line x1="15" y1="12" x2="3" y2="12"/>
                            </svg>
                        </a>
                        <a href="/verification" class="hero-button secondary">
                            Check Report Status
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                        </a>
                    </div>
                </div>
                <a href="#features" class="scroll-indicator">
                    <span>Scroll to learn more</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M7 13l5 5 5-5"/>
                        <path d="M7 6l5 5 5-5"/>
                    </svg>
                </a>
            </div>
        `;

        this.shadowRoot.innerHTML = styles + template;
    }

    setupParallax() {
        let ticking = false;
        const layers = this.shadowRoot.querySelectorAll('.parallax-layer');

        const updateParallax = (scrollPos) => {
            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.5;
                const yPos = -(scrollPos * speed);
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateParallax(window.scrollY);
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Smooth scroll for the scroll indicator
        const scrollIndicator = this.shadowRoot.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = scrollIndicator.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }
}

customElements.define('app-hero', Hero);

// CSS styles for the hero component
const style = document.createElement('style');
style.textContent = `
    .hero {
        position: relative;
        padding: var(--spacing-xxl) 0;
        background: linear-gradient(135deg, var(--color-white) 0%, var(--color-background) 100%);
        overflow: hidden;
    }

    .hero-content {
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 var(--spacing-md);
    }

    .hero-map-icon {
        margin-bottom: var(--spacing-lg);
    }

    .hero-map-icon img {
        border-radius: 20%;
        box-shadow: var(--shadow-lg);
    }

    .hero-title {
        font-size: 3.5em;
        line-height: 1.2;
        margin-bottom: var(--spacing-md);
        color: var(--color-text);
    }

    .hero-description {
        font-size: 1.25em;
        line-height: 1.6;
        color: var(--color-text-light);
        margin-bottom: var(--spacing-xl);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .hero-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        margin-top: var(--spacing-xl);
    }

    .btn-lg {
        padding: var(--spacing-md) var(--spacing-xl);
        font-size: 1.1em;
    }

    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 0;
    }

    .hero-shape {
        position: absolute;
        top: -50%;
        right: -20%;
        width: 80%;
        height: 200%;
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
        opacity: 0.05;
        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        transform: rotate(-15deg);
        animation: morphShape 20s linear infinite alternate;
    }

    .hero-dots {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: radial-gradient(var(--color-text) 1px, transparent 1px);
        background-size: 50px 50px;
        opacity: 0.05;
    }

    /* Animations */
    @keyframes morphShape {
        0% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
        50% {
            border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
        }
        100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes slide-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Responsive styles */
    @media (max-width: 992px) {
        .hero-title {
            font-size: 3em;
        }

        .hero-description {
            font-size: 1.1em;
        }
    }

    @media (max-width: 768px) {
        .hero {
            padding: var(--spacing-xl) 0;
        }

        .hero-title {
            font-size: 2.5em;
        }

        .hero-map-icon img {
            width: 140px;
            height: 140px;
        }

        .hero-actions {
            flex-direction: column;
            gap: var(--spacing-sm);
        }

        .btn-lg {
            width: 100%;
        }
    }

    @media (max-width: 480px) {
        .hero-title {
            font-size: 2em;
        }

        .hero-description {
            font-size: 1em;
        }

        .hero-map-icon img {
            width: 120px;
            height: 120px;
        }
    }
`;

document.head.appendChild(style); 