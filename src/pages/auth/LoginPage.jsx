import LoginForm from '../../components/auth/LoginForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LoginPage = () => (
  <main className="flex items-center justify-center h-screen bg-background">
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Login to SafePin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>
    </Card>
  </main>
);

export default LoginPage;