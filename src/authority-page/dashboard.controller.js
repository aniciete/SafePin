// dashboard.controller.js
import { hideAllContentSections } from './ui.manager.js';
import { initMap, loadReportsOnMap } from './map.controller.js';
import { updateReportStatus } from '../services/report.service.js';

/**
 * Handles sidebar button clicks to switch between tabs.
 * @param {string} tabName - The name of the tab to activate.
 */
export function handleTabClick(tabName) {
  // Remove active styles from all buttons
  document.querySelectorAll('nav button').forEach(button => {
    button.classList.remove('bg-green-600', 'text-white', 'shadow-md');
    button.classList.add('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
  });

  // Add active styles to the clicked button
  const clickedButton = document.getElementById(`${tabName.toLowerCase().replace(' ', '-')}-btn`);
  if (clickedButton) {
    clickedButton.classList.add('bg-green-600', 'text-white', 'shadow-md');
    clickedButton.classList.remove('text-gray-300', 'hover:bg-gray-700', 'hover:text-white');
  }

  hideAllContentSections();

  // Show the relevant content section
  switch (tabName) {
    case 'Overview':
      document.getElementById('overview-content').classList.remove('hidden');
      break;
    case 'Reports':
      document.getElementById('reports-content').classList.remove('hidden');
      break;
    case 'Map View':
      document.getElementById('mapview-content').classList.remove('hidden');
      initMap();
      // TODO: Replace with Supabase call
      // loadReportsOnMap(getReports());
      break;
    case 'Profile':
      document.getElementById('profile-content').classList.remove('hidden');
      break;
    case 'Settings':
      document.getElementById('settings-content').classList.remove('hidden');
      break;
    case 'Help':
      document.getElementById('help-content').classList.remove('hidden');
      break;
    case 'Log out':
      document.getElementById('logout-content').classList.remove('hidden');
      break;
    default:
      document.getElementById('other-tabs-content').classList.remove('hidden');
      document.getElementById('other-tabs-content').textContent = `${tabName} Content Coming Soon!`;
      break;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('tab-change', (e) => handleTabClick(e.detail.tabName));

  document.getElementById('overview-btn').addEventListener('click', () => handleTabClick('Overview'));
  document.getElementById('reports-btn').addEventListener('click', () => handleTabClick('Reports'));
  document.getElementById('mapview-btn').addEventListener('click', () => handleTabClick('Map View'));
  document.getElementById('profile-btn').addEventListener('click', () => handleTabClick('Profile'));
  document.getElementById('settings-btn').addEventListener('click', () => handleTabClick('Settings'));
  document.getElementById('help-btn').addEventListener('click', () => handleTabClick('Help'));
  document.getElementById('logout-btn').addEventListener('click', () => handleTabClick('Log out'));

  document.getElementById('reports-in-jurisdiction-see-more').addEventListener('click', () => handleTabClick('Reports'));

  document.getElementById('confirm-logout-btn').addEventListener('click', () => {
    window.location.href = '../landing-page/index.html';
  });

  document.getElementById('cancel-logout-btn').addEventListener('click', () => {
    handleTabClick('Overview');
  });
  
  document.getElementById('save-status-btn').addEventListener('click', async () => {
    const reportId = document.getElementById('detail-report-id').textContent;
    const newStatus = document.getElementById('status-select').value;
    const successMessage = document.getElementById('update-success-message');

    if (reportId && newStatus) {
      try {
        await updateReportStatus(reportId, newStatus);
        document.getElementById('detail-report-status').textContent = newStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        // Show success message
        successMessage.classList.remove('hidden');
        setTimeout(() => {
          successMessage.classList.add('hidden');
        }, 3000); // Hide after 3 seconds

      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
      }
    }
  });

  // Set initial view
  handleTabClick('Overview');
});