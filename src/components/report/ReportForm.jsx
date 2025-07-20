import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useNotification } from '../common/notification/useNotification';
import { uploadReportImage, createReport } from '../../services/report.service';
import MapView from '../map/MapView';

const ReportForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm();
  const { supabase } = useSupabase();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const imagePath = await uploadReportImage(data.image[0]);
      
      const reportData = {
        ...data,
        image_path: imagePath,
      };
      delete reportData.image;

      await createReport(reportData);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="incidentType">Incident Type</label>
        <select id="incidentType" {...register('incidentType', { required: true })}>
          <option value="">Select incident type</option>
          <option value="theft">Theft</option>
          <option value="harassment">Harassment</option>
          <option value="assault">Assault</option>
          <option value="vandalism">Vandalism</option>
          <option value="suspicious">Suspicious Activity</option>
          <option value="other">Other</option>
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
  );
};

export default ReportForm;