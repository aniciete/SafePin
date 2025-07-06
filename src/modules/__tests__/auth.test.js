/** Example unit test for auth.js */
import { login } from '../auth';

test('login fails with wrong password', async () => {
  await expect(login('user', 'wrongpass')).rejects.toThrow();
});
