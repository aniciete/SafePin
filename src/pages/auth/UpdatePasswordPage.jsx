import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const UpdatePasswordPage = () => {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'onChange' });
  const [loading, setLoading] = useState(false);
  
  const newPassword = watch('newPassword', '');

  const onSubmit = async ({ newPassword }) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({
        title: 'Success!',
        description: 'Your password has been updated. Please log in.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Update Your Password</CardTitle>
        <CardDescription className="text-center pt-2">
          Enter a new password for your account below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...register('newPassword', { required: 'New password is required' })} />
            {errors.newPassword && <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword', { required: 'Please confirm your password', validate: value => value === newPassword || 'Passwords do not match' })} />
            {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UpdatePasswordPage;