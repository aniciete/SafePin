import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useSupabase } from '../../contexts/SupabaseContext'; // <-- Use the STANDARD client
import { useToast } from '@/hooks/use-toast';
import { getFormattedJurisdictions } from '../../utils/jurisdictionUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Loader2 } from 'lucide-react';

const validatePassword = (password = '') => {
  const errors = [];
  if (password.length < 8) errors.push("be at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("contain an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("contain a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("contain a number");
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("contain a special character");
  if (errors.length === 0) return true;
  let errorMessage = "Password must ";
  if (errors.length > 2) {
    const firstErrors = errors.slice(0, errors.length - 1).join(', ');
    const lastError = errors[errors.length - 1];
    errorMessage += `${firstErrors}, and ${lastError}.`;
  } else if (errors.length === 2) {
    errorMessage += `${errors[0]} and ${errors[1]}.`;
  } else {
    errorMessage += `${errors[0]}.`;
  }
  return errorMessage;
};

const CreateUserForm = ({ onUserCreated }) => {
  const { supabase } = useSupabase(); // Use the standard, shared Supabase client
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
    mode: 'onChange',
    defaultValues: { role: 'authority', jurisdiction: '', password: '' }
  });
  const [loading, setLoading] = useState(false);
  const selectedRole = useWatch({ control, name: 'role' });
  const jurisdictionOptions = getFormattedJurisdictions();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: functionData, error } = await supabase.functions.invoke('create-user', {
        // THE FIX: Explicitly stringify the body.
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: data.role,
          jurisdiction: data.role === 'authority' ? data.jurisdiction : null,
        }),
      });

      if (error) throw error;
      if (functionData.error) throw new Error(functionData.error);

      toast({ title: 'Success', description: 'User created successfully!' });
      reset();
      if (onUserCreated) onUserCreated();
    } catch (error) {
      toast({ title: 'Error creating user', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
          <Input id="email" type="email" placeholder="user@example.com" {...register('email', { required: 'Email is required' })} />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••" 
            {...register('password', { 
              required: 'Password is required', 
              validate: validatePassword
            })} 
          />
          {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
          <Controller name="role" control={control} rules={{ required: 'Role is required' }} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="role"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="authority">Authority</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}/>
          {errors.role && <p className="text-sm text-destructive mt-1">{errors.role.message}</p>}
        </div>
        {selectedRole === 'authority' && (
          <div className="space-y-1.5">
            <Label htmlFor="jurisdiction">Jurisdiction <span className="text-destructive">*</span></Label>
            <Controller name="jurisdiction" control={control} rules={{ required: 'Jurisdiction is required for authorities' }} render={({ field }) => (
              <Combobox
                options={jurisdictionOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select Jurisdiction..."
                searchPlaceholder="Search barangay or city..."
              />
            )}/>
            {errors.jurisdiction && <p className="text-sm text-destructive mt-1">{errors.jurisdiction.message}</p>}
          </div>
        )}
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default CreateUserForm;