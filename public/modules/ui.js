// UI utility functions for modals and redirects

export function openModal() {
    console.log("Opening modal...");
    document.getElementById("authorityModal").style.display = "flex";
}

export function closeModal() {
    console.log("Closing modal...");
    document.getElementById("authorityModal").style.display = "none";
}

export function redirectTo(type) {
    console.log("redirectTo called with type:", type);
    console.log("Current location:", window.location.href);

    let folderName = "";
    let fileName = "";

    if (type === 'admin') {
        folderName = "Admin Page/Project";
        fileName = "Admin-Page.html";
    } else if (type === 'authority') {
        folderName = "Authority Page";
        fileName = "Authority-Page.html";
    } else {
        console.error("Unknown type:", type);
        return;
    }

    const targetPath = "../" + encodeURIComponent(folderName) + "/" + fileName;
    console.log("Redirecting to:", targetPath);

    window.location.href = targetPath;

    closeModal();
}

export function setupModalCloseOnOutsideClick() {
    window.onclick = function(event) {
        const modal = document.getElementById("authorityModal");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Modal and prompt utilities for Admin Page
export function showMessageModal(message) {
    document.getElementById('messageText').textContent = message;
    document.getElementById('messageModal').style.display = 'flex';
}

export function showPromptModal(message, callback) {
    document.getElementById('promptText').textContent = message;
    document.getElementById('promptInput').value = '';
    document.getElementById('promptModal').style.display = 'flex';
    window.currentPromptCallback = callback;
}

export function promptCallback(value) {
    document.getElementById('promptModal').style.display = 'none';
    if (window.currentPromptCallback) {
        window.currentPromptCallback(value);
        window.currentPromptCallback = null;
    }
}

export function showDropdownPromptModal(message, options, callback) {
    document.getElementById('dropdownPromptText').textContent = message;
    const selectElement = document.getElementById('dropdownPromptSelect');
    selectElement.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        selectElement.appendChild(opt);
    });
    document.getElementById('dropdownPromptModal').style.display = 'flex';
    window.currentDropdownPromptCallback = callback;
}

export function dropdownPromptCallback(value) {
    document.getElementById('dropdownPromptModal').style.display = 'none';
    if (window.currentDropdownPromptCallback) {
        window.currentDropdownPromptCallback(value);
        window.currentDropdownPromptCallback = null;
    }
}

export function showConfirmModal(message, callback) {
    document.getElementById('confirmText').textContent = message;
    document.getElementById('confirmModal').style.display = 'flex';
    window.currentConfirmCallback = callback;
}

export function confirmCallback(result) {
    document.getElementById('confirmModal').style.display = 'none';
    if (window.currentConfirmCallback) {
        window.currentConfirmCallback(result);
        window.currentConfirmCallback = null;
    }
}

export function showUserSelectionModal(callback) {
    window.currentUserSelectionCallback = callback;
    const userListContainer = document.getElementById('userListContainer');
    userListContainer.innerHTML = '';
    const usersTableBody = document.querySelector('#users-content tbody');
    const userRows = Array.from(usersTableBody.querySelectorAll('tr'));
    let allUsernames = userRows.map(row => row.cells[0].textContent);
    function renderUserList(filterText = '') {
        userListContainer.innerHTML = '';
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
    renderUserList();
    const userSearchInput = document.getElementById('userSearchInput');
    userSearchInput.value = '';
    userSearchInput.onkeyup = (event) => {
        renderUserList(event.target.value);
    };
    document.getElementById('userSelectionModal').style.display = 'flex';
}

export function userSelectionCallback(username) {
    document.getElementById('userSelectionModal').style.display = 'none';
    if (window.currentUserSelectionCallback) {
        window.currentUserSelectionCallback(username);
        window.currentUserSelectionCallback = null;
    }
}

export function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
} 