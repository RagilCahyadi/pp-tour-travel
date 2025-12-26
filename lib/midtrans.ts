import Midtrans from 'midtrans-client'

// Initialize Snap client for Sandbox
export const snap = new Midtrans.Snap({
    isProduction: false, // Sandbox mode
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
})

// Initialize Core API client for transaction status checks
export const coreApi = new Midtrans.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY!,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
})

// Generate unique order ID
export function generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `PPT-${timestamp}-${random}`
}

// Transaction parameter interface
export interface TransactionParams {
    orderId: string
    amount: number
    customerName: string
    customerEmail: string
    customerPhone: string
    packageName: string
    jumlahPax: number
}

// Create Snap transaction parameters
export function createTransactionParams(params: TransactionParams) {
    return {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.amount,
        },
        customer_details: {
            first_name: params.customerName,
            email: params.customerEmail,
            phone: params.customerPhone,
        },
        item_details: [
            {
                id: params.orderId,
                price: Math.round(params.amount / params.jumlahPax),
                quantity: params.jumlahPax,
                name: params.packageName.substring(0, 50), // Midtrans limit
            },
        ],
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/riwayat-pesanan`,
        },
    }
}
