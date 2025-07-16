# Supabase Storage Setup for SafePin

Follow these steps to configure Supabase Storage for your report images.

## 1. Create the Storage Bucket

1.  Go to your Supabase Project Dashboard.
2.  Navigate to the **Storage** section from the left sidebar.
3.  Click on **New Bucket**.
4.  Enter the bucket name as `report-images`.
5.  Keep the **Public bucket** option **Off**. This is a critical security measure to ensure that user-uploaded images are not publicly accessible.
6.  Click **Create Bucket**.

## 2. Set Up Row-Level Security Policies

Since the bucket is private, we will need to generate temporary signed URLs to grant users access to view images. The following policies control who can upload and manage files. Run this SQL in your Supabase SQL Editor.

```sql
-- Policy: Allow authenticated users to upload images to their own folder
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  -- The bucket must be 'report-images'
  bucket_id = 'report-images' AND
  -- The user can only upload to a path that starts with 'reports/{user_id}/'
  (storage.foldername(name))[1] = 'reports' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy: Allow users to view their own images
CREATE POLICY "Allow individual user access to own images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'report-images' AND
  (storage.foldername(name))[1] = 'reports' AND
  (storage.foldername(name))[2] = auth.uid()::text
);

-- Policy: Allow admins to manage all images
CREATE POLICY "Allow admin full access"
ON storage.objects FOR ALL
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
```

These policies ensure that:
-   Authenticated users can only upload images into a folder corresponding to their user ID.
-   Users can only see their own images.
-   Admins have full access to all images for moderation purposes.