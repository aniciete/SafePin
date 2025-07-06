// Client-side logic to call the rate limit function before submitting a report
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-functions.js';

export async function checkRateLimit() {
  const functionsInstance = getFunctions();
  const rateLimit = httpsCallable(functionsInstance, 'rateLimitReport');
  try {
    await rateLimit();
    return true;
  } catch (error) {
    if (error.code === 'resource-exhausted') {
      alert('You have reached the maximum number of reports allowed per hour. Please try again later.');
      return false;
    } else {
      alert('Unable to verify report submission limit. Please try again later.');
      return false;
    }
  }
}
