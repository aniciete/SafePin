import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useToast } from '@/hooks/use-toast';
import { uploadReportImage, createReport } from '../../services/report.service';
import { ImageOptimizer } from '../../utils/imageOptimizer';
import { validateText } from '../../utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressSearchInput from './AddressSearchInput';
import { motion, AnimatePresence } from 'framer-motion';

const ReportForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset, control, trigger, watch } = useForm({
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

  // Watch for location changes to enable/disable the "Next" button
  const latitude = watch('latitude');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageInfo({ name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' });
    } else {
      setImagePreview(null);
      setImageInfo(null);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    switch (currentStep) {
      case 1: fieldsToValidate = ['incidentType', 'severity']; break;
      case 2: fieldsToValidate = ['latitude', 'longitude']; break;
      default: break;
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
      toast({ title: 'Error', description: 'reCAPTCHA not ready.', variant: 'destructive' });
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
        jurisdiction: data.jurisdiction,
      };

      await createReport(reportData, token);
      setTrackingCode(newTrackingCode);
      toast({ title: 'Success', description: 'Report submitted successfully!' });
      reset();
      setCurrentStep(1);
      setImagePreview(null);
      setImageInfo(null);
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
      setLoadingMessage('Submitting...');
    }
  };

  const handleLocationChange = (location) => {
    setValue('latitude', location.lat, { shouldValidate: true });
    setValue('longitude', location.lng, { shouldValidate: true });
    setValue('jurisdiction', location.jurisdiction, { shouldValidate: true });
  };

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Step 1: What Happened?</h3>
                <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
                  <Label htmlFor="incidentType">Incident Type</Label>
              <Controller name="incidentType" control={control} rules={{ required: 'Incident type is required.' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="incidentType" aria-invalid={errors.incidentType ? 'true' : 'false'}>
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
              {errors.incidentType && <p className="text-sm text-red-500">{errors.incidentType.message}</p>}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
              <Label htmlFor="severity">Severity Level</Label>
              <Controller name="severity" control={control} rules={{ required: 'Severity level is required.' }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="severity" aria-invalid={errors.severity ? 'true' : 'false'}>
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
              {errors.severity && <p className="text-sm text-red-500">{errors.severity.message}</p>}
            </div>
          </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center">Step 2: Where did it happen?</h3>
                <AddressSearchInput onLocationChange={handleLocationChange} />
            <input type="hidden" {...register('latitude', { required: 'A valid location in Metro Manila is required.' })} />
            <input type="hidden" {...register('longitude', { required: 'A valid location in Metro Manila is required.' })} />
            <input type="hidden" {...register('jurisdiction')} />
            {errors.latitude && <p className="text-sm text-red-500 text-center">{errors.latitude.message}</p>}
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
              <Input type="file" id="image" {...register('image')} onChange={handleImageChange} accept="image/*" />
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    className="mt-4 p-2 border rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <img src={imagePreview} alt="Image preview" className="max-h-48 rounded-md mx-auto" />
                    <div className="text-xs text-gray-500 mt-2">
                      <p><strong>File:</strong> {imageInfo.name}</p>
                      <p><strong>Size:</strong> {imageInfo.size}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (<Button type="button" onClick={prevStep} variant="outline">Back</Button>)}
          
          {currentStep < 3 && (
            <Button
              type="button"
              onClick={nextStep}
              className="ml-auto"
              disabled={currentStep === 2 && !latitude}
            >
              Next
            </Button>
          )}
          
          {currentStep === 3 && (<Button type="submit" disabled={loading} className="w-full ml-auto">{loading ? loadingMessage : 'Submit Report'}</Button>)}
        </div>
      </form>}
    </>
  );
};

export default ReportForm;