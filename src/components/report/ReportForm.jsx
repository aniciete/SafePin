import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useNotification } from '../common/notification/useNotification';
import { uploadReportImage, createReport } from '../../services/report.service';
import { ImageOptimizer } from '../../utils/imageOptimizer';
import { sanitizeText } from '../../utils/security';
import MapView from '../map/MapView';

const ReportForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const { addNotification } = useNotification();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setTrackingCode(null);

    if (!executeRecaptcha) {
      addNotification({ message: 'reCAPTCHA not ready. Please try again.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const token = await executeRecaptcha('reportSubmission');
      const newTrackingCode = `SP-${Date.now()}`;
      const optimizedImage = await ImageOptimizer.optimizeImage(data.image[0]);
      const imagePath = await uploadReportImage(optimizedImage, newTrackingCode);
      
      const reportData = {
        incident_type: data.incidentType,
        severity: data.severity,
        description: sanitizeText(data.description),
        location: { lat: data.latitude, lng: data.longitude },
        image_path: imagePath,
        tracking_code: newTrackingCode,
      };

      await createReport(reportData, token);
      setTrackingCode(newTrackingCode);
      addNotification({ message: 'Report submitted successfully!', type: 'success' });
      reset();
    } catch (error) {
      addNotification({ message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = useCallback((location) => {
    setValue('latitude', location.lat, { shouldValidate: true });
    setValue('longitude', location.lng, { shouldValidate: true });
  }, [setValue]);

  return (
    <>
      {trackingCode && (
        <div>
          <h3>Report Submitted!</h3>
          <p>Your tracking code is: <strong>{trackingCode}</strong></p>
          <p>Please save this code to check the status of your report later.</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="incidentType">Incident Type</label>
        <select id="incidentType" {...register('incidentType', { required: true })}>
          <option value="">Select incident type</option>
          <option value="Theft">Theft</option>
          <option value="Assault">Assault</option>
          <option value="Vandalism">Vandalism</option>
          <option value="Harassment">Harassment</option>
          <option value="Robbery">Robbery</option>
          <option value="Burglary">Burglary</option>
          <option value="Fire">Fire</option>
          <option value="Medical Emergency">Medical Emergency</option>
          <option value="Suspicious Activity">Suspicious Activity</option>
          <option value="Environmental Hazard">Environmental Hazard</option>
          <option value="Road Accident">Road Accident</option>
          <option value="Other">Other</option>
        </select>
        {errors.incidentType && <p>This field is required</p>}
      </div>
      <div>
        <label htmlFor="severity">Severity Level</label>
        <select id="severity" {...register('severity', { required: true })}>
          <option value="">Select severity level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        {errors.severity && <p>This field is required</p>}
      </div>
      <div>
        <label>Location</label>
        <MapView onLocationSelect={handleLocationSelect} />
        <input type="hidden" {...register('latitude', { required: true })} />
        <input type="hidden" {...register('longitude', { required: true })} />
        {errors.latitude && <p>Please select a location on the map</p>}
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea id="description" {...register('description')} />
      </div>
      <div>
        <label htmlFor="image">Upload Image</label>
        <input type="file" id="image" {...register('image', { required: true })} />
        {errors.image && <p>This field is required</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
    </>
  );
};

export default ReportForm;