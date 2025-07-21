import LoginForm from '../../components/auth/LoginForm';
import Card from '../../components/common/Card';

const LoginPage = () => (
  <main className="flex items-center justify-center h-screen bg-gray-100">
    <Card>
      <h1 className="text-2xl font-bold text-center mb-8">Login</h1>
      <LoginForm />
    </Card>
  </main>
);

export default LoginPage;