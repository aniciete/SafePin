import React, { useState } from 'react';
import { signUpWithEmail } from '../../services/auth.service';
import { useNotification } from '../common/notification/useNotification';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('regular');
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await signUpWithEmail(email, password, role);

    if (error) {
      addNotification({ message: error, type: 'error' });
    } else if (data.user) {
      addNotification({ message: 'Sign-up successful! You can now log in.', type: 'success' });
      // Handle successful sign-up, e.g., redirect to a different page
    } else {
      addNotification({ message: 'An unknown error occurred during sign-up.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="regular">User</option>
        <option value="authority">Authority</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpForm;