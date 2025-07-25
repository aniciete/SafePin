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
 * Creates a new report after verifying reCAPTCHA using the native fetch API.
 * @param {SupabaseClient} supabase The Supabase client instance.
 * @param {object} reportData The report data to insert.
 * @param {string} token The reCAPTCHA token.
 * @returns {Promise<object>} The inserted report data.
 */
export const createReport = async (supabase, reportData, token) => {
  // THE FINAL, GUARANTEED FIX:
  // We will bypass supabase.functions.invoke() and use the browser's native fetch API.
  // This gives us absolute control and removes any ambiguity from the Supabase client library.

  // 1. Get the URL and headers needed for the request from the Supabase client.
  const { url } = supabase.functions.getURL('verify-recaptcha');
  const { 'apiKey': anonKey } = supabase.functions.getHeaders();

  try {
    // 2. Make the request using native fetch.
    const recaptchaResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
      },
      body: JSON.stringify({ token }),
    });

    // 3. Check the response.
    if (!recaptchaResponse.ok) {
      // If the status is 400, 500, etc., throw an error.
      const errorBody = await recaptchaResponse.json();
      throw new Error(errorBody.error || `reCAPTCHA verification failed with status: ${recaptchaResponse.status}`);
    }

  } catch (error) {
    // This will catch both network errors and the error thrown above.
    console.error('Direct fetch to verify-recaptcha failed:', error);
    throw new Error(`reCAPTCHA verification failed: ${error.message}`);
  }

  // 4. If verification succeeds, proceed with inserting the report.
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