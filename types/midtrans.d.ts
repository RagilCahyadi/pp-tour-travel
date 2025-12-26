declare global {
    interface Window {
        snap: {
            pay: (
                token: string,
                options?: {
                    onSuccess?: (result: MidtransResult) => void
                    onPending?: (result: MidtransResult) => void
                    onError?: (result: MidtransResult) => void
                    onClose?: () => void
                }
            ) => void
            embed: (
                token: string,
                options: {
                    embedId: string
                    onSuccess?: (result: MidtransResult) => void
                    onPending?: (result: MidtransResult) => void
                    onError?: (result: MidtransResult) => void
                    onClose?: () => void
                }
            ) => void
        }
    }
}

export interface MidtransResult {
    status_code: string
    status_message: string
    transaction_id: string
    order_id: string
    gross_amount: string
    payment_type: string
    transaction_time: string
    transaction_status: string
    fraud_status?: string
    finish_redirect_url?: string
}

export interface MidtransNotification {
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
    currency: string
}

export { }
