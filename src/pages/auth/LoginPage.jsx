import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { PATHS } from '../../utils/pathUtils';

const LoginPage = () => (
  <main className="flex items-center justify-center h-screen">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <LoginForm />
    </div>
  </main>
);

export default LoginPage;