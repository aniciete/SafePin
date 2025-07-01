/**
 * AlertCard Component
 * A reusable component for displaying alert information
 */
import { formatDate, copyToClipboard } from '../utils/helpers.js';

class AlertCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'description', 'image', 'date', 'location', 'type', 'status'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }

    /**
     * Create and return the alert card element
     * @returns {HTMLElement} The alert card element
     */
    render() {
        const styles = `
            <style>
                :host {
                    display: block;
                    background: var(--color-white);
                    border-radius: var(--border-radius-lg);
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    transition: transform var(--transition-fast);
                }

                :host(:hover) {
                    transform: translateY(-2px);
                }

                .image-container {
                    position: relative;
                    padding-top: 56.25%; /* 16:9 aspect ratio */
                    overflow: hidden;
                }

                .image-container img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .content {
                    padding: var(--spacing-lg);
                }

                .alert-type {
                    display: inline-block;
                    padding: var(--spacing-xs) var(--spacing-sm);
                    background: rgba(106, 176, 76, 0.1);
                    color: var(--color-primary);
                    border-radius: var(--border-radius-sm);
                    font-size: 0.875rem;
                    font-weight: var(--font-weight-medium);
                    margin-bottom: var(--spacing-sm);
                }

                .title {
                    margin: 0 0 var(--spacing-sm);
                    font-size: 1.25rem;
                    font-weight: var(--font-weight-bold);
                    color: var(--color-text);
                    line-height: 1.4;
                }

                .meta {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-sm);
                    font-size: 0.875rem;
                    color: var(--color-text-light);
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                }

                .description {
                    margin: 0 0 var(--spacing-lg);
                    color: var(--color-text);
                    line-height: 1.6;
                }

                .actions {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }

                .share-button {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    padding: var(--spacing-sm) var(--spacing-md);
                    background: transparent;
                    border: 1px solid var(--color-border);
                    border-radius: var(--border-radius-md);
                    color: var(--color-text);
                    font-weight: var(--font-weight-medium);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }

                .share-button:hover {
                    background: var(--color-background);
                    border-color: var(--color-text);
                }

                .status {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-xs);
                    font-size: 0.875rem;
                    font-weight: var(--font-weight-medium);
                }

                .status[data-status="resolved"] {
                    color: var(--color-primary);
                }

                .status[data-status="pending"] {
                    color: #f1c40f;
                }

                .status[data-status="investigating"] {
                    color: #e67e22;
                }

                @media (max-width: 768px) {
                    .content {
                        padding: var(--spacing-md);
                    }

                    .title {
                        font-size: 1.125rem;
                    }

                    .meta {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: var(--spacing-xs);
                    }
                }
            </style>
        `;

        const template = `
            <article>
                <div class="image-container">
                    <img src="${this.getAttribute('image')}" alt="${this.getAttribute('title')}">
                </div>
                <div class="content">
                    <span class="alert-type">${this.getAttribute('type') || 'Alert'}</span>
                    <h2 class="title">${this.getAttribute('title')}</h2>
                    <div class="meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M8 4.5V8H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            ${formatDate(this.getAttribute('date'))}
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 14L3 9.5V4.5L8 2L13 4.5V9.5L8 14Z" stroke="currentColor" stroke-width="1.5"/>
                                <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            ${this.getAttribute('location')}
                        </span>
                        <span class="status" data-status="${this.getAttribute('status')}">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M5 8L7 10L11 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            ${this.getAttribute('status')}
                        </span>
                    </div>
                    <p class="description">${this.getAttribute('description')}</p>
                    <div class="actions">
                        <button class="share-button" id="shareButton">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M4 10V12C4 13.1046 4.89543 14 6 14H10C11.1046 14 12 13.1046 12 12V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M8 2V10M8 2L5 5M8 2L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Share
                        </button>
                        <a href="#" class="share-button">Read More →</a>
                    </div>
                </div>
            </article>
        `;

        this.shadowRoot.innerHTML = styles + template;
    }

    /**
     * Attach event listeners to the alert card
     */
    setupEventListeners() {
        const shareButton = this.shadowRoot.querySelector('#shareButton');
        if (shareButton) {
            shareButton.addEventListener('click', this.handleShare.bind(this));
        }
    }

    /**
     * Handle sharing functionality
     */
    async handleShare() {
        const alertData = {
            title: this.getAttribute('title'),
            description: this.getAttribute('description'),
            location: this.getAttribute('location'),
            date: this.getAttribute('date'),
            url: window.location.href
        };

        const shareText = `
            ${alertData.title}
            
            📍 ${alertData.location}
            🕒 ${formatDate(alertData.date)}
            
            ${alertData.description}
            
            Learn more: ${alertData.url}
        `.trim();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: alertData.title,
                    text: alertData.description,
                    url: alertData.url
                });
            } catch (err) {
                console.error('Error sharing:', err);
                await copyToClipboard(shareText);
                this.showToast('Copied to clipboard!');
            }
        } else {
            await copyToClipboard(shareText);
            this.showToast('Copied to clipboard!');
        }
    }

    /**
     * Show a toast message
     * @param {string} message - The message to display
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-text);
            color: var(--color-white);
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

customElements.define('alert-card', AlertCard);

// CSS styles for the alert card component
const style = document.createElement('style');
style.textContent = `
    .alert-card {
        background: var(--color-white);
        border-radius: var(--border-radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }

    .alert-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
    }

    .alert-card-image {
        position: relative;
        overflow: hidden;
    }

    .alert-category {
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        background: rgba(0, 0, 0, 0.7);
        color: var(--color-white);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius-sm);
        font-size: 0.8em;
    }

    .alert-content {
        padding: var(--spacing-md);
    }

    .alert-title {
        margin-bottom: var(--spacing-sm);
        font-size: 1.2em;
        line-height: 1.3;
    }

    .alert-timestamp {
        display: block;
        color: var(--color-text-light);
        font-size: 0.9em;
        margin-bottom: var(--spacing-sm);
    }

    .alert-description {
        color: var(--color-text-light);
        margin-bottom: var(--spacing-md);
        line-height: 1.5;
    }

    .alert-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .read-more {
        color: var(--color-primary);
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        transition: color var(--transition-fast);
    }

    .read-more:hover {
        color: var(--color-primary-dark);
    }

    .share-btn {
        background: none;
        border: none;
        padding: var(--spacing-xs);
        cursor: pointer;
        color: var(--color-text-light);
        transition: color var(--transition-fast);
    }

    .share-btn:hover {
        color: var(--color-primary);
    }

    .toast {
        position: fixed;
        bottom: var(--spacing-xl);
        left: 50%;
        transform: translateX(-50%) translateY(100%);
        background: rgba(0, 0, 0, 0.8);
        color: var(--color-white);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-sm);
        opacity: 0;
        transition: transform var(--transition-fast), opacity var(--transition-fast);
    }

    .toast.show {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }

    @media (max-width: 768px) {
        .alert-card {
            margin-bottom: var(--spacing-md);
        }

        .alert-title {
            font-size: 1.1em;
        }
    }
`;

document.head.appendChild(style); 