import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useAuth } from '../../contexts/AuthContext';
import ReportForm from '../../components/report/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PATHS } from '../../utils/pathUtils';

const ReportPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // THIS IS THE FIX: Redirect logged-in authority/admin users.
  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'admin') {
        navigate(PATHS.ADMIN_DASHBOARD);
      } else if (profile.role === 'authority') {
        navigate(PATHS.AUTHORITY_DASHBOARD);
      }
    }
  }, [user, profile, navigate]);

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdbX4orAAAAAIh8ham1lnIR8x6aB-rfV6dQNPpd">
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