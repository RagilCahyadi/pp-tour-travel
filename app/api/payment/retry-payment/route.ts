import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { snap, generateOrderId, createTransactionParams } from '@/lib/midtrans'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json()

        if (!bookingId) {
            return NextResponse.json(
                { error: 'Missing booking ID' },
                { status: 400 }
            )
        }

        // Get booking details with customer and package info
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
        id,
        kode_booking,
        jumlah_pax,
        total_biaya,
        customers (
          nama_pelanggan,
          email,
          nomor_telepon
        ),
        tour_packages (
          nama_paket
        )
      `)
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            console.error('Booking not found:', bookingError)
            return NextResponse.json(
                { error: 'Booking not found' },
                { status: 404 }
            )
        }

        const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers
        const tourPackage = Array.isArray(booking.tour_packages) ? booking.tour_packages[0] : booking.tour_packages

        // Generate new order ID
        const orderId = generateOrderId()

        // Create Midtrans transaction
        const transactionParams = createTransactionParams({
            orderId,
            amount: booking.total_biaya || 0,
            customerName: customer?.nama_pelanggan || 'Customer',
            customerEmail: customer?.email || 'customer@email.com',
            customerPhone: customer?.nomor_telepon || '08123456789',
            packageName: tourPackage?.nama_paket || 'Tour Package',
            jumlahPax: booking.jumlah_pax,
        })

        const transaction = await snap.createTransaction(transactionParams)

        // Update or create payment record
        const { data: existingPayment } = await supabase
            .from('payments')
            .select('id')
            .eq('booking_id', bookingId)
            .eq('status', 'pending')
            .single()

        if (existingPayment) {
            // Update existing pending payment
            await supabase
                .from('payments')
                .update({
                    midtrans_order_id: orderId,
                    snap_token: transaction.token,
                })
                .eq('id', existingPayment.id)
        } else {
            // Create new payment record
            await supabase
                .from('payments')
                .insert({
                    booking_id: bookingId,
                    jumlah_pembayaran: booking.total_biaya || 0,
                    status: 'pending',
                    midtrans_order_id: orderId,
                    snap_token: transaction.token,
                })
        }

        return NextResponse.json({
            success: true,
            token: transaction.token,
            redirectUrl: transaction.redirect_url,
            orderId,
        })
    } catch (error) {
        console.error('Retry payment error:', error)
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        )
    }
}
