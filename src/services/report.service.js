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
 * Inserts a new report into the database after verifying reCAPTCHA.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (supabase, reportData, token) => {
  // 1. Verify the reCAPTCHA token by calling the Edge Function.
  // The body MUST be stringified for the function to receive it correctly.
  const { error: recaptchaError } = await supabase.functions.invoke('verify-recaptcha', {
    body: JSON.stringify({ token }),
  });

  if (recaptchaError) {
    // This will now throw the "Edge Function returned a non-2xx status code" error if the secret is missing.
    throw new Error(`reCAPTCHA verification failed: ${recaptchaError.message}`);
  }

  // 2. If reCAPTCHA is verified, proceed with inserting the report.
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select();

  if (error) {
    throw new Error(`Failed to create report: ${error.message}`);
  }

  return data[0];
};