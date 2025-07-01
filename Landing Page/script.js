import { openModal, closeModal, redirectTo, setupModalCloseOnOutsideClick } from '../modules/ui.js';

// Optionally, call setupModalCloseOnOutsideClick() on page load if needed
setupModalCloseOnOutsideClick();

// Function to open the modal
function openModal() {
    console.log("Opening modal...");
    document.getElementById("authorityModal").style.display = "flex";
}

// Function to close the modal
function closeModal() {
    console.log("Closing modal...");
    document.getElementById("authorityModal").style.display = "none";
}

// Function to redirect based on button clicked
function redirectTo(type) {
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

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById("authorityModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
