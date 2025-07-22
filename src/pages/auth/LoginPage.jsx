import LoginForm from '../../components/auth/LoginForm';
import Card from '../../components/common/Card';

const LoginPage = () => (
  <main className="flex items-center justify-center h-screen bg-background">
    <Card>
      <h1 className="text-3xl font-bold text-center mb-8 text-text-primary dark:text-white">
        Login to SafePin
      </h1>
      <LoginForm />
    </Card>
  </main>
);

export default LoginPage;