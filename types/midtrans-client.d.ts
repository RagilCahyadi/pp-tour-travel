declare module 'midtrans-client' {
    interface Config {
        isProduction: boolean
        serverKey: string
        clientKey: string
    }

    interface TransactionDetails {
        order_id: string
        gross_amount: number
    }

    interface CustomerDetails {
        first_name?: string
        last_name?: string
        email?: string
        phone?: string
    }

    interface ItemDetails {
        id: string
        price: number
        quantity: number
        name: string
    }

    interface TransactionParameter {
        transaction_details: TransactionDetails
        customer_details?: CustomerDetails
        item_details?: ItemDetails[]
        callbacks?: {
            finish?: string
        }
    }

    interface TransactionResponse {
        token: string
        redirect_url: string
    }

    interface TransactionStatus {
        transaction_id: string
        order_id: string
        gross_amount: string
        payment_type: string
        transaction_time: string
        transaction_status: string
        fraud_status?: string
        status_code: string
        status_message: string
    }

    class Snap {
        constructor(config: Config)
        createTransaction(parameter: TransactionParameter): Promise<TransactionResponse>
        createTransactionToken(parameter: TransactionParameter): Promise<string>
        createTransactionRedirectUrl(parameter: TransactionParameter): Promise<string>
    }

    class CoreApi {
        constructor(config: Config)
        transaction: {
            status(orderId: string): Promise<TransactionStatus>
            cancel(orderId: string): Promise<TransactionStatus>
            expire(orderId: string): Promise<TransactionStatus>
        }
    }

    export { Snap, CoreApi }
    export default { Snap, CoreApi }
}
