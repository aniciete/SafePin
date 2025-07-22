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
import Card from '../common/Card';

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
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium text-center">Create New User</h3>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            {...register('email', { required: 'Email is required' })}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="email-error"
          />
          {errors.email && <p id="email-error" className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby="password-error"
          />
          {errors.password && <p id="password-error" className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="role">Role</Label>
          <Controller
            name="role"
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger
                  id="role"
                  aria-invalid={errors.role ? 'true' : 'false'}
                  aria-describedby="role-error"
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authority">Authority</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <p id="role-error" className="text-sm text-red-500">{errors.role.message}</p>}
        </div>

        {selectedRole === 'authority' && (
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="jurisdiction">Jurisdiction</Label>
            <Controller
              name="jurisdiction"
              control={control}
              rules={{ required: selectedRole === 'authority' ? 'Jurisdiction is required for authorities' : false }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger
                    id="jurisdiction"
                    aria-invalid={errors.jurisdiction ? 'true' : 'false'}
                    aria-describedby="jurisdiction-error"
                  >
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
            {errors.jurisdiction && <p id="jurisdiction-error" className="text-sm text-red-500">{errors.jurisdiction.message}</p>}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </Card>
  );
};

export default CreateUserForm;