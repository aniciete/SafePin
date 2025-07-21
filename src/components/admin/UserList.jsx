import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNotification } from '../common/notification/useNotification';
import CreateUserForm from './CreateUserForm';
import jurisdictions from '../../utils/jurisdictions.json';

const UserList = ({ users, loading, fetchUsers }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [editedJurisdiction, setEditedJurisdiction] = useState('');
  const { addNotification } = useNotification();

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const { error } = await supabase.from('users').delete().eq('id', userId);
        if (error) throw error;
        addNotification({ message: 'User deleted successfully!', type: 'success' });
        fetchUsers();
      } catch (error) {
        addNotification({ message: `Error deleting user: ${error.message}`, type: 'error' });
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedRole(user.role);
    setEditedJurisdiction(user.jurisdiction || '');
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleSave = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: editedRole, jurisdiction: editedJurisdiction })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      addNotification({ message: 'User updated successfully!', type: 'success' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      addNotification({ message: `Error updating user: ${error.message}`, type: 'error' });
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <CreateUserForm onUserCreated={handleUserCreated} />
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Jurisdiction</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                {editingUser === user.id ? (
                  <select value={editedRole} onChange={(e) => setEditedRole(e.target.value)}>
                    <option value="authority">Authority</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUser === user.id ? (
                  <select value={editedJurisdiction} onChange={(e) => setEditedJurisdiction(e.target.value)}>
                    <option value="">Select a jurisdiction</option>
                    {jurisdictions.map((j) => (
                      <option key={j.psgc_code} value={j.psgc_code}>
                        {j.barangay}, {j.city}
                      </option>
                    ))}
                  </select>
                ) : (
                  user.jurisdiction || 'N/A'
                )}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                {editingUser === user.id ? (
                  <>
                    <button onClick={() => handleSave(user.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;