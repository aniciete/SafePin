import { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useToast } from '../../hooks/use-toast';
import { uploadReportImage, createReport } from '../../services/report.service';
import { ImageOptimizer } from '../../utils/imageOptimizer';
import { validateText } from '../../utils/validation';
import MapView from '../map/MapView';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Label } from '../common/Label';
import { Textarea } from '../common/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../common/Select';

const ReportForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset, control } = useForm();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState(null);

  const onSubmit = async (data) => {
    setLoading(true);
    setTrackingCode(null);

    if (!executeRecaptcha) {
      toast({
        title: 'Error',
        description: 'reCAPTCHA not ready. Please try again.',
        variant: 'destructive',
      });
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
        description: validateText(data.description).value,
        location: { lat: data.latitude, lng: data.longitude },
        image_path: imagePath,
        tracking_code: newTrackingCode,
      };

      await createReport(reportData, token);
      setTrackingCode(newTrackingCode);
      toast({
        title: 'Success',
        description: 'Report submitted successfully!',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          <h3 className="font-bold">Report Submitted!</h3>
          <p>Your tracking code is: <strong>{trackingCode}</strong></p>
          <p>Please save this code to check the status of your report later.</p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="incidentType">Incident Type</Label>
          <Controller
            name="incidentType"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Theft">Theft</SelectItem>
                  <SelectItem value="Assault">Assault</SelectItem>
                  <SelectItem value="Vandalism">Vandalism</SelectItem>
                  <SelectItem value="Harassment">Harassment</SelectItem>
                  <SelectItem value="Robbery">Robbery</SelectItem>
                  <SelectItem value="Burglary">Burglary</SelectItem>
                  <SelectItem value="Fire">Fire</SelectItem>
                  <SelectItem value="Medical Emergency">Medical Emergency</SelectItem>
                  <SelectItem value="Suspicious Activity">Suspicious Activity</SelectItem>
                  <SelectItem value="Environmental Hazard">Environmental Hazard</SelectItem>
                  <SelectItem value="Road Accident">Road Accident</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.incidentType && <p className="text-sm text-red-500">This field is required</p>}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="severity">Severity Level</Label>
          <Controller
            name="severity"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.severity && <p className="text-sm text-red-500">This field is required</p>}
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label>Location</Label>
          <div className="h-64 w-full">
            <MapView onLocationSelect={handleLocationSelect} />
          </div>
          <input type="hidden" {...register('latitude', { required: true })} />
          <input type="hidden" {...register('longitude', { required: true })} />
          {errors.latitude && <p className="text-sm text-red-500">Please select a location on the map</p>}
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">Upload Image</Label>
          <Input type="file" id="image" {...register('image', { required: true })} />
          {errors.image && <p className="text-sm text-red-500">This field is required</p>}
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </form>
    </>
  );
};

export default ReportForm;