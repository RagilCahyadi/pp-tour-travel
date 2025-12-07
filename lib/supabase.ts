import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Supabase configuration
// Pastikan untuk menambahkan environment variables ini di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client for client-side usage (without type parameter for better inference)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create Supabase client for server-side usage with service role
export function createServerSupabaseClient() {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

// Export types for convenience
export type { Database } from './database.types'
