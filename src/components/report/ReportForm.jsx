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
  const { register, handleSubmit, setValue, formState: { errors }, reset, control, trigger } = useForm({
    mode: 'onChange',
  });
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Submitting...');
  const [trackingCode, setTrackingCode] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageInfo({
        name: file.name,
        size: (file.size / 1024).toFixed(2) + ' KB',
      });
    } else {
      setImagePreview(null);
      setImageInfo(null);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['incidentType', 'severity'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['latitude', 'longitude'];
    }
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

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
      setLoadingMessage('Verifying reCAPTCHA...');
      const token = await executeRecaptcha('reportSubmission');
      
      const newTrackingCode = `SP-${Date.now()}`;
      let imagePath = null;

      if (data.image && data.image[0]) {
        setLoadingMessage('Optimizing image...');
        const optimizedImage = await ImageOptimizer.optimizeImage(data.image[0]);
        setLoadingMessage('Uploading image...');
        imagePath = await uploadReportImage(optimizedImage, newTrackingCode);
      }
      
      setLoadingMessage('Submitting report...');
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
      setCurrentStep(1);
      setImagePreview(null);
      setImageInfo(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setLoadingMessage('Submitting...');
    }
  };

  const handleLocationSelect = useCallback((location) => {
    setValue('latitude', location.lat, { shouldValidate: true });
    setValue('longitude', location.lng, { shouldValidate: true });
  }, [setValue]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode).then(() => {
      toast({ description: 'Tracking code copied to clipboard!' });
    });
  };

  const saveToLocalStorage = () => {
    const existingCodes = JSON.parse(localStorage.getItem('savedReportCodes')) || [];
    if (!existingCodes.includes(trackingCode)) {
      existingCodes.push(trackingCode);
      localStorage.setItem('savedReportCodes', JSON.stringify(existingCodes));
      toast({ description: 'Tracking code saved to this browser!' });
    } else {
      toast({ description: 'This tracking code is already saved.' });
    }
  };

  return (
    <>
      {trackingCode && (
        <div className="p-6 mb-4 text-center text-text-primary bg-primary-light rounded-lg shadow-md" role="alert">
          <h3 className="font-bold text-2xl">Report Submitted!</h3>
          <p className="my-2">Please save this tracking code to check the status of your report later.</p>
          <div className="bg-white p-3 my-4 rounded-md border border-primary">
            <strong className="text-xl font-mono">{trackingCode}</strong>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
            <Button onClick={saveToLocalStorage} variant="outline">Save for this Device</Button>
          </div>
        </div>
      )}
      {!trackingCode && <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Step 1: What Happened?</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
              <Label htmlFor="incidentType">Incident Type</Label>
              <Controller
                name="incidentType"
                control={control}
                rules={{ required: 'Incident type is required.' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger
                      id="incidentType"
                      aria-invalid={errors.incidentType ? 'true' : 'false'}
                      aria-describedby="incidentType-error"
                    >
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent side="bottom" sideOffset={4}>
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
              {errors.incidentType && <p id="incidentType-error" className="text-sm text-red-500">{errors.incidentType.message}</p>}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
              <Label htmlFor="severity">Severity Level</Label>
              <Controller
                name="severity"
                control={control}
                rules={{ required: 'Severity level is required.' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger
                      id="severity"
                      aria-invalid={errors.severity ? 'true' : 'false'}
                      aria-describedby="severity-error"
                    >
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent side="bottom" sideOffset={4}>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.severity && <p id="severity-error" className="text-sm text-red-500">{errors.severity.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Step 2: Where did it happen?</h3>
            <div className="grid w-full items-center gap-1.5">
              <Label>Pin the location on the map</Label>
              <div
                className="h-80 w-full rounded-lg overflow-hidden shadow-md"
                role="application"
                aria-describedby="location-error"
              >
                <MapView onLocationSelect={handleLocationSelect} />
              </div>
              <input type="hidden" {...register('latitude', { required: 'Please select a location.' })} />
              <input type="hidden" {...register('longitude', { required: 'Please select a location.' })} />
              {errors.latitude && <p id="location-error" className="text-sm text-red-500">{errors.latitude.message}</p>}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-center">Step 3: Details & Evidence</h3>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} placeholder="Provide a detailed description of the incident." />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">Upload Image (Optional)</Label>
              <Input type="file" id="image" {...register('image')} onChange={handleImageChange} />
              {imagePreview && (
                <div className="mt-4 p-2 border rounded-lg">
                  <img src={imagePreview} alt="Image preview" className="max-h-48 rounded-md mx-auto" />
                  <div className="text-xs text-gray-500 mt-2">
                    <p><strong>File:</strong> {imageInfo.name}</p>
                    <p><strong>Size:</strong> {imageInfo.size}</p>
                    <p className="text-blue-500">This image will be optimized for submission.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button type="button" onClick={prevStep} variant="outline">
              Back
            </Button>
          )}
          {currentStep < 3 && (
            <Button type="button" onClick={nextStep} className="ml-auto">
              Next
            </Button>
          )}
          {currentStep === 3 && (
            <Button type="submit" disabled={loading} className="w-full ml-auto">
              {loading ? loadingMessage : 'Submit Report'}
            </Button>
          )}
        </div>
      </form>}
    </>
  );
};

export default ReportForm;