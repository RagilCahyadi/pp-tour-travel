import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Payment {
  id: string
  booking_id: string
  jumlah_pembayaran: number
  metode_pembayaran: string | null
  status: 'pending' | 'verified' | 'rejected'
  bukti_pembayaran_url: string | null
  catatan_verifikasi: string | null
  verified_by: string | null
  verified_at: string | null
  created_at: string
  bookings: {
    kode_booking: string
    jumlah_pax: number
    tanggal_keberangkatan: string | null
    customers: {
      nama_pelanggan: string
      nama_perusahaan: string | null
      nomor_telepon: string | null
    }
    tour_packages: {
      nama_paket: string
      lokasi: string
    }
  }
}

export interface CreatePaymentData {
  booking_id: string
  jumlah_pembayaran: number
  metode_pembayaran?: string
  bukti_pembayaran_url?: string
  status?: 'pending' | 'verified' | 'rejected'
}

export function usePayments(statusFilter?: string) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [statusFilter])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('payments')
        .select(`
          *,
          bookings (
            kode_booking,
            jumlah_pax,
            tanggal_keberangkatan,
            customers (
              nama_pelanggan,
              nama_perusahaan,
              nomor_telepon
            ),
            tour_packages (
              nama_paket,
              lokasi
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setPayments(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (paymentData: CreatePaymentData) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData as any])
        .select()
        .single()

      if (error) throw error
      await fetchPayments()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating payment:', err)
      return { data: null, error: err.message }
    }
  }

  const verifyPayment = async (id: string, userId: string | null, catatan?: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_by: userId,
          verified_at: new Date().toISOString(),
          catatan_verifikasi: catatan || null
        })
        .eq('id', id)
        .select()

      if (error) throw error

      await fetchPayments()
      return { error: null }
    } catch (err: any) {
      console.error('Error verifying payment:', err)
      return { error: err.message }
    }
  }

  const rejectPayment = async (id: string, userId: string | null, catatan?: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          verified_by: userId,
          verified_at: new Date().toISOString(),
          catatan_verifikasi: catatan || null
        })
        .eq('id', id)
        .select()

      if (error) throw error

      await fetchPayments()
      return { error: null }
    } catch (err: any) {
      console.error('Error rejecting payment:', err)
      return { error: err.message }
    }
  }

  const deletePayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id)

      if (error) throw error

      await fetchPayments()
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting payment:', err)
      return { error: err.message }
    }
  }

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    createPayment,
    verifyPayment,
    rejectPayment,
    deletePayment
  }
}
