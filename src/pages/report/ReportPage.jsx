import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useAuth } from '../../contexts/AuthContext';
import ReportForm from '../../components/report/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PATHS } from '../../utils/pathUtils';

const ReportPage = () => {
  const { user, profile, loading } = useAuth(); // Import loading state
  const navigate = useNavigate();

  // This useEffect handles redirecting logged-in users away from the report page.
  useEffect(() => {
    // Only run the redirect logic after the initial auth state has been determined.
    if (!loading && user && profile) {
      if (profile.role === 'admin') {
        navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
      } else if (profile.role === 'authority') {
        navigate(PATHS.AUTHORITY_DASHBOARD, { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  // While the auth state is loading, we can show a simple loader or nothing
  // to prevent the form from flashing before a potential redirect.
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If the user is logged in but the redirect hasn't happened yet, we can also show a loader.
  if (user) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  // Only show the report page to anonymous users.
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      <main className="flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Report an Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportForm />
          </CardContent>
        </Card>
      </main>
    </GoogleReCaptchaProvider>
  );
};

export default ReportPage;