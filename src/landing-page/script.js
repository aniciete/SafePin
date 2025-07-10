import { setupModalCloseOnOutsideClick } from '../utils/ui.js';

// Optionally, call setupModalCloseOnOutsideClick() on page load if needed
setupModalCloseOnOutsideClick();

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('authorityModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
