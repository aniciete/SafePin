import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ReportForm from '../../components/report/ReportForm';

const ReportPage = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LdmQIkrAAAAADtB8zkTSO65qi8PmzksmDT8oQkI">
    <div>
      <h1>Report an Incident</h1>
      <ReportForm />
    </div>
  </GoogleReCaptchaProvider>
);

export default ReportPage;