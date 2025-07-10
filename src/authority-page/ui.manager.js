// ui.manager.js

/**
 * Hides all main content sections and detail sections.
 */
export function hideAllContentSections() {
  const contentSections = [
    document.getElementById('overview-content'),
    document.getElementById('reports-content'),
    document.getElementById('profile-content'),
    document.getElementById('settings-content'),
    document.getElementById('help-content'),
    document.getElementById('logout-content'),
    document.getElementById('report-detail-content'),
    document.getElementById('verification-detail-content'),
    document.getElementById('activity-detail-content'),
    document.getElementById('other-tabs-content'),
    document.getElementById('mapview-content'),
  ];
  contentSections.forEach(section => section && section.classList.add('hidden'));
}

/**
 * Renders the main dashboard content.
 * @param {object} data - The data object containing reports and other info.
 */
export function renderDashboardContent(data) {
  if (!data) return;

  // Jurisdiction
  if (data.jurisdiction) {
    document.getElementById('district-name').textContent = data.jurisdiction.district;
    document.getElementById('barangay-name').textContent = data.jurisdiction.barangay;
  }

  // Reports in Jurisdiction (Overview Card)
  if (data.reportsInJurisdiction) {
    const reportsInJurisdictionList = document.getElementById('reports-in-jurisdiction-list');
    if (reportsInJurisdictionList) {
        reportsInJurisdictionList.innerHTML = ''; // Clear previous content
        data.reportsInJurisdiction.forEach(report => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center bg-yellow-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-yellow-200';
            div.innerHTML = `
              <span class="font-semibold text-yellow-800">${report.id}</span>
              <span class="text-gray-700">${report.street}</span>
              <span class="text-gray-500 text-sm">${report.date}</span>
            `;
            div.addEventListener('click', () => showReportDetail(report));
            reportsInJurisdictionList.appendChild(div);
        });
    }
  }

  // Pending Verifications
  if (data.pendingVerifications) {
    const pendingList = document.getElementById('pending-verifications-list');
    if (pendingList) {
        pendingList.innerHTML = ''; // Clear previous content
        data.pendingVerifications.forEach(verification => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center bg-blue-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-blue-200';
            div.innerHTML = `
              <span class="font-semibold text-blue-800">${verification.location}</span>
              <span class="text-gray-700">${verification.anonymousId}</span>
              <span class="text-gray-500 text-sm">${verification.date}</span>
            `;
            div.addEventListener('click', () => showVerificationDetail(verification));
            pendingList.appendChild(div);
        });
    }
  }

  // Resolved Incidents
  if (data.resolvedIncidents) {
    document.getElementById('resolved-incidents-total').textContent = data.resolvedIncidents.total;
    const resolvedBreakdownList = document.getElementById('resolved-incidents-breakdown');
    resolvedBreakdownList.innerHTML = ''; // Clear previous content
    data.resolvedIncidents.breakdown.forEach(item => {
      const li = document.createElement('li');
      li.className = 'flex justify-between items-center';
      li.innerHTML = `
        <span>${item.count} ${item.type}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
      `;
      resolvedBreakdownList.appendChild(li);
    });
    document.getElementById('crime-apprehension-rate').textContent = `${data.resolvedIncidents.crimeApprehensionRate}%`;
  }

  // Recent Activity
  const recentActivityList = document.getElementById('recent-activity-list');
  if (recentActivityList) {
    recentActivityList.innerHTML = ''; // Clear previous content
    if (data.recentActivity) {
      data.recentActivity.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100';
        div.innerHTML = `
          <span class="font-semibold text-gray-800">${activity.description}</span>
          <span class="text-gray-500 text-sm">${activity.date}</span>
        `;
        div.addEventListener('click', () => showActivityDetail(activity));
        recentActivityList.appendChild(div);
      });
    }
  }

  // Profile Section
  if (data.profile) {
    document.getElementById('profile-name').textContent = data.profile.name;
    document.getElementById('profile-role').textContent = data.profile.role;
    document.getElementById('profile-code').textContent = data.profile.code;
  }
}

/**
 * Renders the reports table.
 * @param {Array} reports - An array of report objects.
 */
export function renderReportsTable(reports) {
  const reportsTableBody = document.getElementById('reports-table-body');
  reportsTableBody.innerHTML = ''; // Clear previous content
  reports.forEach(report => {
    const div = document.createElement('div');
    div.className = 'grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 cursor-pointer';
    div.innerHTML = `
      <span>${report.id}</span>
      <span>${report.street}</span>
      <span>${report.wanted}</span>
      <span class="font-medium text-green-700">${report.progress}</span>
    `;
    div.addEventListener('click', () => showReportDetail(report, 'Reports'));
    reportsTableBody.appendChild(div);
  });
}

/**
 * Displays the detailed view for a report.
 * @param {object} report - The report data object.
 * @param {string} [returnToTab='Overview'] - The tab to return to.
 */
export function showReportDetail(report, returnToTab = 'Overview') {
  hideAllContentSections();
  document.getElementById('report-detail-content').classList.remove('hidden');

  document.getElementById('detail-report-id').textContent = report.id;
  document.getElementById('detail-report-category').textContent = report.category;
  document.getElementById('detail-report-location').textContent = report.street;
  document.getElementById('detail-report-datetime').textContent = report.date;
  document.getElementById('detail-report-suspect').textContent = report.wanted || report.suspect;
  document.getElementById('detail-report-status').textContent = report.progress || report.status;
  document.getElementById('detail-report-reporter').textContent = report.reporter || 'Anonymous';
  document.getElementById('detail-report-description').textContent = report.description;
  document.getElementById('detail-report-verification').textContent = report.verification;

  const officialNotesContainer = document.getElementById('detail-report-official-notes-container');
  const officialNotes = document.getElementById('detail-report-official-notes');
  if (report.officialNotes) {
    officialNotes.textContent = report.officialNotes;
    officialNotesContainer.classList.remove('hidden');
  } else {
    officialNotesContainer.classList.add('hidden');
  }

  const backButton = document.getElementById('back-from-report-detail');
  backButton.textContent = `← Back to ${returnToTab}`;
  backButton.onclick = () => {
    document.dispatchEvent(new CustomEvent('tab-change', { detail: { tabName: returnToTab } }));
  };
}

/**
 * Displays the detailed view for a pending verification.
 * @param {object} verification - The verification data object.
 */
export function showVerificationDetail(verification) {
  hideAllContentSections();
  document.getElementById('verification-detail-content').classList.remove('hidden');

  document.getElementById('detail-verification-id').textContent = verification.id || 'N/A';
  document.getElementById('detail-verification-report-id').textContent = verification.id;
  document.getElementById('detail-verification-category').textContent = verification.category;
  document.getElementById('detail-verification-location').textContent = verification.location;
  document.getElementById('detail-verification-date').textContent = verification.date;
  document.getElementById('detail-verification-anonymous-id').textContent = verification.anonymousId;
  document.getElementById('detail-verification-status').textContent = verification.status;
  document.getElementById('detail-verification-description').textContent = verification.description;

  document.getElementById('back-from-verification-detail').onclick = () => {
    document.dispatchEvent(new CustomEvent('tab-change', { detail: { tabName: 'Overview' } }));
  };
}

/**
 * Displays the detailed view for a recent activity.
 * @param {object} activity - The activity data object.
 */
export function showActivityDetail(activity) {
  hideAllContentSections();
  document.getElementById('activity-detail-content').classList.remove('hidden');

  document.getElementById('detail-activity-description').textContent = activity.description;
  document.getElementById('detail-activity-datetime').textContent = activity.date;
  document.getElementById('detail-activity-user').textContent = activity.user;

  document.getElementById('back-from-activity-detail').onclick = () => {
    document.dispatchEvent(new CustomEvent('tab-change', { detail: { tabName: 'Overview' } }));
  };
}