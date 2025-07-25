import { useState, useEffect } from 'react'; // Import useEffect
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
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const { login, profile } = useAuth(); // Get profile from the context
  const navigate = useNavigate();
  const { toast } = useToast();

  // This useEffect will run AFTER the login is successful and the context has been updated.
  // This is the key to fixing the redirect race condition.
  useEffect(() => {
    // Only navigate if we are in the process of submitting and a profile is now available.
    if (isSubmitting && profile) {
      if (profile.role === 'admin') {
        navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
      } else if (profile.role === 'authority') {
        navigate(PATHS.AUTHORITY_DASHBOARD, { replace: true });
      } else {
        navigate(PATHS.LANDING, { replace: true });
      }
      // Reset submitting state after navigation
      setIsSubmitting(false);
    }
  }, [profile, isSubmitting, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    try {
      // The login function now just triggers the auth event.
      // The useEffect above will handle the navigation.
      const { error } = await login(email, password);
      if (error) {
        throw error;
      }
      // Don't navigate here anymore.
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false); // Reset submitting state on error
    }
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