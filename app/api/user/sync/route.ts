import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// This endpoint syncs the current Clerk user to Supabase
// Used as a fallback when webhooks can't reach localhost
export async function POST() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await currentUser()

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const email = user.emailAddresses?.[0]?.emailAddress || null
        const phoneNumber = (user.unsafeMetadata as { phone_number?: string })?.phone_number || null

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('id', user.id)
            .single()

        if (existingUser) {
            // Update existing user
            const { error } = await supabase
                .from('users')
                .update({
                    email_address: email,
                    username: user.username || null,
                    first_name: user.firstName || null,
                    last_name: user.lastName || null,
                    profile_image_url: user.imageUrl || null,
                    phone_number: phoneNumber
                })
                .eq('id', user.id)

            if (error) {
                console.error('Update error:', error)
                return NextResponse.json({ error: 'Database error' }, { status: 500 })
            }

            return NextResponse.json({ message: 'User updated', userId: user.id })
        } else {
            // Insert new user
            const { error } = await supabase.from('users').insert({
                id: user.id,
                email_address: email,
                username: user.username || null,
                first_name: user.firstName || null,
                last_name: user.lastName || null,
                profile_image_url: user.imageUrl || null,
                phone_number: phoneNumber
            })

            if (error) {
                console.error('Insert error:', error)
                return NextResponse.json({ error: 'Database error' }, { status: 500 })
            }

            return NextResponse.json({ message: 'User created', userId: user.id })
        }
    } catch (err) {
        console.error('Sync user error:', err)
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
