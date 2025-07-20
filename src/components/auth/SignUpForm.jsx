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
    try {
      await signUpWithEmail(email, password, role);
      addNotification({ message: 'Sign-up successful! Please check your email to verify your account.', type: 'success' });
      // Handle successful sign-up, e.g., redirect to a different page
    } catch (error) {
      addNotification({ message: error.message, type: 'error' });
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