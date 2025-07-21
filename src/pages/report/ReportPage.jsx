import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ReportForm from '../../components/report/ReportForm';

const ReportPage = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LdbX4orAAAAAIh8ham1lnIR8x6aB-rfV6dQNPpd">
    <div>
      <h1>Report an Incident</h1>
      <ReportForm />
    </div>
  </GoogleReCaptchaProvider>
);

export default ReportPage;