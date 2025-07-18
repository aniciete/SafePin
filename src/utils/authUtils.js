import { initSessionManagement } from './sessionManager.js';
import { showAuthFeedback } from './ui.js';
import { supabase } from '../config/supabase.js';

/**
 * Add auth state observer
 * @param {Function} callback - Callback function
 */
export function observeAuthState(callback) {
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      showAuthFeedback(`Welcome back, ${session.user.email}!`, 'success');
      initSessionManagement(session);
    }
    callback(event, session);
  });
  return authListener;
}
