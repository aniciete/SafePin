/**
 * Uploads an image to Supabase Storage.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {File} file The image file to upload.
 * @param {string} trackingCode The tracking code to use as the image name.
 * @returns {Promise<string>} The path of the uploaded image.
 */
export const uploadReportImage = async (supabase, file, trackingCode) => {
  if (!file) {
    throw new Error('No image file provided.');
  }
  const fileExt = file.name.split('.').pop();
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
 * Creates a new report by calling the single, secure database function.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The result of the function call.
 */
export const createReport = async (supabase, reportData, token) => {
  // Call the new all-in-one database function with all the required parameters.
  const { data, error } = await supabase.rpc('create_report_securely', {
    recaptcha_token: token,
    incident_type: reportData.incident_type,
    severity: reportData.severity,
    description: reportData.description,
    location: reportData.location,
    image_path: reportData.image_path,
    tracking_code: reportData.tracking_code,
    jurisdiction: reportData.jurisdiction,
    contact_info: reportData.contact_info,
  });

  if (error) {
    // The specific error message from the database function (e.g., "reCAPTCHA verification failed") will be passed here.
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates the status of a report.
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
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update report status: ${error.message}`);
  }

  return data;
};