import { supabase } from '../config/supabase.js';

/**
 * Uploads an image to Supabase Storage.
 * @param {File} imageFile - The image file to upload.
 * @returns {Promise<string>} The public URL of the uploaded file.
 */
export async function uploadImage(imageFile) {
    if (!imageFile) {
        throw new Error('Image file is required.');
    }

    const fileName = `public/${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, imageFile);

    if (uploadError) {
        console.error('Image upload failed:', uploadError);
        throw new Error('Failed to upload image. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);

    return publicUrl;
}

/**
 * Submits a report to the Supabase database.
 * @param {object} reportData - The report data from the form.
 * @returns {Promise<object>} The newly created report data.
 */
export async function submitReport(reportData) {
    const { data, error } = await supabase
        .from('incidents')
        .insert([reportData])
        .select();

    if (error) {
        console.error('Database insert failed:', error);
        throw new Error('Failed to submit report. Please try again later.');
    }

    return data[0];
}