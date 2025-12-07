import { supabase } from '@/lib/supabase'

/**
 * Upload image to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name (default: 'tour-packages')
 * @returns Public URL of uploaded file or null if failed
 */
export async function uploadImage(file: File, bucket: string = 'tour-packages'): Promise<{ url: string | null; error: string | null }> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `packages/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { url: null, error: uploadError.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return { url: urlData.publicUrl, error: null }
  } catch (err: any) {
    console.error('Error uploading image:', err)
    return { url: null, error: err.message || 'Failed to upload image' }
  }
}

/**
 * Delete image from Supabase Storage
 * @param url - Public URL of the image
 * @param bucket - Storage bucket name (default: 'tour-packages')
 */
export async function deleteImage(url: string, bucket: string = 'tour-packages'): Promise<{ success: boolean; error: string | null }> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`)
    if (urlParts.length < 2) {
      return { success: false, error: 'Invalid URL format' }
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err: any) {
    console.error('Error deleting image:', err)
    return { success: false, error: err.message || 'Failed to delete image' }
  }
}

/**
 * Check if URL is valid
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
