// Global variables for modal callbacks
let currentPromptCallback = null;
let currentConfirmCallback = null;
let currentDropdownPromptCallback = null;
let currentUserSelectionCallback = null;
let currentEditReportRow = null; // To store the row being edited

// Function to show custom message modal
function showMessageModal(message) {
    document.getElementById('messageText').textContent = message;
    document.getElementById('messageModal').style.display = 'flex';
}

// Function to show custom prompt modal (text input)
function showPromptModal(message, callback) {
    document.getElementById('promptText').textContent = message;
    document.getElementById('promptInput').value = ''; // Clear previous input
    document.getElementById('promptModal').style.display = 'flex';
    currentPromptCallback = callback;
}

// Callback for prompt modal
function promptCallback(value) {
    document.getElementById('promptModal').style.display = 'none';
    if (currentPromptCallback) {
        currentPromptCallback(value);
        currentPromptCallback = null;
    }
}

// Function to show custom dropdown prompt modal
function showDropdownPromptModal(message, options, callback) {
    document.getElementById('dropdownPromptText').textContent = message;
    const selectElement = document.getElementById('dropdownPromptSelect');
    selectElement.innerHTML = ''; // Clear previous options
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
    document.getElementById('dropdownPromptModal').style.display = 'flex';
    currentDropdownPromptCallback = callback;
}

// Callback for dropdown prompt modal
function dropdownPromptCallback(value) {
    document.getElementById('dropdownPromptModal').style.display = 'none';
    if (currentDropdownPromptCallback) {
        currentDropdownPromptCallback(value);
        currentDropdownPromptCallback = null;
    }
}

// Function to show custom confirmation modal
function showConfirmModal(message, callback) {
    document.getElementById('confirmText').textContent = message;
    document.getElementById('confirmModal').style.display = 'flex';
    currentConfirmCallback = callback;
}

// Callback for confirmation modal
function confirmCallback(result) {
    document.getElementById('confirmModal').style.display = 'none';
    if (currentConfirmCallback) {
        currentConfirmCallback(result);
        currentConfirmCallback = null;
    }
}

// Function to show user selection modal
function showUserSelectionModal(callback) {
    currentUserSelectionCallback = callback;
    const userListContainer = document.getElementById('userListContainer');
    userListContainer.innerHTML = ''; // Clear previous list

    const usersTableBody = document.querySelector('#users-content tbody');
    const userRows = Array.from(usersTableBody.querySelectorAll('tr'));
    let allUsernames = userRows.map(row => row.cells[0].textContent);

    function renderUserList(filterText = '') {
        userListContainer.innerHTML = ''; // Clear current list
        const filteredUsers = allUsernames.filter(username =>
            username.toLowerCase().includes(filterText.toLowerCase())
        );

        if (filteredUsers.length === 0) {
            userListContainer.innerHTML = '<p class="text-gray-500 text-center py-4">No users found.</p>';
            return;
        }

        filteredUsers.forEach(username => {
            const userItem = document.createElement('div');
            userItem.className = 'p-2 cursor-pointer hover:bg-gray-100 rounded-md';
            userItem.textContent = username;
            userItem.addEventListener('click', () => {
                userSelectionCallback(username);
            });
            userListContainer.appendChild(userItem);
        });
    }

    // Initial render
    renderUserList();

    // Search functionality
    const userSearchInput = document.getElementById('userSearchInput');
    userSearchInput.value = ''; // Clear previous search
    userSearchInput.onkeyup = (event) => {
        renderUserList(event.target.value);
    };

    document.getElementById('userSelectionModal').style.display = 'flex';
}

// Callback for user selection modal
function userSelectionCallback(username) {
    document.getElementById('userSelectionModal').style.display = 'none';
    if (currentUserSelectionCallback) {
        currentUserSelectionCallback(username);
        currentUserSelectionCallback = null;
    }
}

// Function to close any modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Function to submit new alert
function submitAlert() {
    const title = document.getElementById('alertTitle').value;
    const description = document.getElementById('alertDescription').value;
    const category = document.getElementById('alertCategory').value;

    if (!title || !description) {
        showMessageModal('Alert title and description are required.');
        return;
    }

    const alertsContainer = document.getElementById('active-alerts-container');
    const newAlert = document.createElement('div');

    let alertClasses = 'p-4 rounded-md shadow-sm';
    let alertRole = 'alert';

    // Assign color based on category
    switch (category) {
        case 'System Health':
            alertClasses += ' bg-green-100 border-l-4 border-green-500 text-green-700';
            break;
        case 'Security':
            alertClasses += ' bg-red-100 border-l-4 border-red-500 text-red-700';
            break;
        case 'Incident Report':
            alertClasses += ' bg-orange-100 border-l-4 border-orange-500 text-orange-700';
            break;
        case 'User Activity':
            alertClasses += ' bg-blue-100 border-l-4 border-blue-500 text-blue-700';
            break;
        case 'Other':
        default:
            alertClasses += ' bg-gray-100 border-l-4 border-gray-500 text-gray-700';
            break;
    }

    newAlert.className = alertClasses;
    newAlert.setAttribute('role', alertRole);
    newAlert.innerHTML = `
        <p class="font-bold">${category}: ${title}</p>
        <p class="text-sm">${description}</p>
    `;
    alertsContainer.appendChild(newAlert);

    closeModal('alertDetailsModal');
    showMessageModal('Alert created and displayed successfully!');
}

// Function to submit jurisdiction transfer
function submitJurisdictionTransfer() {
    const newDistrict = document.getElementById('transferDistrict').value;
    const newBarangay = document.getElementById('transferBarangay').value;

    if (!newDistrict || !newBarangay) {
        showMessageModal('New District and Barangay are required for transfer.');
        return;
    }

    document.getElementById('current-jurisdiction').innerHTML = `
        District: ${newDistrict}
        <span class="inline-block ml-12">Barangay: ${newBarangay}</span>
    `;

    // Update the select dropdowns as well for consistency
    const districtSelect = document.getElementById('district');
    const barangaySelect = document.getElementById('barangay');

    // Clear existing options and add new selected one, then re-add others if needed
    // For simplicity, we'll just set the value if it exists, or add a new option
    let districtFound = false;
    for (let i = 0; i < districtSelect.options.length; i++) {
        if (districtSelect.options[i].value === newDistrict) {
            districtSelect.value = newDistrict;
            districtFound = true;
            break;
        }
    }
    if (!districtFound) {
        const newOption = new Option(newDistrict, newDistrict, true, true);
        districtSelect.add(newOption);
    }

    let barangayFound = false;
    for (let i = 0; i < barangaySelect.options.length; i++) {
        if (barangaySelect.options[i].value === newBarangay) {
            barangaySelect.value = newBarangay;
            barangayFound = true;
            break;
        }
    }
    if (!barangayFound) {
        const newOption = new Option(newBarangay, newBarangay, true, true);
        barangaySelect.add(newOption);
    }


    closeModal('transferJurisdictionModal');
    showMessageModal(`Jurisdiction transferred to District: ${newDistrict}, Barangay: ${newBarangay}.`);
}

// Function to open edit report modal
function openEditReportModal(row) {
    currentEditReportRow = row;
    const cells = row.children;
    document.getElementById('editReportId').value = cells[0].querySelector('span').textContent;
    document.getElementById('editStreet').value = cells[1].textContent;
    document.getElementById('editWanted').value = cells[2].textContent;
    
    // Set initial values for dropdowns and handle "Other" input
    const editProgressSelect = document.getElementById('editProgress');
    const editProgressOtherInput = document.getElementById('editProgressOther');
    const currentProgress = cells[3].textContent;
    if (Array.from(editProgressSelect.options).some(option => option.value === currentProgress)) {
        editProgressSelect.value = currentProgress;
        editProgressOtherInput.classList.add('hidden');
    } else {
        editProgressSelect.value = 'Other';
        editProgressOtherInput.value = currentProgress;
        editProgressOtherInput.classList.remove('hidden');
    }

    document.getElementById('editVisibility').value = cells[4].textContent;
    document.getElementById('editReportModal').style.display = 'flex';
}

// Function to submit edited report
function submitEditedReport() {
    if (!currentEditReportRow) return;

    const cells = currentEditReportRow.children;
    cells[1].textContent = document.getElementById('editStreet').value;
    cells[2].textContent = document.getElementById('editWanted').value;
    
    const editProgressSelect = document.getElementById('editProgress');
    const editProgressOtherInput = document.getElementById('editProgressOther');
    let selectedProgress = editProgressSelect.value;
    if (selectedProgress === 'Other') {
        selectedProgress = editProgressOtherInput.value;
    }
    cells[3].textContent = selectedProgress;
    
    cells[4].textContent = document.getElementById('editVisibility').value;

    closeModal('editReportModal');
    showMessageModal('Report updated successfully!');
    currentEditReportRow = null;
}

// Analytics Chart Initialization and Update Logic
let barChart, pieChart, radarChart, areaChart;

function initializeCharts() {
    // Destroy existing charts if they exist to prevent re-initialization errors
    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();
    if (radarChart) radarChart.destroy();
    if (areaChart) areaChart.destroy();

    // Bar Chart - Crimes Committed per Month
    const barCtx = document.getElementById("barChart").getContext("2d");
    barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: [
                "Murder",
                "Kidnapping",
                "Sexual Assault",
                "Violence",
                "Theft",
            ],
            datasets: [{
                label: "Crimes Committed",
                data: [8, 12, 16, 20, 35],
                backgroundColor: [
                    "#7dd3fc", // Murder - cyan-300
                    "#22d3ee", // Kidnapping - cyan-400
                    "#0284c7", // Sexual Assault - blue-700
                    "#7c3aed", // Violence - purple-700
                    "#1e40af", // Theft - blue-900
                ],
            }, ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                title: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5,
                    },
                },
            },
        },
    });

    // Pie Chart - Geographical Analysis
    const pieCtx = document.getElementById("pieChart").getContext("2d");
    pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: [
                "Safer Outlier",
                "Lower Outlier",
                "Keep Caution",
                "Extreme Caution",
                "High Caution",
            ],
            datasets: [{
                label: "Crime Distribution",
                data: [25, 35.7, 17.9, 7, 14.3],
                backgroundColor: [
                    "#c6d8e6", // light blue
                    "#fcd5b2", // light orange
                    "#3b82f6", // blue-500
                    "#ef4444", // red-500
                    "#ea580c", // orange-600
                ],
            }, ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });

    // Radar Chart - SafePin System Performance
    const radarCtx = document.getElementById("radarChart").getContext("2d");
    radarChart = new Chart(radarCtx, {
        type: "radar",
        data: {
            labels: [
                "Performance",
                "Reliability",
                "Usability",
                "Security",
                "Scalability",
            ],
            datasets: [{
                label: "User Evaluation",
                data: [9, 6, 8, 7, 6],
                fill: true,
                backgroundColor: "rgba(29, 78, 216, 0.5)", // blue-700 with opacity
                borderColor: "#1d4ed8", // blue-700
                pointBackgroundColor: "#1d4ed8",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#1d4ed8",
            }, ],
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true,
                    },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        stepSize: 2,
                        backdropColor: "transparent",
                    },
                },
            },
            plugins: {
                legend: {
                    position: "top",
                },
            },
        },
    });

    // Area Chart - Response Time Analysis
    const areaCtx = document.getElementById("areaChart").getContext("2d");
    areaChart = new Chart(areaCtx, {
        type: "line",
        data: {
            labels: [
                "1 Min",
                "2 Mins",
                "3 Mins",
                "4 Mins",
                "5 Mins",
                "6 Mins",
                "7 Mins",
                "8 Mins",
                "9 Mins",
                "10 Mins",
            ],
            datasets: [{
                label: "PNP",
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                fill: true,
                backgroundColor: "rgba(29, 78, 216, 0.7)", // blue-700
                borderColor: "#1d4ed8",
                tension: 0.4,
            }, {
                label: "BFP",
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                fill: true,
                backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
                borderColor: "#ef4444",
                tension: 0.4,
            }, {
                label: "EMS",
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                fill: true,
                backgroundColor: "rgba(20, 184, 166, 0.7)", // teal-500
                borderColor: "#14b8a6",
                tension: 0.4,
            }, {
                label: "PCG",
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                fill: true,
                backgroundColor: "rgba(14, 165, 233, 0.7)", // sky-500
                borderColor: "#0ea5e9",
                tension: 0.4,
            }, ],
        },
        options: {
            responsive: true,
            interaction: {
                mode: "nearest",
                intersect: false,
            },
            stacked: true,
            plugins: {
                legend: {
                    position: "top",
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                },
            },
        },
    });
}

// Update functions for each chart
function updateBarChart() {
    const murder = parseInt(
        document.getElementById("murderInput").value,
        10
    );
    const kidnapping = parseInt(
        document.getElementById("kidnappingInput").value,
        10
    );
    const sexualAssault = parseInt(
        document.getElementById("sexualAssaultInput").value,
        10
    );
    const violence = parseInt(
        document.getElementById("violenceInput").value,
        10
    );
    const theft = parseInt(
        document.getElementById("theftInput").value,
        10
    );

    if (
        [murder, kidnapping, sexualAssault, violence, theft].some(
            (v) => isNaN(v) || v < 0
        )
    ) {
        showMessageModal("Please enter valid non-negative numbers for all crime categories.");
        return;
    }

    barChart.data.datasets[0].data = [
        murder,
        kidnapping,
        sexualAssault,
        violence,
        theft,
    ];
    barChart.update();
}

function updatePieChart() {
    const safeOutlier = parseFloat(
        document.getElementById("safeOutlierInput").value
    );
    const lowerOutlier = parseFloat(
        document.getElementById("lowerOutlierInput").value
    );
    const keepCaution = parseFloat(
        document.getElementById("keepCautionInput").value
    );
    const extremeCaution = parseFloat(
        document.getElementById("extremeCautionInput").value
    );
    const highCaution = parseFloat(
        document.getElementById("highCautionInput").value
    );

    const values = [
        safeOutlier,
        lowerOutlier,
        keepCaution,
        extremeCaution,
        highCaution,
    ];

    if (
        values.some(
            (v) => isNaN(v) || v < 0 || v > 100
        )
    ) {
        showMessageModal("Please enter valid percentages between 0 and 100.");
        return;
    }

    const total = values.reduce((a, b) => a + b, 0);
    if (total > 100) {
        showMessageModal("Total percentage cannot exceed 100.");
        return;
    }

    pieChart.data.datasets[0].data = values;
    pieChart.update();
}

function updateRadarChart() {
    const performance = parseFloat(
        document.getElementById("performanceInput").value
    );
    const reliability = parseFloat(
        document.getElementById("reliabilityInput").value
    );
    const usability = parseFloat(
        document.getElementById("usabilityInput").value
    );
    const security = parseFloat(
        document.getElementById("securityInput").value
    );
    const scalability = parseFloat(
        document.getElementById("scalabilityInput").value
    );

    const values = [
        performance,
        reliability,
        usability,
        security,
        scalability,
    ];

    if (
        values.some(
            (v) => isNaN(v) || v < 0 || v > 10
        )
    ) {
        showMessageModal("Please enter valid scores between 0 and 10.");
        return;
    }

    radarChart.data.datasets[0].data = values;
    radarChart.update();
}

function updateAreaChart() {
    function parseInput(inputId) {
        const val = document.getElementById(inputId).value;
        return val
            .split(",")
            .map((v) => parseFloat(v.trim()))
            .filter((v) => !isNaN(v) && v >= 0);
    }

    const pnpData = parseInput("pnpInput");
    const bfpData = parseInput("bfpInput");
    const emsData = parseInput("emsInput");
    const pcgData = parseInput("pcgInput");

    const lengths = [pnpData.length, bfpData.length, emsData.length, pcgData.length];
    const minLen = Math.min(...lengths);
    if (minLen === 0) {
        showMessageModal("Please enter valid comma-separated numbers for all response time fields.");
        return;
    }

    // Use the shortest length to sync labels and data
    const labels = [];
    for (let i = 1; i <= minLen; i++) {
        labels.push(i + (i === 1 ? " Min" : " Mins"));
    }

    areaChart.data.labels = labels;
    areaChart.data.datasets[0].data = pnpData.slice(0, minLen);
    areaChart.data.datasets[1].data = bfpData.slice(0, minLen);
    areaChart.data.datasets[2].data = emsData.slice(0, minLen);
    areaChart.data.datasets[3].data = pcgData.slice(0, minLen);

    areaChart.update();
}

// Share button functionality
function shareDashboard() {
    if (navigator.share) {
        navigator
            .share({
                title: "SafePin Admin Dashboard",
                text: "Check out the SafePin Admin Dashboard analytics.",
                url: window.location.href,
            })
            .then(() => showMessageModal("Dashboard shared successfully!"))
            .catch((error) => showMessageModal("Error sharing: " + error));
    } else {
        showMessageModal("Sharing not supported on this browser.");
    }
}

// Download button functionality - downloads current chart data as JSON
function downloadDashboardData() {
    const data = {
        crimesCommitted: barChart.data.datasets[0].data,
        geographicalCrimeDistribution: pieChart.data.datasets[0].data,
        systemPerformance: radarChart.data.datasets[0].data,
        responseTimeAnalysis: {
            labels: areaChart.data.labels,
            PNP: areaChart.data.datasets[0].data,
            BFP: areaChart.data.datasets[1].data,
            EMS: areaChart.data.datasets[2].data,
            PCG: areaChart.data.datasets[3].data,
        },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "safepin_dashboard_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showMessageModal("Dashboard data downloaded as JSON file.");
}


// Settings Tab Logic
const settingsDetails = {
    "System Settings": [
        "Manage system preferences",
        "Configure system-wide options",
        "Set default behaviors"
    ],
    "Map Configuration": [
        "Set map default location",
        "Manage map layers",
        "Configure map zoom levels"
    ],
    "Notification Template": [
        "Edit email templates",
        "Edit SMS templates",
        "Manage notification triggers"
    ],
    "Custom Fields": [
        "Add new custom fields",
        "Edit existing fields",
        "Manage field visibility"
    ],
    "API Access": [
        "Generate API keys",
        "Set API permissions",
        "View API usage logs"
    ],
    "Security Settings": [
        "Manage user roles",
        "Set password policies",
        "Configure two-factor authentication"
    ]
};

function renderSettingsDashboard() {
    document.getElementById('settings-back-button').classList.add("hidden");
    const settingsMainContent = document.getElementById("settings-main-content");
    settingsMainContent.innerHTML = `
        <h1 class="font-bold text-lg md:text-xl mb-8">Admin Dashboard - Settings</h1>
        <section class="grid grid-cols-1 sm:grid-cols-3 gap-y-16 gap-x-24 max-w-5xl mx-auto">
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="System Settings" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black gear icon representing system settings" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/d53d346e-4e13-4b46-0eb6-48e0b67ca5fd.jpg" width="48"/>
                <p class="font-bold text-center text-sm">System Settings</p>
            </div>
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="Map Configuration" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black map pin icon with shadow representing map configuration" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/bdc9a691-c1e1-4c11-5ca2-78498eb28f5d.jpg" width="48"/>
                <p class="font-bold text-center text-sm">Map Configuration</p>
            </div>
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="Notification Template" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black bell icon representing notification template" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/c4c0deb1-453b-427a-2d11-99c9ccd8c1b2.jpg" width="48"/>
                <p class="font-bold text-center text-sm">Notification Template</p>
            </div>
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="Custom Fields" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black edit icon representing custom fields" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/f4a10e92-e903-4e42-4f42-5ac8e4bc5793.jpg" width="48"/>
                <p class="font-bold text-center text-sm">Custom Fields</p>
            </div>
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="API Access" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black wifi signal icon representing API access" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/38f5684c-8cdf-4870-fb1b-ad858a54cbf9.jpg" width="48"/>
                <p class="font-bold text-center text-sm">API Access</p>
            </div>
            <div class="flex flex-col items-center space-y-3 cursor-pointer settings-nav-link" data-name="Security Settings" tabindex="0" role="button" aria-pressed="false">
                <img alt="Black lock icon representing security settings" class="w-12 h-12" height="48" src="https://storage.googleapis.com/a1aa/image/11e1618d-f207-40cf-45ae-052b6ceae03f.jpg" width="48"/>
                <p class="font-bold text-center text-sm">Security Settings</p>
            </div>
        </section>
    `;
    attachSettingsNavLinkListeners();
}

function renderSettingsDetails(name) {
    document.getElementById('settings-back-button').classList.remove("hidden");
    const settingsMainContent = document.getElementById("settings-main-content");
    const details = settingsDetails[name] || [];
    settingsMainContent.innerHTML = `
        <h2 class="text-lg font-bold mb-6">${name}</h2>
        <ul class="list-disc list-inside space-y-2 max-w-3xl">
            ${details.map(item => `<li class="text-sm">${item}</li>`).join("")}
        </ul>
    `;
}

function attachSettingsNavLinkListeners() {
    const settingsNavLinks = document.querySelectorAll(".settings-nav-link");
    settingsNavLinks.forEach(link => {
        link.addEventListener("click", () => {
            const name = link.getAttribute("data-name");
            renderSettingsDetails(name);
        });
        link.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const name = link.getAttribute("data-name");
                renderSettingsDetails(name);
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    // Get buttons and content sections
    const overviewBtn = document.getElementById('overview-btn');
    const reportsBtn = document.getElementById('reports-btn');
    const usersBtn = document.getElementById('users-btn');
    const analyticsBtn = document.getElementById('analytics-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const logoutBtn = document.getElementById('logout-btn');


    const overviewContent = document.getElementById('overview-content');
    const reportsContent = document.getElementById('reports-content');
    const usersContent = document.getElementById('users-content');
    const analyticsContent = document.getElementById('analytics-content');
    const settingsContent = document.getElementById('settings-content');


    const manageUsersBtn = document.getElementById('manage-users-btn');
    const reviewFlagsBtn = document.getElementById('review-flags-btn');
    const createAlertReportsBtn = document.getElementById('create-alert-reports-btn');
    const transferJurisdictionBtn = document.getElementById('transfer-jurisdiction-btn');

    // User management buttons
    const createUserBtn = document.getElementById('createUserBtn');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const setAccessBtn = document.getElementById('setAccessBtn');
    const deactivateAccountBtn = document.getElementById('deactivateAccountBtn');
    const reactivateAccountBtn = document.getElementById('reactivateAccountBtn');

    let currentActiveTabName = 'Overview'; // Initialize with default active tab
    let previousTabBeforeLogout = 'Overview'; // To store the tab to return to if logout is cancelled

    // Function to set active tab
    function setActiveTab(tabName) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active styles from all sidebar buttons
        [overviewBtn, reportsBtn, usersBtn, analyticsBtn, settingsBtn, logoutBtn].forEach(btn => {
            btn.classList.remove('bg-[#bfc3ca]', 'bg-opacity-40');
        });

        // Show the new active content and apply active style to its button
        switch (tabName) {
            case 'Overview':
                overviewContent.classList.add('active');
                overviewBtn.classList.add('bg-[#bfc3ca]', 'bg-opacity-40');
                break;
            case 'Reports':
                reportsContent.classList.add('active');
                reportsBtn.classList.add('bg-[#bfc3ca]', 'bg-opacity-40');
                break;
            case 'Users':
                usersContent.classList.add('active');
                usersBtn.classList.add('bg-[#bfc3ca]', 'bg-opacity-40');
                break;
            case 'Analytics':
                analyticsContent.classList.add('active');
                analyticsBtn.classList.add('bg-[#bfc3ca]', 'bg-opacity-40');
                initializeCharts(); // Initialize charts when analytics tab is opened
                // Attach event listeners for analytics chart updates
                document.getElementById("updateBarChart").addEventListener("click", updateBarChart);
                document.getElementById("updatePieChart").addEventListener("click", updatePieChart);
                document.getElementById("updateRadarChart").addEventListener("click", updateRadarChart);
                document.getElementById("updateAreaChart").addEventListener("click", updateAreaChart);
                document.getElementById("shareBtn").addEventListener("click", shareDashboard);
                document.getElementById("downloadBtn").addEventListener("click", downloadDashboardData);
                break;
            case 'Settings':
                settingsContent.classList.add('active');
                settingsBtn.classList.add('bg-[#bfc3ca]', 'bg-opacity-40');
                renderSettingsDashboard();
                break;
            // 'Log out' is handled by a modal, not a content section switch
        }
        currentActiveTabName = tabName; // Update the current active tab name
    }

    // Set initial active state
    setActiveTab('Overview');

    // Event Listeners for sidebar navigation
    overviewBtn.addEventListener('click', function() {
        setActiveTab('Overview');
    });

    reportsBtn.addEventListener('click', function() {
        setActiveTab('Reports');
    });

    usersBtn.addEventListener('click', function() {
        setActiveTab('Users');
    });

    analyticsBtn.addEventListener('click', function() {
        setActiveTab('Analytics');
    });

    settingsBtn.addEventListener('click', function() {
        setActiveTab('Settings');
    });

    logoutBtn.addEventListener('click', function() {
        previousTabBeforeLogout = currentActiveTabName; // Store the current tab before logout prompt
        showConfirmModal('Are you sure you want to log out?', (confirmed) => {
            if (confirmed) {
                showMessageModal('You have been logged out.');
                setActiveTab('Overview'); // Go to overview after logging out
            } else {
                showMessageModal('Logout cancelled.');
                setActiveTab(previousTabBeforeLogout); // Return to the tab that was active before the logout prompt
            }
        });
    });

    // Event Listener for settings back button
    document.getElementById('settings-back-button').addEventListener('click', function() {
        renderSettingsDashboard();
    });


    // Event Listeners for buttons on Overview page
    manageUsersBtn.addEventListener('click', function() {
        setActiveTab('Users');
    });

    reviewFlagsBtn.addEventListener('click', function() {
        setActiveTab('Reports');
    });

    // Event Listeners for functional buttons in Reports tab
    createAlertReportsBtn.addEventListener('click', function() {
        document.getElementById('alertTitle').value = ''; // Clear previous input
        document.getElementById('alertDescription').value = ''; // Clear previous input
        document.getElementById('alertDetailsModal').style.display = 'flex';
    });

    transferJurisdictionBtn.addEventListener('click', function() {
        document.getElementById('transferDistrict').value = ''; // Clear previous input
        document.getElementById('transferBarangay').value = ''; // Clear previous input
        document.getElementById('transferJurisdictionModal').style.display = 'flex';
    });

    // Event Listener for Create Alert button on Overview page
    document.getElementById('create-alert-overview-btn').addEventListener('click', function() {
        document.getElementById('alertTitle').value = ''; // Clear previous input
        document.getElementById('alertDescription').value = ''; // Clear previous input
        document.getElementById('alertDetailsModal').style.display = 'flex';
    });

    // Event listeners for remove and edit buttons in reports table
    document.getElementById('reports-table-body').addEventListener('click', function(event) {
        const target = event.target.closest('button');
        if (!target) return;

        const row = target.closest('tr');
        if (!row) return;

        if (target.classList.contains('remove-report-btn')) {
            const reportId = row.cells[0].querySelector('span').textContent;
            showConfirmModal(`Are you sure you want to remove report "${reportId}"?`, (confirmed) => {
                if (confirmed) {
                    row.remove();
                    showMessageModal(`Report "${reportId}" removed successfully.`);
                }
            });
        } else if (target.classList.contains('edit-report-btn')) {
            openEditReportModal(row);
        }
    });

    // Event listener for the 'Other' option in the Progress dropdown
    document.getElementById('editProgress').addEventListener('change', function() {
        const otherInput = document.getElementById('editProgressOther');
        if (this.value === 'Other') {
            otherInput.classList.remove('hidden');
        } else {
            otherInput.classList.add('hidden');
        }
    });


    // User management functionality
    createUserBtn.addEventListener('click', () => {
        showPromptModal('Enter new username:', (username) => {
            if (!username) {
                showMessageModal('Username is required.');
                return;
            }
            // Now, prompt for access level using the dropdown modal
            showDropdownPromptModal(`Select access level for "${username}":`, ['Level 1', 'Level 2', 'Level 3'], (accessLevel) => {
                if (!accessLevel) {
                    showMessageModal('Access level is required.');
                    return;
                }
                const tbody = document.querySelector('#users-content tbody');
                const tr = document.createElement('tr');
                tr.className = 'bg-gray-300';
                tr.innerHTML = `
                    <td class="border border-gray-400 px-3 py-1">${username}</td>
                    <td class="border border-gray-400 px-3 py-1 font-semibold text-green-600 flex items-center space-x-2">
                        <span>Active</span>
                        <div class="w-4 h-4 rounded-full bg-green-500"></div>
                    </td>
                    <td class="border border-gray-400 px-3 py-1">${accessLevel}</td>
                    <td class="border border-gray-400 px-3 py-1">Today</td>
                `;
                tbody.appendChild(tr);
                showMessageModal(`User "${username}" created successfully with access level "${accessLevel}".`);
            });
        });
    });

    changePasswordBtn.addEventListener('click', () => {
        showUserSelectionModal((username) => {
            if (!username) {
                showMessageModal('No username selected.');
                return;
            }
            const userRow = Array.from(document.querySelectorAll('#users-content tbody tr')).find(row =>
                row.cells[0].textContent === username
            );
            if (!userRow) {
                showMessageModal(`User "${username}" not found.`);
                return;
            }
            showPromptModal(`Enter new password for "${username}":`, (newPassword) => {
                if (!newPassword) {
                    showMessageModal('Password cannot be empty.');
                    return;
                }
                showMessageModal(`Password for "${username}" changed successfully.`);
            });
        });
    });

    setAccessBtn.addEventListener('click', () => {
        showUserSelectionModal((username) => {
            if (!username) {
                showMessageModal('No username selected.');
                return;
            }
            const userRow = Array.from(document.querySelectorAll('#users-content tbody tr')).find(row =>
                row.cells[0].textContent === username
            );
            if (!userRow) {
                showMessageModal(`User "${username}" not found.`);
                return;
            }
            showDropdownPromptModal(`Select new access level for "${username}":`, ['Level 1', 'Level 2', 'Level 3'], (newAccess) => {
                if (!newAccess) {
                    showMessageModal('Access level cannot be empty.');
                    return;
                }
                userRow.cells[2].textContent = newAccess;
                showMessageModal(`Access level for "${username}" updated to "${newAccess}".`);
            });
        });
    });

    deactivateAccountBtn.addEventListener('click', () => {
        showUserSelectionModal((username) => {
            if (!username) {
                showMessageModal('No username selected.');
                return;
            }
            const userRow = Array.from(document.querySelectorAll('#users-content tbody tr')).find(row =>
                row.cells[0].textContent === username
            );
            if (!userRow) {
                showMessageModal(`User "${username}" not found.`);
                return;
            }
            showConfirmModal(`Are you sure you want to deactivate "${username}"? This action cannot be undone.`, (confirmed) => {
                if (confirmed) {
                    const statusCell = userRow.cells[1];
                    statusCell.innerHTML = `
                        <span class="font-semibold text-red-600">Inactive</span>
                        <div class="w-4 h-4 rounded-full bg-red-600"></div>
                    `;
                    showMessageModal(`Account for "${username}" has been deactivated.`);
                } else {
                    showMessageModal(`Deactivation of "${username}" cancelled.`);
                }
            });
        });
    });

    // Reactivate Account button functionality
    reactivateAccountBtn.addEventListener('click', () => {
        showUserSelectionModal((username) => {
            if (!username) {
                showMessageModal('No username selected.');
                return;
            }
            const userRow = Array.from(document.querySelectorAll('#users-content tbody tr')).find(row =>
                row.cells[0].textContent === username
            );
            if (!userRow) {
                showMessageModal(`User "${username}" not found.`);
                return;
            }
            showConfirmModal(`Are you sure you want to reactivate "${username}"?`, (confirmed) => {
                if (confirmed) {
                    const statusCell = userRow.cells[1];
                    statusCell.innerHTML = `
                        <span class="font-semibold text-green-600">Active</span>
                        <div class="w-4 h-4 rounded-full bg-green-500"></div>
                    `;
                    showMessageModal(`Account for "${username}" has been reactivated.`);
                } else {
                    showMessageModal(`Reactivation of "${username}" cancelled.`);
                }
            });
        });
    });
});
