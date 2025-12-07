import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Booking {
  id: string
  kode_booking: string
  customer_id: string
  package_id: string
  jumlah_pax: number
  tanggal_keberangkatan: string | null
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  catatan: string | null
  total_biaya: number
  created_at: string
  updated_at: string
  customers: {
    nama_pelanggan: string
    nama_perusahaan: string | null
    nomor_telepon: string | null
    email: string | null
    no_telp?: string
  }
  tour_packages: {
    nama_paket: string
    lokasi: string
    harga: number
  }
}

export interface CreateBookingData {
  kode_booking: string
  customer_id: string
  package_id: string
  jumlah_pax: number
  tanggal_keberangkatan?: string
  total_biaya: number
  catatan?: string
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
}

export function useBookings(statusFilter?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      console.log('Fetching bookings from Supabase...')
      let query = supabase
        .from('bookings')
        .select(`
          *,
          customers (
            nama_pelanggan,
            nama_perusahaan,
            nomor_telepon,
            email
          ),
          tour_packages (
            nama_paket,
            lokasi,
            harga
          )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      console.log('Bookings fetched:', data?.length || 0, 'records')
      setBookings(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: CreateBookingData) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData as any])
        .select()
        .single()

      if (error) throw error
      await fetchBookings()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating booking:', err)
      return { data: null, error: err.message }
    }
  }

  const updateBooking = async (id: string, bookingData: Partial<CreateBookingData>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchBookings()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating booking:', err)
      return { data: null, error: err.message }
    }
  }

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await fetchBookings()
      return { error: null }
    } catch (err: any) {
      console.error('Error updating booking status:', err)
      return { error: err.message }
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchBookings()
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting booking:', err)
      return { error: err.message }
    }
  }

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    updateBooking,
    updateBookingStatus,
    deleteBooking
  }
}
