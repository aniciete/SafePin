import { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import UserListItemSkeleton from './UserListItemSkeleton';
import { useToast } from '../../hooks/use-toast';
import CreateUserForm from './CreateUserForm';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [editedJurisdiction, setEditedJurisdiction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('users').select('*, user_profiles(last_login)');

      if (searchTerm) {
        query = query.ilike('email', `%${searchTerm}%`);
      }

      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

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
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="overflow-x-auto rounded-lg border-border">
          <table className="min-w-full divide-y-2 divide-border bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Email</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Role</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Jurisdiction</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Created At</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Last Login</th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <UserListItemSkeleton key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <CreateUserForm onUserCreated={handleUserCreated} />
      <div className="flex items-center space-x-4">
        <Input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select onValueChange={setRoleFilter} value={roleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="authority">Authority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-lg border-border">
        <table className="min-w-full divide-y-2 divide-border bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Email</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Role</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Jurisdiction</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Created At</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Last Login</th>
              <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-4 py-2 font-medium text-text-primary">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-2 text-text-secondary">
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
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-neutral-300">
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
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-neutral-300">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="whitespace-nowrap px-4 py-2 text-gray-700 dark:text-neutral-300">
                  {user.user_profiles?.last_login ? new Date(user.user_profiles.last_login).toLocaleString() : 'N/A'}
                </td>
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