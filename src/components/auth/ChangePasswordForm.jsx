import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

// Password validation function (can be moved to a shared utils file later)
const validatePassword = (password = '') => {
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain a number.';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain a special character.';
  return true;
};

const ChangePasswordForm = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    mode: 'onChange',
  });
  const [loading, setLoading] = useState(false);

  // Watch the value of the new password field to validate the confirmation field
  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your password has been updated successfully.',
      });
      reset(); // Clear the form fields on success
    } catch (error) {
      toast({
        title: 'Error updating password',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          {...register('newPassword', {
            required: 'New password is required',
            validate: validatePassword,
          })}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: value => value === newPassword || 'The passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;