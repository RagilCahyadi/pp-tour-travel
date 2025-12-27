import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        // Use service role client to bypass RLS
        const supabase = createServerSupabaseClient();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Update all schedules where departure date is before today and status is 'aktif'
        const { data, error } = await supabase
            .from('schedules')
            .update({ status: 'tidak-aktif' })
            .lt('tanggal_keberangkatan', today)
            .eq('status', 'aktif')
            .select('id');

        if (error) {
            console.error('Error updating expired schedules:', error);
            return NextResponse.json({ error: 'Failed to update expired schedules' }, { status: 500 });
        }

        const updatedCount = data?.length || 0;
        console.log(`Updated ${updatedCount} expired schedules to 'tidak-aktif'`);

        return NextResponse.json({
            success: true,
            message: `Updated ${updatedCount} expired schedules`,
            updatedCount
        });

    } catch (error) {
        console.error('Error in update-expired:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
