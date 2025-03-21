import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});

// Helper function to get storage URL for a bucket and path
export function getStorageUrl(bucket: string, path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Helper function to upload file to storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  onProgress?: (progress: number) => void
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      onUploadProgress: (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        onProgress?.(Math.round(percent));
      },
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

// Helper function to delete file from storage
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}