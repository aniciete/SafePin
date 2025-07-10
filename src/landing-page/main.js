import { renderHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initializeSession } from '../utils/sessionManager.js';

document.addEventListener('DOMContentLoaded', () => {
    renderHeader(document.getElementById('header-container'));
    renderFooter(document.getElementById('footer-container'));
    initializeSession();
});