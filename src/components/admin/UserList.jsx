import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSupabase } from '@/contexts/SupabaseContext';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { useToast } from '@/hooks/use-toast';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import { getJurisdictionNameByCode } from '../../utils/jurisdictionUtils';
import { formatDateTime, formatLabel } from '../../utils/formatUtils';
import { exportToCsv } from '../../utils/csvUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, UserX, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const UserTableRowSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
  </TableRow>
);

const UserList = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAllUsers(data || []);
    } catch (error) {
      toast({ title: 'Error fetching users', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const searchMatch = searchTerm.toLowerCase() === '' || user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return searchMatch && roleMatch;
    });
  }, [allUsers, searchTerm, roleFilter]);

  const handleDelete = async (userId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const supabaseAdmin = getSupabaseAdmin(session.access_token);
      const { error } = await supabaseAdmin.functions.invoke('delete-user', {
        body: JSON.stringify({ userId }),
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'User deleted successfully!' });
      fetchUsers();
    } catch (error) {
      toast({ title: 'Error deleting user', description: error.message, variant: 'destructive' });
    }
  };

  const handleExport = () => {
    if (filteredUsers.length > 0) {
      const exportData = filteredUsers.map(({ id, onboarding_completed, ...rest }) => ({
        ...rest,
        jurisdiction: getJurisdictionNameByCode(rest.jurisdiction),
        created_at: formatDateTime(rest.created_at),
      }));
      exportToCsv(exportData, `safepin-users-${new Date().toISOString().split('T')[0]}.csv`);
    } else {
      toast({
        title: 'No Data to Export',
        description: 'The current filtered list is empty.',
        variant: 'destructive',
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">Create, search, and manage user accounts.</p>
        </div>
        <Card>
          <CardHeader><CardTitle>Create a New User</CardTitle></CardHeader>
          <CardContent><CreateUserForm onUserCreated={fetchUsers} /></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>A list of all admin and authority accounts in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* --- THIS IS THE FIX: Make the filter/export bar responsive --- */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center md:justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                <Input 
                  type="text" 
                  placeholder="Search by email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-auto" 
                />
                <Select onValueChange={setRoleFilter} value={roleFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="authority">Authority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={handleExport} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {loading ? (
                    [...Array(5)].map((_, i) => <UserTableRowSkeleton key={i} />)
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        variants={itemVariants}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{formatLabel(user.role)}</TableCell>
                        <TableCell>{getJurisdictionNameByCode(user.jurisdiction)}</TableCell>
                        <TableCell>{formatDateTime(user.created_at)}</TableCell>
                        <TableCell className="text-right space-x-1">
                           <Button variant="ghost" size="icon" onClick={() => setEditingUser(user)}>
                              <Pencil className="h-4 w-4" />
                           </Button>
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button variant="ghost" size="icon" className="text-destructive hover:text-white">
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </DialogTrigger>
                             <DialogContent  className="text-foreground">
                               <DialogHeader><DialogTitle>Are you sure?</DialogTitle><DialogDescription>This will permanently delete the user account from the system.</DialogDescription></DialogHeader>
                               <DialogFooter>
                                 <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                 <Button variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                               </DialogFooter>
                             </DialogContent>
                           </Dialog>
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-center py-6">
                          <UserX className="h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-semibold">No Users Found</h3>
                          <p className="mt-1 text-sm text-muted-foreground">No users match your current search and filter criteria.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </motion.tbody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update the role and jurisdiction for {editingUser?.email}.
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <EditUserForm 
              user={editingUser} 
              onUserUpdated={() => {
                setEditingUser(null);
                fetchUsers();
              }}
              onCancel={() => setEditingUser(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserList;