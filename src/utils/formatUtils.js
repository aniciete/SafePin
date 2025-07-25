/**
 * A centralized utility file for formatting data consistently across the application.
 */

/**
 * Formats a string by replacing underscores with spaces and capitalizing each word.
 * Handles non-string inputs gracefully.
 * Example: 'pending_verification' -> 'Pending Verification'
 * @param {any} value The value to format.
 * @returns {string} The formatted string or an empty string if input is invalid.
 */
export const formatLabel = (value) => {
  // Ensure the input is a string before proceeding. Handles null, undefined, etc.
  const str = String(value || '');

  // Perform the formatting.
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); // Capitalize each word
};

/**
 * Formats an ISO date string into a clean, readable date and time format.
 * Example: "Jul 26, 2025, 10:30 PM"
 * @param {string} isoString The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  
  const date = new Date(isoString);
  
  // Check if the date is valid before attempting to format it.
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  return date.toLocaleString('en-US', {
    month: 'short',    // "Jul"
    day: 'numeric',    // "26"
    year: 'numeric',   // "2025"
    hour: 'numeric',   // "10"
    minute: '2-digit', // "30"
    hour12: true,      // "PM"
  });
};

/**
 * Formats an ISO date string into a clean, readable date-only format.
 * Example: "Jul 26, 2025"
 * @param {string} isoString The date string to format.
 * @returns {string} The formatted date string.
 */
export const formatDateOnly = (isoString) => {
    if (!isoString) return 'N/A';
    
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
};