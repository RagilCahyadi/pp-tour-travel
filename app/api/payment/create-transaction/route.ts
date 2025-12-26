import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { snap, generateOrderId, createTransactionParams } from '@/lib/midtrans'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CreateTransactionBody {
    packageId: string
    packageName: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerCompany?: string
    jumlahPax: number
    tanggalKeberangkatan: string
    catatan?: string
    totalAmount: number
    userId?: string
}

// Generate booking code
function generateBookingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'
    let code = ''
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    for (let i = 0; i < 3; i++) {
        code += nums.charAt(Math.floor(Math.random() * nums.length))
    }
    return code
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateTransactionBody = await req.json()

        // Validate required fields
        if (!body.packageId || !body.customerName || !body.customerEmail || !body.totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 1. Create or find customer
        let customerId: string

        // Check if customer exists by email
        const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('email', body.customerEmail)
            .single()

        if (existingCustomer) {
            customerId = existingCustomer.id
            // Update customer data
            await supabase
                .from('customers')
                .update({
                    nama_pelanggan: body.customerName,
                    nama_perusahaan: body.customerCompany || null,
                    nomor_telepon: body.customerPhone,
                })
                .eq('id', customerId)
        } else {
            // Create new customer
            const { data: newCustomer, error: customerError } = await supabase
                .from('customers')
                .insert({
                    user_id: body.userId || null,
                    nama_pelanggan: body.customerName,
                    nama_perusahaan: body.customerCompany || null,
                    email: body.customerEmail,
                    nomor_telepon: body.customerPhone,
                })
                .select('id')
                .single()

            if (customerError || !newCustomer) {
                console.error('Error creating customer:', customerError)
                return NextResponse.json(
                    { error: 'Failed to create customer' },
                    { status: 500 }
                )
            }
            customerId = newCustomer.id
        }

        // 2. Create booking
        const bookingCode = generateBookingCode()
        const orderId = generateOrderId()

        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                kode_booking: bookingCode,
                customer_id: customerId,
                package_id: body.packageId,
                jumlah_pax: body.jumlahPax,
                tanggal_keberangkatan: body.tanggalKeberangkatan,
                status: 'pending',
                catatan: body.catatan || null,
                total_biaya: body.totalAmount,
            })
            .select('id')
            .single()

        if (bookingError || !booking) {
            console.error('Error creating booking:', bookingError)
            return NextResponse.json(
                { error: 'Failed to create booking' },
                { status: 500 }
            )
        }

        // 3. Create Midtrans transaction
        const transactionParams = createTransactionParams({
            orderId,
            amount: body.totalAmount,
            customerName: body.customerName,
            customerEmail: body.customerEmail,
            customerPhone: body.customerPhone,
            packageName: body.packageName,
            jumlahPax: body.jumlahPax,
        })

        const transaction = await snap.createTransaction(transactionParams)

        // 4. Create payment record with Midtrans data
        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                booking_id: booking.id,
                jumlah_pembayaran: body.totalAmount,
                status: 'pending',
                midtrans_order_id: orderId,
                snap_token: transaction.token,
            })

        if (paymentError) {
            console.error('Error creating payment:', paymentError)
            // Don't fail - we can still proceed with payment
        }

        return NextResponse.json({
            success: true,
            token: transaction.token,
            redirectUrl: transaction.redirect_url,
            orderId,
            bookingCode,
            bookingId: booking.id,
        })
    } catch (error) {
        console.error('Create transaction error:', error)
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        )
    }
}
