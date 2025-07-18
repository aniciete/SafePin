import { supabase } from '../config/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const verificationForm = document.getElementById('verificationForm');
  const statusDisplaySection = document.getElementById('status-display-section');
  const statusContent = document.getElementById('status-content'); // Assuming this element exists in your HTML
  const loadingSpinner = document.querySelector('.loading-spinner');

  if (verificationForm) {
    verificationForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      loadingSpinner.classList.remove('hidden');

      const reportId = document.getElementById('reportId').value;

      if (!reportId) {
        alert('Please enter a valid Report ID.');
        loadingSpinner.classList.add('hidden');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reports')
          .select('status, created_at, description')
          .eq('id', reportId)
          .single();

        if (error || !data) {
          throw new Error('Report not found or error fetching status.');
        }

        // You'll need to add an element with id="status-content" to your HTML
        // to display the result.
        if (statusContent) {
          statusContent.innerHTML = `
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Reported On:</strong> ${new Date(data.created_at).toLocaleString()}</p>
            <p><strong>Description:</strong> ${data.description}</p>
          `;
        }
        
        statusDisplaySection.classList.remove('hidden');
      } catch (err) {
        console.error('Error:', err);
        if (statusContent) {
            statusContent.innerHTML = `<p class="error">Could not retrieve report status. Please check the ID and try again.</p>`;
            statusDisplaySection.classList.remove('hidden');
        }
      } finally {
        loadingSpinner.classList.add('hidden');
      }
    });
  }
});
