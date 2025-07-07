/** Example unit test for auth.js */
import { 
    signUpWithEmail, 
    signInWithEmail, 
    signInWithGoogle, 
    signOutUser 
} from '../../services/auth.service.js';
import { auth } from '../../config/firebase.js';

test('login fails with wrong password', async () => {
  await expect(login('user', 'wrongpass')).rejects.toThrow();
});
