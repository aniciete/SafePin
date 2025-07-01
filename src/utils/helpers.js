/**
 * Format a number with commas as thousand separators
 * @param {number} number - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} The formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
}; 