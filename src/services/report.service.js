import { supabase } from '../config/supabase.js';

/**
 * Uploads an image to Supabase Storage.
 * @param {File} file The image file to upload.
 * @returns {Promise<string>} The path of the uploaded image.
 */
export const uploadReportImage = async (file) => {
  if (!file) {
    throw new Error('No image file provided.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
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
 * Inserts a new report into the database.
 * @param {object} reportData The report data to insert.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select();

  if (error) {
    throw new Error(`Failed to create report: ${error.message}`);
  }

  return data[0];
};