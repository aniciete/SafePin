import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { getFormattedJurisdictions } from '../../utils/jurisdictionUtils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

const EditUserForm = ({ user, onUserUpdated, onCancel }) => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      role: user.role,
      jurisdiction: user.jurisdiction || '',
    }
  });
  const [loading, setLoading] = useState(false);

  const selectedRole = useWatch({ control, name: 'role' });
  const jurisdictionOptions = getFormattedJurisdictions();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('update-user', {
        body: {
          userId: user.id,
          role: data.role,
          jurisdiction: data.role === 'authority' ? data.jurisdiction : null,
        },
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'User updated successfully!' });
      onUserUpdated();
    } catch (error) {
      toast({ title: 'Error updating user', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-1.5">
        <Label className="text-foreground">Email (Read-only)</Label>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-foreground">Role</Label>
          <Controller name="role" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="role" className="text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authority">Authority</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}/>
        </div>
        {selectedRole === 'authority' && (
          <div className="space-y-1.5">
            <Label htmlFor="jurisdiction" className="text-foreground">Jurisdiction</Label>
            <Controller name="jurisdiction" control={control} rules={{ required: 'Jurisdiction is required' }} render={({ field }) => (
              <Combobox
                options={jurisdictionOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Jurisdiction..."
                searchPlaceholder="Search barangay or city..."
              />
            )}/>
            {errors.jurisdiction && <p className="text-sm text-destructive">{errors.jurisdiction.message}</p>}
          </div>
        )}
      </div>
      
      <DialogFooter className="pt-4">
        {/* --- FIX: Added text-foreground to the Cancel button --- */}
        <Button type="button" variant="ghost" onClick={onCancel} className="text-foreground">Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditUserForm;