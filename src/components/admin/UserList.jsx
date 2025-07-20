import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { useNotification } from '../common/notification/useNotification';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');

        if (error) {
          throw error;
        }
        setUsers(data);
      } catch (error) {
        addNotification({ message: `Error fetching users: ${error.message}`, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [addNotification]);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Jurisdiction</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.jurisdiction || 'N/A'}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;