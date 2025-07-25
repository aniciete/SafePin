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
 * Creates a new report after verifying reCAPTCHA.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (supabase, reportData, token) => {
  // THE FINAL FIX: We will be extremely explicit about the request body.
  // 1. Create the payload as a simple JavaScript object.
  const payload = { token };
  
  // 2. Convert the payload into a Blob with the correct MIME type.
  // This is the most robust way to send a JSON body and avoids all serialization ambiguity.
  const payloadBlob = new Blob([JSON.stringify(payload)], {
    type: 'application/json',
  });

  // 3. Invoke the function, passing the Blob directly as the body.
  const { error: recaptchaError } = await supabase.functions.invoke('verify-recaptcha', {
    body: payloadBlob,
  });

  if (recaptchaError) {
    throw new Error(`reCAPTCHA verification failed: ${recaptchaError.message}`);
  }

  // If verification succeeds, insert the report.
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