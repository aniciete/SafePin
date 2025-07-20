import React from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../../components/auth/SignUpForm';
import { PATHS } from '../../utils/pathUtils';

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
      <p>
        Already have an account? <Link to={PATHS.LOGIN}>Login</Link>
      </p>
    </div>
  );
};

export default SignUpPage;