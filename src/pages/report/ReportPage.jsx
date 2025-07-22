import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ReportForm from '../../components/report/ReportForm';
import Card from '../../components/common/Card';

const ReportPage = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LdbX4orAAAAAIh8ham1lnIR8x6aB-rfV6dQNPpd">
    <main className="flex items-center justify-center py-12">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-8 dark:text-white">Report an Incident</h1>
        <ReportForm />
      </Card>
    </main>
  </GoogleReCaptchaProvider>
);

export default ReportPage;