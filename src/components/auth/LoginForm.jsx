import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { PATHS } from '../../utils/pathUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // The login function now returns the profile directly.
      const { profile: loggedInProfile, error } = await login(email, password);
      
      if (error) {
        throw error;
      }
      
      // If we get a profile, we can navigate.
      if (loggedInProfile) {
        toast({ title: 'Success', description: 'Logged in successfully!' });
        if (loggedInProfile.role === 'admin') {
          navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
        } else if (loggedInProfile.role === 'authority') {
          navigate(PATHS.AUTHORITY_DASHBOARD, { replace: true });
        } else {
          navigate(PATHS.LANDING, { replace: true });
        }
      } else {
        // This handles the case where login succeeds but profile fetch fails.
        throw new Error('Login successful, but could not retrieve user profile.');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false); // Reset button on failure
    }
    // No need for a `finally` block, as we only want to reset the button on failure.
    // On success, the component will unmount anyway.
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </Button>
    </form>
  );
};

export default LoginForm;