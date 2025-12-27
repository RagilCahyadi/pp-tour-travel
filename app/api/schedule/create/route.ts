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

        // Fetch the booking details to create the schedule
        const { data: bookingData, error: fetchError } = await supabase
            .from('bookings')
            .select(`
                id,
                package_id,
                tanggal_keberangkatan,
                catatan,
                customers (
                    nama_perusahaan
                ),
                tour_packages (
                    nama_paket
                )
            `)
            .eq('id', bookingId)
            .single();

        if (fetchError) {
            console.error('Error fetching booking for schedule:', fetchError);
            return NextResponse.json({ error: 'Failed to fetch booking details' }, { status: 500 });
        }

        if (!bookingData) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Check if schedule already exists for this booking
        const { data: existingSchedule } = await supabase
            .from('schedules')
            .select('id')
            .eq('booking_id', bookingId)
            .single();

        if (existingSchedule) {
            return NextResponse.json({
                success: true,
                message: 'Schedule already exists',
                scheduleId: existingSchedule.id
            });
        }

        // Generate schedule code using the database function
        const packageName = (bookingData.tour_packages as any)?.nama_paket || 'PKT';
        const departureDate = bookingData.tanggal_keberangkatan || new Date().toISOString().split('T')[0];

        const { data: codeResult, error: codeError } = await supabase
            .rpc('generate_schedule_code', {
                package_name: packageName,
                departure_date: departureDate
            });

        if (codeError) {
            console.error('Error generating schedule code:', codeError);
        }

        const scheduleCode = codeResult || `SCH${Date.now().toString().slice(-6)}`;

        // Create the schedule
        const { data: scheduleData, error: scheduleError } = await supabase
            .from('schedules')
            .insert({
                kode_jadwal: scheduleCode,
                booking_id: bookingId,
                package_id: bookingData.package_id,
                nama_instansi: (bookingData.customers as any)?.nama_perusahaan || null,
                tanggal_keberangkatan: departureDate,
                waktu_keberangkatan: '08:00', // Default departure time
                status: 'aktif',
                catatan: bookingData.catatan
            })
            .select()
            .single();

        if (scheduleError) {
            console.error('Error creating schedule:', scheduleError);
            return NextResponse.json({ error: `Failed to create schedule: ${scheduleError.message}` }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Schedule created successfully',
            data: scheduleData
        });

    } catch (error) {
        console.error('Error in create-schedule:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
