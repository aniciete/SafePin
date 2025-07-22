import { useState, useEffect } from 'react';
import { useSupabase } from '../../contexts/SupabaseContext';
import UserListItemSkeleton from './UserListItemSkeleton';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from './CreateUserForm';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

const UserList = () => {
  const { supabase } = useSupabase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editedRole, setEditedRole] = useState('');
  const [editedJurisdiction, setEditedJurisdiction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('users').select('*').order('created_at', { ascending: false });
      if (searchTerm) query = query.ilike('email', `%${searchTerm}%`);
      if (roleFilter && roleFilter !== 'all') query = query.eq('role', roleFilter);
      const { data, error } = await query;
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const handleUserCreated = () => fetchUsers();

  const handleDelete = async (userId) => {
    try {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
      toast({ title: 'Success', description: 'User deleted successfully!' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error deleting user', description: error.message, variant: 'destructive' });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedRole(user.role);
    setEditedJurisdiction(user.jurisdiction || '');
  };

  const handleCancel = () => setEditingUser(null);

  const handleSave = async (userId) => {
    try {
      // Enforce business logic: Admins CANNOT have a jurisdiction.
      const jurisdictionToSave = editedRole === 'admin' ? null : editedJurisdiction;

      if (editedRole === 'authority' && !jurisdictionToSave) {
        toast({ title: 'Validation Error', description: 'An authority user must have a jurisdiction.', variant: 'destructive' });
        return;
      }
      
      const { error } = await supabase
        .from('users')
        .update({ role: editedRole, jurisdiction: jurisdictionToSave })
        .eq('id', userId);

      if (error) throw error;
      toast({ title: 'Success', description: 'User updated successfully!' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error updating user', description: error.message, variant: 'destructive' });
    }
  };
  
  const getJurisdictionName = (code) => {
    if (!code) return 'N/A';
    const match = jurisdictions.find(j => j.psgc_code === code);
    return match ? `${match.barangay}, ${match.city}` : code;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full"><tbody>{[...Array(5)].map((_, index) => <UserListItemSkeleton key={index} />)}</tbody></table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <CreateUserForm onUserCreated={handleUserCreated} />
      <div className="flex items-center space-x-4">
        <Input type="text" placeholder="Search by email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-1/3" />
        <Select onValueChange={setRoleFilter} defaultValue={roleFilter}>
          <SelectTrigger><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="authority">Authority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Jurisdiction</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Created At</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50">
                <td className="px-4 py-2 font-medium">{user.email}</td>
                <td className="px-4 py-2">
                  {editingUser === user.id ? (
                    <Select onValueChange={setEditedRole} defaultValue={editedRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authority">Authority</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : ( user.role )}
                </td>
                <td className="px-4 py-2">
                  {/* THIS IS THE FIX: Only show dropdown for authorities during edit */}
                  {editingUser === user.id ? (
                    editedRole === 'authority' ? (
                      <Select onValueChange={setEditedJurisdiction} defaultValue={editedJurisdiction}>
                        <SelectTrigger><SelectValue placeholder="Select a jurisdiction" /></SelectTrigger>
                        <SelectContent>
                          {jurisdictions.map((j) => (
                            <SelectItem key={j.psgc_code} value={j.psgc_code}>
                              {j.barangay}, {j.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : ( <span className="text-muted-foreground">N/A</span> )
                  ) : ( getJurisdictionName(user.jurisdiction) )}
                </td>
                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2 space-x-2">
                  {editingUser === user.id ? (
                    <>
                      <Button onClick={() => handleSave(user.id)} size="sm">Save</Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(user)} variant="secondary" size="sm">Edit</Button>
                      <Dialog>
                        <DialogTrigger asChild><Button variant="destructive" size="sm">Delete</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>This action will permanently delete the user account.</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                            <Button variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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