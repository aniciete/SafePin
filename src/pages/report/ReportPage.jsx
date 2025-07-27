import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useAuth } from '../../contexts/AuthContext';
import ReportForm from '../../components/report/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PATHS } from '../../utils/pathUtils';
import { MapProvider } from '../../contexts/MapContext'; // <-- IMPORT THE NEW PROVIDER

const ReportPage = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'admin') {
        navigate(PATHS.ADMIN_DASHBOARD, { replace: true });
      } else if (profile.role === 'authority') {
        navigate(PATHS.AUTHORITY_DASHBOARD, { replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  if (user) {
    return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}>
      {/* THIS IS THE FIX: Wrap the entire form context with the MapProvider */}
      <MapProvider>
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
      </MapProvider>
    </GoogleReCaptchaProvider>
  );
};

export default ReportPage;