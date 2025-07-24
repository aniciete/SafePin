// NO LONGER IMPORTS supabase directly. This is the key security fix.

/**
 * Fetches reports from the database using the provided Supabase client.
 * RLS is expected to handle filtering by jurisdiction based on the user's JWT.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of reports.
 */
export const getReports = async (supabase) => {
  const { data, error } = await supabase.from('reports').select('*');

  if (error) {
    console.error('Error fetching reports:', error);
    throw new Error(error.message);
  }

  return data;
};

/**
 * Uploads an image to Supabase Storage using the provided client.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {File} file The image file to upload.
 * @param {string} trackingCode The tracking code to use as the image name.
 * @returns {Promise<string>} The path of the uploaded image.
 */
export const uploadReportImage = async (supabase, file, trackingCode) => {
  if (!file) {
    throw new Error('No image file provided.');
  }

  const fileExt = file.type.split('/')[1];
  const fileName = `${trackingCode}.${fileExt}`;
  const filePath = `reports/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('reports') // This should match your bucket name, assuming it's 'reports'
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  return filePath;
};

/**
 * Inserts a new report into the database after verifying reCAPTCHA, using the provided client.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (supabase, reportData, token) => {
  // First, verify the reCAPTCHA token by calling the edge function
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
 * Updates the status of a report using the provided client.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {string} reportId The ID of the report to update.
 * @param {string} status The new status.
 * @returns {Promise<object>} The updated report data.
 */
export const updateReportStatus = async (supabase, reportId, status) => {
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