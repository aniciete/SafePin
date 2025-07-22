import { supabase } from '../config/supabase.js';

/**
 * Fetches all reports from the database.
 * RLS is expected to handle filtering by jurisdiction.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of reports.
 */
export const getReports = async () => {
  const { data, error } = await supabase.from('reports').select('*');

  if (error) {
    console.error('Error fetching reports:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Uploads an image to Supabase Storage.
 * @param {File} file The image file to upload.
 * @param {string} trackingCode The tracking code to use as the image name.
 * @returns {Promise<string>} The path of the uploaded image.
 */
export const uploadReportImage = async (file, trackingCode) => {
  if (!file) {
    throw new Error('No image file provided.');
  }

  const fileExt = file.type.split('/')[1];
  const fileName = `${trackingCode}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  return filePath;
};

/**
 * Inserts a new report into the database after verifying reCAPTCHA.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (reportData, token) => {
  // First, verify the reCAPTCHA token
  const { error: recaptchaError } = await supabase.functions.invoke('verify-recaptcha', {
    body: { token },
  });

  if (recaptchaError) {
    throw new Error(`reCAPTCHA verification failed: ${recaptchaError.message}`);
  }

  // If reCAPTCHA is verified, proceed with inserting the report
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select();

  if (error) {
    throw new Error(`Failed to create report: ${error.message}`);
  }

  return data[0];
};

/**
 * Updates the status of a report.
 * @param {string} reportId The ID of the report to update.
 * @param {string} status The new status.
 * @returns {Promise<object>} The updated report data.
 */
export const updateReportStatus = async (reportId, status) => {
  const { data, error } = await supabase
    .from('reports')
    .update({ status })
    .eq('id', reportId)
    .select();

  if (error) {
    throw new Error(`Failed to update report status: ${error.message}`);
  }

  return data[0];
};