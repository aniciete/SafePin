// Function to open the modal
function openModal() {
    document.getElementById("authorityModal").style.display = "flex"; // Use "flex" for centering
}

// Function to close the modal
function closeModal() {
    document.getElementById("authorityModal").style.display = "none";
}

// Function to redirect based on button clicked
function redirectTo(type) {
    if (type === 'admin') {
        window.location.href = "/Admin Page (Official).html"; // Path to your Admin Login page
    } else if (type === 'authority') {
        window.location.href = "/SafePin Level 2 V5.4.html"; // Path to your Authority Login page
    }
    closeModal(); // Close the modal after redirection
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("authorityModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};