/**
 * Help section component for SafePin
 * Enhanced with accessibility features
 */
export class Help {
    constructor(containerId, userRole = 'authority') {
        this.container = document.getElementById(containerId);
        this.userRole = userRole;
        this.expandedSection = null;
        
        if (!this.container) {
            throw new Error(`Container with id "${containerId}" not found`);
        }
    }

    /**
     * Render the help section
     */
    render() {
        const content = this.userRole === 'admin' ? this.getAdminContent() : this.getAuthorityContent();
        this.container.innerHTML = content;
        this.addStyles();
        this.setupAccessibility();
    }

    /**
     * Setup accessibility features
     * @private
     */
    setupAccessibility() {
        // Add ARIA landmark
        this.container.setAttribute('role', 'complementary');
        this.container.setAttribute('aria-label', `Help and support for ${this.userRole} users`);

        // Make sections expandable
        const sections = this.container.querySelectorAll('.help-item');
        sections.forEach((section, index) => {
            const heading = section.querySelector('h2');
            const content = section.querySelector('.help-content');
            const id = `help-section-${index}`;
            
            // Setup ARIA attributes
            heading.setAttribute('id', `${id}-heading`);
            content.setAttribute('id', id);
            content.setAttribute('role', 'region');
            content.setAttribute('aria-labelledby', `${id}-heading`);
            
            // Make heading clickable
            heading.setAttribute('role', 'button');
            heading.setAttribute('tabindex', '0');
            heading.setAttribute('aria-expanded', 'false');
            heading.setAttribute('aria-controls', id);
            
            // Add keyboard support
            heading.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleSection(id);
                }
            });
            
            // Add click support
            heading.addEventListener('click', () => {
                this.toggleSection(id);
            });
            
            // Initially collapse section
            content.classList.add('collapsed');
        });

        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip help section';
        this.container.insertBefore(skipLink, this.container.firstChild);
    }

    /**
     * Toggle section visibility
     * @private
     */
    toggleSection(sectionId) {
        const heading = document.querySelector(`[aria-controls="${sectionId}"]`);
        const content = document.getElementById(sectionId);
        const isExpanded = heading.getAttribute('aria-expanded') === 'true';

        // Close previously expanded section
        if (this.expandedSection && this.expandedSection !== sectionId) {
            const prevHeading = document.querySelector(`[aria-controls="${this.expandedSection}"]`);
            const prevContent = document.getElementById(this.expandedSection);
            prevHeading.setAttribute('aria-expanded', 'false');
            prevContent.classList.add('collapsed');
        }

        // Toggle current section
        heading.setAttribute('aria-expanded', (!isExpanded).toString());
        content.classList.toggle('collapsed');
        
        // Update expanded section reference
        this.expandedSection = !isExpanded ? sectionId : null;

        // Ensure content is visible when expanded
        if (!isExpanded) {
            content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    /**
     * Get content for authority users
     * @private
     */
    getAuthorityContent() {
        return `
            <div class="help-section">
                <h1>Help & Support - Authority Dashboard</h1>
                
                <div class="help-item">
                    <h2>Managing Reports</h2>
                    <div class="help-content">
                        <p>As an authority user, you can view and manage reports submitted by residents in your jurisdiction. Note that you cannot create reports yourself - reports can only be submitted by residents through the public reporting system.</p>
                        <ul>
                            <li>View reports in your jurisdiction</li>
                            <li>Verify and update report statuses</li>
                            <li>Add official notes to reports</li>
                            <li>Track report progress</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>Report Statuses</h2>
                    <div class="help-content">
                        <p>Reports can have the following statuses:</p>
                        <ul role="list">
                            <li><span class="status-indicator pending">Pending Verification:</span> New reports that need review</li>
                            <li><span class="status-indicator verified">Verified:</span> Reports confirmed as valid</li>
                            <li><span class="status-indicator resolved">Resolved:</span> Incidents that have been addressed</li>
                            <li><span class="status-indicator rejected">Rejected:</span> Reports marked as invalid or duplicate</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>Map View</h2>
                    <div class="help-content">
                        <p>Use the map view to:</p>
                        <ul>
                            <li>See incident locations in your jurisdiction</li>
                            <li>Track incident patterns and hotspots</li>
                            <li>Plan response strategies</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>Need More Help?</h2>
                    <div class="help-content">
                        <p>Contact your system administrator or refer to the complete documentation for detailed guidance.</p>
                        <div class="contact-support">
                            <button class="support-button" aria-label="Contact support team">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get content for admin users
     * @private
     */
    getAdminContent() {
        return `
            <div class="help-section">
                <h1>Help & Support - Admin Dashboard</h1>

                <div class="help-item">
                    <h2>Managing Reports</h2>
                    <div class="help-content">
                        <p>As an admin, you have oversight of all reports in the system. Note that you cannot create reports yourself - reports can only be submitted by residents through the public reporting system.</p>
                        <ul>
                            <li>View all reports across jurisdictions</li>
                            <li>Monitor report verification and resolution</li>
                            <li>Track authority responses</li>
                            <li>Generate reports and analytics</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>User Management</h2>
                    <div class="help-content">
                        <p>Manage authority users and their access levels:</p>
                        <ul>
                            <li>Create and manage authority accounts</li>
                            <li>Set jurisdiction assignments</li>
                            <li>Configure access permissions</li>
                            <li>Monitor user activity</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>System Settings</h2>
                    <div class="help-content">
                        <p>Configure system-wide settings:</p>
                        <ul>
                            <li>Manage jurisdiction boundaries</li>
                            <li>Configure notification rules</li>
                            <li>Set up automated responses</li>
                            <li>Customize report categories</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>Analytics & Reporting</h2>
                    <div class="help-content">
                        <p>Access advanced analytics tools:</p>
                        <ul>
                            <li>Generate incident trend reports</li>
                            <li>Track response times</li>
                            <li>Monitor system performance</li>
                            <li>Export data for analysis</li>
                        </ul>
                    </div>
                </div>

                <div class="help-item">
                    <h2>Need Technical Support?</h2>
                    <div class="help-content">
                        <p>Contact the system support team or refer to the technical documentation for advanced configuration options.</p>
                        <div class="contact-support">
                            <button class="support-button" aria-label="Contact technical support">
                                Contact Technical Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Add styles for the help section
     * @private
     */
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .help-section {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
            }

            .help-section h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 24px;
                color: #1a1a1a;
            }

            .help-item {
                margin-bottom: 16px;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .help-item h2 {
                font-size: 18px;
                font-weight: 600;
                margin: 0;
                padding: 16px 20px;
                color: #2c5282;
                background: #f7fafc;
                cursor: pointer;
                display: flex;
                align-items: center;
                transition: background-color 0.2s;
            }

            .help-item h2:hover,
            .help-item h2:focus {
                background: #edf2f7;
                outline: none;
            }

            .help-item h2:focus-visible {
                outline: 2px solid #4299e1;
                outline-offset: -2px;
            }

            .help-item h2::after {
                content: '';
                width: 20px;
                height: 20px;
                margin-left: auto;
                background: url('data:image/svg+xml;utf8,<svg fill="%232c5282" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L10 10L14 6" stroke="%232c5282" stroke-width="2" stroke-linecap="round"/></svg>') no-repeat center;
                transition: transform 0.2s;
            }

            .help-item h2[aria-expanded="true"]::after {
                transform: rotate(180deg);
            }

            .help-content {
                padding: 20px;
                background: #ffffff;
                transition: max-height 0.3s ease-out;
            }

            .help-content.collapsed {
                max-height: 0;
                padding: 0 20px;
                overflow: hidden;
            }

            .help-content p {
                margin-bottom: 16px;
                line-height: 1.6;
                color: #4a5568;
            }

            .help-content ul {
                list-style-type: disc;
                margin-left: 20px;
                margin-bottom: 16px;
            }

            .help-content li {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #4a5568;
            }

            .status-indicator {
                font-weight: 600;
                padding: 2px 8px;
                border-radius: 4px;
                margin-right: 8px;
            }

            .status-indicator.pending { background: #fef3c7; color: #92400e; }
            .status-indicator.verified { background: #dcfce7; color: #166534; }
            .status-indicator.resolved { background: #dbeafe; color: #1e40af; }
            .status-indicator.rejected { background: #fee2e2; color: #991b1b; }

            .skip-link {
                position: absolute;
                top: -40px;
                left: 0;
                padding: 8px;
                background: #4299e1;
                color: white;
                transition: top 0.2s;
            }

            .skip-link:focus {
                top: 0;
                z-index: 100;
            }

            .contact-support {
                margin-top: 20px;
            }

            .support-button {
                background: #4299e1;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
                transition: background-color 0.2s;
            }

            .support-button:hover,
            .support-button:focus {
                background: #3182ce;
                outline: none;
            }

            .support-button:focus-visible {
                outline: 2px solid #4299e1;
                outline-offset: 2px;
            }

            @media (prefers-reduced-motion: reduce) {
                .help-content,
                .skip-link,
                .help-item h2::after {
                    transition: none;
                }
            }

            @media screen and (max-width: 640px) {
                .help-section {
                    padding: 16px;
                }

                .help-item h2 {
                    font-size: 16px;
                    padding: 12px 16px;
                }

                .help-content {
                    padding: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    }
} 