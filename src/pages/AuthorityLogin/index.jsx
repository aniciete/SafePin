import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAuthority } from '../../services/auth';

const AuthorityLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    agencyId: '',
    badgeNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAuthority(formData.agencyId, formData.badgeNumber, formData.password);
      // Navigate to the page user tried to access, or authority dashboard
      const from = location.state?.from?.pathname || '/authority-dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authority Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your agency's SafePin dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="agencyId" className="sr-only">
                Agency ID
              </label>
              <input
                id="agencyId"
                name="agencyId"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Agency ID"
                value={formData.agencyId}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="badgeNumber" className="sr-only">
                Badge Number
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Badge Number"
                value={formData.badgeNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-sm text-center">
            <a href="#" className="font-medium text-green-600 hover:text-green-500">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthorityLogin; 