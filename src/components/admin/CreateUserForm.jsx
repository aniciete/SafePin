import { useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useToast } from '../../hooks/use-toast';
import jurisdictions from '../../utils/jurisdictions.json';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Label } from '../common/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select';

const CreateUserForm = ({ onUserCreated }) => {
  const { supabase } = useSupabase();
  const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const selectedRole = useWatch({
    control,
    name: 'role',
    defaultValue: 'authority'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { data: functionData, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: data.email,
          password: data.password,
          role: data.role,
          jurisdiction: data.jurisdiction,
        },
      });

      if (error) {
        throw error;
      }

      if (functionData.error) {
        throw new Error(functionData.error);
      }

      toast({
        title: 'Success',
        description: 'User created successfully!',
      });
      reset();
      if (onUserCreated) {
        onUserCreated();
      }
      await supabase.auth.refreshSession();
    } catch (error) {
      toast({
        title: 'Error creating user',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Create New User</h3>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" {...register('email', { required: true })} />
        {errors.email && <p className="text-sm text-red-500">Email is required</p>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Password" {...register('password', { required: true, minLength: 8 })} />
        {errors.password && <p className="text-sm text-red-500">Password must be at least 8 characters</p>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="role">Role</Label>
        <Controller
          name="role"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="authority">Authority</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && <p className="text-sm text-red-500">Role is required</p>}
      </div>

      {selectedRole === 'authority' && (
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="jurisdiction">Jurisdiction</Label>
          <Controller
            name="jurisdiction"
            control={control}
            rules={{ required: selectedRole === 'authority' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  {jurisdictions.map((j) => (
                    <SelectItem key={j.psgc_code} value={j.psgc_code}>
                      {j.barangay}, {j.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.jurisdiction && <p className="text-sm text-red-500">Jurisdiction is required</p>}
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};

export default CreateUserForm;