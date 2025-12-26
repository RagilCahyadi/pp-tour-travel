'use server'

import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function getCurrentUserData() {
    try {
        const { userId, getToken } = await auth()

        console.log('[Server] Auth userId:', userId)

        if (!userId) {
            return { data: null, error: 'Not authenticated' }
        }

        // Get Clerk JWT token
        const token = await getToken({ template: 'supabase' })

        console.log('[Server] JWT token exists:', !!token)

        if (!token) {
            return { data: null, error: 'No JWT token' }
        }

        // Create Supabase client with auth token
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        )

        console.log('[Server] Querying users table for userId:', userId)

        // Fetch user data
        const { data, error } = await supabase
            .from('users')
            .select('first_name, last_name, email_address, phone_number')
            .eq('id', userId)
            .maybeSingle() // Use maybeSingle instead of single to avoid error if not found

        console.log('[Server] Query result:', { data, error, userId })

        if (error) {
            console.error('[Server] Supabase error:', error)
            return { data: null, error: error.message }
        }

        if (!data) {
            console.warn('[Server] No user data found for userId:', userId)
            return { data: null, error: 'User data not found in database' }
        }

        return { data, error: null }
    } catch (err: any) {
        console.error('[Server] Exception:', err)
        return { data: null, error: err.message }
    }
}
