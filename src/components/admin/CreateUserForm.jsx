import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNotification } from '../common/notification/useNotification';
import jurisdictions from '../../utils/jurisdictions.json';

const CreateUserForm = ({ onUserCreated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('authority');
  const [jurisdiction, setJurisdiction] = useState('');
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            jurisdiction,
          },
        },
      });

      if (error) {
        throw error;
      }

      addNotification({ message: 'User created successfully!', type: 'success' });
      onUserCreated(user);
      setEmail('');
      setPassword('');
      setJurisdiction('');
    } catch (error) {
      addNotification({ message: `Error creating user: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleCreateUser}>
      <h3>Create New User</h3>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="authority">Authority</option>
        </select>
      </div>
      <div>
        <label htmlFor="jurisdiction">Jurisdiction</label>
        <select
          id="jurisdiction"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.target.value)}
          required
        >
          <option value="">Select a jurisdiction</option>
          {jurisdictions.map((j) => (
            <option key={j.psgc_code} value={j.psgc_code}>
              {j.barangay}, {j.city}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};

export default CreateUserForm;