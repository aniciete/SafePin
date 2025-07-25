/**
 * Uploads an image to Supabase Storage.
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
 * Creates a new report by calling the single, transactional 'submit-report' Edge Function.
 */
export const createReport = async (supabase, reportData, token) => {
  // This function now sends the entire report payload AND the reCAPTCHA token
  // to our new all-in-one Edge Function.
  const { data, error } = await supabase.functions.invoke('submit-report', {
    body: { reportData, token },
  });

  if (error) {
    // The error message from the Edge Function (e.g., "reCAPTCHA verification failed") will be passed here.
    throw new Error(error.message);
  }

  return data;
};

/**
 * Updates the status of a report.
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