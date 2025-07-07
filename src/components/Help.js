/**
 * Help section component for SafePin
 */
export class Help {
    constructor(containerId, userRole = 'authority') {
        this.container = document.getElementById(containerId);
        this.userRole = userRole;
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
                    <p>As an authority user, you can view and manage reports submitted by residents in your jurisdiction. Note that you cannot create reports yourself - reports can only be submitted by residents through the public reporting system.</p>
                    <ul>
                        <li>View reports in your jurisdiction</li>
                        <li>Verify and update report statuses</li>
                        <li>Add official notes to reports</li>
                        <li>Track report progress</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>Report Statuses</h2>
                    <p>Reports can have the following statuses:</p>
                    <ul>
                        <li><strong>Pending Verification:</strong> New reports that need review</li>
                        <li><strong>Verified:</strong> Reports confirmed as valid</li>
                        <li><strong>Resolved:</strong> Incidents that have been addressed</li>
                        <li><strong>Rejected:</strong> Reports marked as invalid or duplicate</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>Map View</h2>
                    <p>Use the map view to:</p>
                    <ul>
                        <li>See incident locations in your jurisdiction</li>
                        <li>Track incident patterns and hotspots</li>
                        <li>Plan response strategies</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>Need More Help?</h2>
                    <p>Contact your system administrator or refer to the complete documentation for detailed guidance.</p>
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
                    <p>As an admin, you have oversight of all reports in the system. Note that you cannot create reports yourself - reports can only be submitted by residents through the public reporting system.</p>
                    <ul>
                        <li>View all reports across jurisdictions</li>
                        <li>Monitor report verification and resolution</li>
                        <li>Track authority responses</li>
                        <li>Generate reports and analytics</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>User Management</h2>
                    <p>Manage authority users and their access levels:</p>
                    <ul>
                        <li>Create and manage authority accounts</li>
                        <li>Set jurisdiction assignments</li>
                        <li>Configure access permissions</li>
                        <li>Monitor user activity</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>System Settings</h2>
                    <p>Configure system-wide settings:</p>
                    <ul>
                        <li>Manage jurisdiction boundaries</li>
                        <li>Configure notification rules</li>
                        <li>Set up automated responses</li>
                        <li>Customize report categories</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>Analytics & Reporting</h2>
                    <p>Access advanced analytics tools:</p>
                    <ul>
                        <li>Generate incident trend reports</li>
                        <li>Track response times</li>
                        <li>Monitor system performance</li>
                        <li>Export data for analysis</li>
                    </ul>
                </div>

                <div class="help-item">
                    <h2>Need Technical Support?</h2>
                    <p>Contact the system support team or refer to the technical documentation for advanced configuration options.</p>
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
                margin-bottom: 32px;
                padding: 20px;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .help-item h2 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 16px;
                color: #2c5282;
            }

            .help-item p {
                margin-bottom: 16px;
                line-height: 1.6;
                color: #4a5568;
            }

            .help-item ul {
                list-style-type: disc;
                margin-left: 20px;
                margin-bottom: 16px;
            }

            .help-item li {
                margin-bottom: 8px;
                line-height: 1.5;
                color: #4a5568;
            }

            .help-item strong {
                color: #2d3748;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }
} 