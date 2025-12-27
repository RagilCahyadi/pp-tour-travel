import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('users')
            .select('id, first_name, last_name, email_address, phone_number')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
        }

        return NextResponse.json({ data });

    } catch (error) {
        console.error('Error in get profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const { userId, updateData } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const supabase = createServerSupabaseClient();

        // Build update object - only include fields that are provided
        const updateFields: any = {};

        if (updateData.first_name !== undefined) {
            updateFields.first_name = updateData.first_name;
        }
        if (updateData.last_name !== undefined) {
            updateFields.last_name = updateData.last_name;
        }
        if (updateData.email_address !== undefined) {
            updateFields.email_address = updateData.email_address;
        }
        if (updateData.phone_number !== undefined) {
            updateFields.phone_number = updateData.phone_number;
        }

        // Add updated_at timestamp
        updateFields.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('users')
            .update(updateFields)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error updating user profile:', error);
            return NextResponse.json({ error: `Failed to update profile: ${error.message}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data
        });

    } catch (error) {
        console.error('Error in update profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
