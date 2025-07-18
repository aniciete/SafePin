// report.js - Fixed version with proper error handling and validation

// Import styles
import './style.css';
import '../utils/auth-styles.css';

// Import utilities
import { SafePinHeader } from '../components/Header.js';
import { SafePinFooter } from '../components/Footer.js';
import { FormController } from './form.controller.js';
import { IncidentMap } from './map.js';

// Load header and footer
(async () => {
    try {
        // Initialize header and footer
        const headerContainer = document.getElementById('header-container');
        const footerContainer = document.getElementById('footer-container');
        
        if (headerContainer) {
            const header = new SafePinHeader();
            header.init();
        }
        if (footerContainer) {
            const footer = new SafePinFooter();
            footer.init();
        }

        // Initialize map
        const incidentMap = new IncidentMap('map', 'latitude', 'longitude');
        await incidentMap.init();
        
        // Initialize form controller, passing the map instance for reset functionality
        new FormController(incidentMap);

    } catch (error) {
        console.error('Error initializing page:', error);
    }
})();