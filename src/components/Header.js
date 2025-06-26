/**
 * Header Component
 * A reusable header component that includes navigation and authority access
 */
import { storage } from '../utils/helpers.js';

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  /**
   * Initialize the header component
   * @returns {HTMLElement} The header element
   */
  init() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = this.render();
    
    this.attachEventListeners(header);
    return header;
  }

  /**
   * Render the header HTML
   * @returns {string} The header HTML
   */
  render() {
    const currentPath = window.location.pathname;
    const styles = `
      <style>
        :host {
          display: block;
          background: var(--color-white);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: var(--z-index-header);
        }

        .container {
          max-width: var(--container-max-width);
          margin: 0 auto;
          padding: var(--spacing-md) var(--container-padding);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          color: var(--color-primary);
          font-weight: var(--font-weight-bold);
          font-size: 1.8rem;
        }

        .logo img {
          height: 30px;
        }

        nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .nav-links {
          display: flex;
          gap: var(--spacing-md);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: var(--color-text-light);
          text-decoration: none;
          font-weight: var(--font-weight-medium);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          transition: all var(--transition-fast);
        }

        .nav-links a:hover,
        .nav-links a.active {
          color: var(--color-primary);
          background: rgba(106, 176, 76, 0.1);
        }

        .auth-button {
          background: var(--color-primary);
          color: var(--color-white);
          border: none;
          padding: var(--spacing-sm) var(--spacing-lg);
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .auth-button:hover {
          background: var(--color-primary-dark);
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
        }

        @media (max-width: 768px) {
          .mobile-menu-button {
            display: block;
          }

          nav {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background: var(--color-white);
            padding: var(--spacing-md);
            flex-direction: column;
            align-items: stretch;
            transform: translateY(-100%);
            transition: transform var(--transition-normal);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          nav.active {
            transform: translateY(0);
          }

          .nav-links {
            flex-direction: column;
          }

          .nav-links a {
            padding: var(--spacing-sm) 0;
          }

          .auth-button {
            margin-top: var(--spacing-md);
            text-align: center;
          }
        }
      </style>
    `;

    const template = `
      <header>
        <div class="container">
          <a href="/" class="logo">
            <img src="/assets/SafePin Logo Green.svg" alt="SafePin Logo">
            SafePin
          </a>
          <button class="mobile-menu-button" aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <nav>
            <ul class="nav-links">
              <li><a href="/" class="${currentPath === '/' ? 'active' : ''}">Home</a></li>
              <li><a href="/features" class="${currentPath === '/features' ? 'active' : ''}">Features</a></li>
              <li><a href="/about" class="${currentPath === '/about' ? 'active' : ''}">About Us</a></li>
              <li><a href="/faq" class="${currentPath === '/faq' ? 'active' : ''}">FAQ</a></li>
            </ul>
            <button class="auth-button" id="authButton">Authority Access</button>
          </nav>
        </div>
      </header>
    `;

    this.shadowRoot.innerHTML = styles + template;
  }

  /**
   * Attach event listeners to header elements
   * @param {HTMLElement} header - The header element
   */
  attachEventListeners(header) {
    // Mobile menu toggle
    const menuBtn = header.querySelector('.mobile-menu-button');
    const nav = header.querySelector('nav');
    
    if (menuBtn && nav) {
      menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }

    // Modal handling
    const authButton = header.querySelector('#authButton');
    
    if (authButton) {
      authButton.addEventListener('click', () => {
        this.showAuthModal();
      });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!header.contains(event.target) && nav?.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });
  }

  showAuthModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <style>
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: var(--z-index-modal);
        }

        .modal-content {
          background: var(--color-white);
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          max-width: 400px;
          width: 90%;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: var(--font-weight-bold);
          margin-bottom: var(--spacing-lg);
          text-align: center;
        }

        .modal-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .modal-button {
          padding: var(--spacing-md);
          border: none;
          border-radius: var(--border-radius-md);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .modal-button.primary {
          background: var(--color-primary);
          color: var(--color-white);
        }

        .modal-button.primary:hover {
          background: var(--color-primary-dark);
        }

        .modal-button.secondary {
          background: var(--color-secondary);
          color: var(--color-white);
        }

        .modal-button.secondary:hover {
          background: var(--color-secondary-dark);
        }

        .modal-button.cancel {
          background: transparent;
          color: var(--color-text);
          border: 1px solid var(--color-border);
        }

        .modal-button.cancel:hover {
          background: var(--color-background);
        }
      </style>
      <div class="modal-overlay">
        <div class="modal-content">
          <h2 class="modal-title">Choose Login Type</h2>
          <div class="modal-buttons">
            <button class="modal-button primary" data-type="admin">Admin Login</button>
            <button class="modal-button secondary" data-type="authority">Authority Login</button>
            <button class="modal-button cancel">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const handleClick = (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      if (button.dataset.type === 'admin') {
        window.location.href = '/admin';
      } else if (button.dataset.type === 'authority') {
        window.location.href = '/authority';
      }

      document.body.removeChild(modal);
    };

    modal.addEventListener('click', (event) => {
      if (event.target.classList.contains('modal-overlay') || 
          event.target.classList.contains('cancel')) {
        document.body.removeChild(modal);
      }
    });

    modal.querySelector('.modal-buttons').addEventListener('click', handleClick);
  }
}

customElements.define('app-header', Header);

// Export a function to create and mount the header
export const mountHeader = () => {
  const header = new Header();
  const headerElement = header.init();
  document.body.insertBefore(headerElement, document.body.firstChild);
}; 