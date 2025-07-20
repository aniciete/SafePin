import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { PATHS } from '../../utils/pathUtils';

const LoginPage = () => (
  <div>
    <h1>Login</h1>
    <LoginForm />
  </div>
);

export default LoginPage;