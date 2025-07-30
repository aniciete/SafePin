import { useState, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useToast } from '@/hooks/use-toast';
import { useSupabase } from '../../contexts/SupabaseContext';
import { uploadReportImage, createReport } from '../../services/report.service';
import { ImageOptimizer } from '../../utils/imageOptimizer';
import { validateText } from '../../utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AddressSearchInput from './AddressSearchInput';
import { Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

const Step1Fields = ({ control, register, errors, incidentTypeSelection }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-center">Step 1: What Happened?</h3>
    <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
      <Label htmlFor="incidentType">Incident Type <span className="text-destructive">*</span></Label>
      <Controller name="incidentType" control={control} rules={{ required: 'Incident type is required.' }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <SelectTrigger id="incidentType"><SelectValue placeholder="Select incident type" /></SelectTrigger>
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
      {errors.incidentType && <p className="text-sm text-destructive">{errors.incidentType.message}</p>}
    </div>
    <AnimatePresence>
      {incidentTypeSelection === 'Other' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid w-full max-w-sm items-center gap-1.5 mx-auto overflow-hidden">
          <Label htmlFor="incidentTypeOther">Please Specify <span className="text-destructive">*</span></Label>
          <Input id="incidentTypeOther" placeholder="e.g., Noise Complaint" {...register('incidentTypeOther', { required: "Please specify the incident type." })} />
          {errors.incidentTypeOther && <p className="text-sm text-destructive">{errors.incidentTypeOther.message}</p>}
        </motion.div>
      )}
    </AnimatePresence>
    <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
      <Label htmlFor="severity">Severity Level <span className="text-destructive">*</span></Label>
      <Controller name="severity" control={control} rules={{ required: 'Severity level is required.' }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value || ''}>
            <SelectTrigger id="severity"><SelectValue placeholder="Select severity level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors.severity && <p className="text-sm text-destructive">{errors.severity.message}</p>}
    </div>
    <p className="text-xs text-muted-foreground text-center pt-2">* Required field</p>
  </div>
);

const Step2Fields = ({ register, errors, onLocationChange }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-center">Step 2: Where did it happen? <span className="text-destructive">*</span></h3>
    <AddressSearchInput onLocationChange={onLocationChange} />
    {/* Hidden inputs are still needed for react-hook-form to track the values */}
    <input type="hidden" {...register('latitude', { required: 'A valid location in Metro Manila is required.' })} />
    <input type="hidden" {...register('longitude', { required: 'A valid location in Metro Manila is required.' })} />
    {errors.latitude && <p className="text-sm text-destructive text-center">{errors.latitude.message}</p>}
    <p className="text-xs text-muted-foreground text-center pt-2">* Required field</p>
  </div>
);

const Step3Fields = ({ control, register, errors, imageInfo, imagePreview, handleImageChange, handleRemoveImage, imageInputRef }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-center">Step 3: Details & Evidence</h3>
    <div className="grid w-full gap-1.5">
      <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
      <Textarea id="description" {...register('description', { required: 'A detailed description is required.' })} placeholder="Provide as much detail as possible..." />
      {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
    </div>
    <div className="grid w-full gap-1.5">
      <Label htmlFor="contactInfo">Contact Info</Label>
      <Input type="text" id="contactInfo" {...register('contactInfo')} placeholder="Email or phone number" className="border-dashed" />
      <p className="text-xs text-muted-foreground">For follow-up questions from authorities. Stays confidential.</p>
    </div>
    <div className="grid w-full gap-1.5">
      <Label htmlFor="image">Attach an Image</Label>
      <Label htmlFor="image" className="relative flex items-center gap-2 h-10 w-full rounded-md border border-dashed border-secondary bg-secondary/10 px-3 py-2 text-sm text-foreground ring-offset-background cursor-pointer transition-colors hover:bg-secondary/20">
        <Paperclip className="h-4 w-4" />
        <span>{imageInfo ? imageInfo.name : 'Choose a file...'}</span>
      </Label>
      <Controller
        name="image"
        control={control}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <Input
            type="file"
            id="image"
            onBlur={onBlur}
            name={name}
            ref={ref}
            onChange={(e) => {
              onChange(e.target.files);
              handleImageChange(e);
            }}
            accept="image/*"
            className="sr-only"
          />
        )}
      />
    </div>
    <AnimatePresence>
      {imagePreview && (
        <motion.div className="mt-4 p-2 border rounded-lg" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
          <img src={imagePreview} alt="Image preview" className="max-h-48 w-full object-contain rounded-md mx-auto" />
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <p><strong>Size:</strong> {imageInfo.size}</p>
            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} className="text-destructive hover:text-destructive">
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    <p className="text-xs text-muted-foreground pt-2">* Required field</p>
  </div>
);

const ReportForm = () => {
  const { register, handleSubmit, setValue, formState: { errors }, reset, control, trigger, watch } = useForm({
    mode: 'onSubmit',
    defaultValues: { description: '', incidentType: '', severity: '', latitude: null }
  });
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Submitting...');
  const [trackingCode, setTrackingCode] = useState(null);
  const [[currentStep, direction], setCurrentStep] = useState([1, 0]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const imageInputRef = useRef(null);
  const latitude = watch('latitude');
  const incidentTypeSelection = watch('incidentType');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageInfo({ name: file.name, size: (file.size / 1024).toFixed(2) + ' KB' });
    } else {
      handleRemoveImage();
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageInfo(null);
    setValue('image', null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const validateStep = async (step) => {
    let fieldsToValidate = [];
    switch (step) {
      case 1:
        fieldsToValidate = ['incidentType', 'severity'];
        if (watch('incidentType') === 'Other') {
          fieldsToValidate.push('incidentTypeOther');
        }
        break;
      case 2:
        fieldsToValidate = ['latitude', 'longitude'];
        break;
      default:
        return true;
    }
    return await trigger(fieldsToValidate);
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      setCurrentStep([currentStep + 1, 1]);
    }
  };

  const prevStep = () => {
    if (currentStep === 3) {
      setValue('latitude', null, { shouldValidate: true });
      setValue('longitude', null, { shouldValidate: true });
    }
    setCurrentStep([currentStep - 1, -1]);
  };

  const onSubmit = async (data) => {
    console.log('onSubmit triggered. Form data:', data);
    if (!supabase) return;
    setIsSubmitting(true);
    setTrackingCode(null);
    if (!executeRecaptcha) {
      toast({ title: 'Error', description: 'reCAPTCHA not ready.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    try {
      setLoadingMessage('Verifying reCAPTCHA...');
      const token = await executeRecaptcha('reportSubmission');
      const newTrackingCode = `SP-${Date.now()}`;
      let imagePath = null;
      if (data.image && data.image[0]) {
        console.log('Starting image upload...');
        setLoadingMessage('Optimizing image...');
        const optimizedImage = await ImageOptimizer.optimizeImage(data.image[0]);
        setLoadingMessage('Uploading image...');
        imagePath = await uploadReportImage(supabase, optimizedImage);
        console.log('Image upload finished. Path:', imagePath);
      }
      setLoadingMessage('Submitting report...');
      const reportData = {
        incident_type: data.incidentType,
        incident_type_other: data.incidentType === 'Other' ? data.incidentTypeOther : null,
        severity: data.severity,
        description: validateText(data.description).value,
        location: { lat: data.latitude, lng: data.longitude },
        image_url: imagePath,
        tracking_code: newTrackingCode,
        contact_info: data.contactInfo ? validateText(data.contactInfo, { required: false }).value : null,
      };
      await createReport(supabase, reportData, token);
      setTrackingCode(newTrackingCode);
      toast({ title: 'Success', description: 'Report submitted successfully!' });
      reset();
      setCurrentStep([1, 0]);
      handleRemoveImage();
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
      setLoadingMessage('Submitting...');
    }
  };

  const handleLocationChange = useCallback((location) => {
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
        <div className="p-6 text-center text-card-foreground bg-primary/10 rounded-lg shadow-md">
          <h3 className="font-bold text-2xl">Report Submitted!</h3>
          <p className="my-2">Please save this tracking code to check the status of your report later.</p>
          <div className="bg-background p-3 my-4 rounded-md border border-primary">
            <strong className="text-xl font-mono">{trackingCode}</strong>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
            <Button onClick={saveToLocalStorage} variant="outline">Save for this Device</Button>
          </div>
        </div>
      )}
      {!trackingCode && (
        <div className="flex flex-col space-y-6">
          <form id="report-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={formVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="w-full"
                >
                  {currentStep === 1 && <Step1Fields {...{control, register, errors, incidentTypeSelection}} />}
                  {currentStep === 2 && <Step2Fields {...{register, errors, onLocationChange: handleLocationChange}} />}
                  {currentStep === 3 && <Step3Fields {...{control, register, errors, imageInfo, imagePreview, handleImageChange, handleRemoveImage, imageInputRef}} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </form>

          <div className="flex justify-between items-center pt-4">
            {currentStep > 1 ? (<Button type="button" onClick={prevStep} variant="outline">Back</Button>) : <div />}
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep} disabled={currentStep === 2 && !latitude}>Next</Button>
            ) : (
              <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                {isSubmitting ? loadingMessage : 'Submit Report'}
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportForm;