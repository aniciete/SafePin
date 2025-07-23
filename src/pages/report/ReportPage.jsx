import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ReportForm from '../../components/report/ReportForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ReportPage = () => (
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

export default ReportPage;