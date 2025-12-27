import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        // Use service role client to bypass RLS
        const supabase = createServerSupabaseClient();

        // Update payment status to verified
        const { data, error } = await supabase
            .from('payments')
            .update({ status: 'verified' })
            .eq('booking_id', bookingId)
            .select();

        if (error) {
            console.error('Error updating payment status:', error);
            return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
        }

        // Also update booking status to confirmed if needed
        await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId);

        return NextResponse.json({
            success: true,
            message: 'Payment status updated to verified',
            data
        });

    } catch (error) {
        console.error('Error in update-payment-status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
