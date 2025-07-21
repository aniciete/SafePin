import { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useToast } from '../../hooks/use-toast';
import CreateUserForm from './CreateUserForm';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '../common/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalTrigger,
} from '../common/Modal';

const UserList = ({ users, loading, fetchUsers }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [editedJurisdiction, setEditedJurisdiction] = useState('');
  const { toast } = useToast();

  const handleUserCreated = () => {
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'User deleted successfully!',
      });
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive',
      });
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

      toast({
        title: 'Success',
        description: 'User updated successfully!',
      });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <CreateUserForm onUserCreated={handleUserCreated} />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurisdiction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <Select onValueChange={setEditedRole} defaultValue={editedRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authority">Authority</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUser === user.id ? (
                    <Select onValueChange={setEditedJurisdiction} defaultValue={editedJurisdiction}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a jurisdiction" />
                      </SelectTrigger>
                      <SelectContent>
                        {jurisdictions.map((j) => (
                          <SelectItem key={j.psgc_code} value={j.psgc_code}>
                            {j.barangay}, {j.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    user.jurisdiction || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  {editingUser === user.id ? (
                    <>
                      <Button onClick={() => handleSave(user.id)} variant="success">Save</Button>
                      <Button onClick={handleCancel} variant="tertiary">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(user)} variant="secondary">Edit</Button>
                      <Modal>
                        <ModalTrigger asChild>
                          <Button variant="warning">Delete</Button>
                        </ModalTrigger>
                        <ModalContent>
                          <ModalHeader>
                            <ModalTitle>Are you sure?</ModalTitle>
                            <ModalDescription>
                              This action cannot be undone. This will permanently delete the user account.
                            </ModalDescription>
                          </ModalHeader>
                          <ModalFooter>
                            <Button variant="tertiary" onClick={() => document.querySelector('[data-state="open"] button[aria-label="Close"]')?.click()}>Cancel</Button>
                            <Button variant="warning" onClick={() => handleDelete(user.id)}>Delete</Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;