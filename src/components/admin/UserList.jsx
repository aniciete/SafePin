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
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Role</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Jurisdiction</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Created At</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
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
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">
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
                <td className="whitespace-nowrap px-4 py-2 text-gray-700">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-4 py-2 space-x-2">
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