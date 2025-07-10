// Client-side logic to call the rate limit function before submitting a report
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function checkRateLimit(userId) {
  try {
    const rateLimitRef = doc(window.db, 'rateLimits', userId);
    const docSnap = await getDoc(rateLimitRef);
    
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    
    let timestamps = [];
    if (docSnap.exists()) {
      timestamps = docSnap.data().timestamps || [];
      // Remove timestamps older than 1 hour
      timestamps = timestamps.filter(ts => ts > oneHourAgo);
    }

    if (timestamps.length >= 5) {
      alert('You have reached the maximum number of reports allowed per hour. Please try again later.');
      return false;
    }

    // Add current timestamp
    timestamps.push(now);
    await setDoc(rateLimitRef, { timestamps }, { merge: true });
    return true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    alert('Unable to verify report submission limit. Please try again later.');
    return false;
  }
}
