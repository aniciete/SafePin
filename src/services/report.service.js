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
  // THE FINAL, CORRECTED FIX:
  // We will manually construct the function URL and use the browser's native fetch API.

  // 1. Get the required URL and Key from environment variables.
  // These are guaranteed to be correct.
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const functionUrl = `${supabaseUrl}/functions/v1/verify-recaptcha`;

  try {
    // 2. Make the request using native fetch with the manually constructed URL and headers.
    const recaptchaResponse = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}` // Supabase functions often need the Authorization header as well.
      },
      body: JSON.stringify({ token }),
    });

    // 3. Check the response.
    if (!recaptchaResponse.ok) {
      const errorBody = await recaptchaResponse.json().catch(() => ({ error: 'Failed to parse error response.' }));
      throw new Error(errorBody.error || `reCAPTCHA verification failed with status: ${recaptchaResponse.status}`);
    }

  } catch (error) {
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