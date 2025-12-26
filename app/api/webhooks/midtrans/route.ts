import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface MidtransNotification {
    transaction_time: string
    transaction_status: string
    transaction_id: string
    status_message: string
    status_code: string
    signature_key: string
    payment_type: string
    order_id: string
    merchant_id: string
    gross_amount: string
    fraud_status?: string
}

// Verify Midtrans signature
function verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
): boolean {
    const serverKey = process.env.MIDTRANS_SERVER_KEY!
    const payload = orderId + statusCode + grossAmount + serverKey
    const expectedSignature = crypto
        .createHash('sha512')
        .update(payload)
        .digest('hex')
    return signatureKey === expectedSignature
}

export async function POST(req: NextRequest) {
    try {
        const notification: MidtransNotification = await req.json()

        console.log('Midtrans notification received:', notification)

        // Verify signature for security
        const isValid = verifySignature(
            notification.order_id,
            notification.status_code,
            notification.gross_amount,
            notification.signature_key
        )

        if (!isValid) {
            console.error('Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
        }

        // Find payment by Midtrans order ID
        const { data: payment, error: findError } = await supabase
            .from('payments')
            .select('id, booking_id')
            .eq('midtrans_order_id', notification.order_id)
            .single()

        if (findError || !payment) {
            console.error('Payment not found:', notification.order_id)
            return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
        }

        // Determine payment and booking status based on transaction status
        let paymentStatus: 'pending' | 'verified' | 'rejected' = 'pending'
        let bookingStatus: 'pending' | 'confirmed' | 'cancelled' = 'pending'

        switch (notification.transaction_status) {
            case 'capture':
                // For credit card, check fraud status
                if (notification.fraud_status === 'accept') {
                    paymentStatus = 'verified'
                    bookingStatus = 'confirmed'
                } else if (notification.fraud_status === 'challenge') {
                    paymentStatus = 'pending'
                } else {
                    paymentStatus = 'rejected'
                    bookingStatus = 'cancelled'
                }
                break

            case 'settlement':
                paymentStatus = 'verified'
                bookingStatus = 'confirmed'
                break

            case 'pending':
                paymentStatus = 'pending'
                bookingStatus = 'pending'
                break

            case 'deny':
            case 'cancel':
            case 'expire':
                paymentStatus = 'rejected'
                bookingStatus = 'cancelled'
                break

            default:
                console.log('Unhandled transaction status:', notification.transaction_status)
        }

        // Update payment record
        const { error: updatePaymentError } = await supabase
            .from('payments')
            .update({
                status: paymentStatus,
                metode_pembayaran: notification.payment_type,
                midtrans_transaction_id: notification.transaction_id,
                midtrans_transaction_status: notification.transaction_status,
                verified_at: paymentStatus === 'verified' ? new Date().toISOString() : null,
            })
            .eq('id', payment.id)

        if (updatePaymentError) {
            console.error('Error updating payment:', updatePaymentError)
        }

        // Update booking status
        const { error: updateBookingError } = await supabase
            .from('bookings')
            .update({ status: bookingStatus })
            .eq('id', payment.booking_id)

        if (updateBookingError) {
            console.error('Error updating booking:', updateBookingError)
        }

        console.log(`Payment ${notification.order_id} updated: ${paymentStatus}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Webhook error:', error)
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        )
    }
}
