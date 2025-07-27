import LoginForm from '../../components/auth/LoginForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LoginPage = () => (
  // The main container is no longer needed as the AuthLayout handles centering
  <Card className="w-full max-w-sm border-border/60 bg-card/80 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-center">
        SafePin Authorized Login
      </CardTitle>
    </CardHeader>
    <CardContent>
      <LoginForm />
    </CardContent>
  </Card>
);

export default LoginPage;