import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface DashboardStats {
  booking_bulan_ini: number
  pendapatan_bulan_ini: number
  menunggu_verifikasi: number
  keberangkatan_minggu_ini: number
}

export interface RecentBooking {
  id: string
  kode_booking: string
  nama_pelanggan: string
  nama_paket: string
  jumlah_pax: number
  status: string
  created_at: string
}

export interface UpcomingDeparture {
  id: string
  kode_jadwal: string
  nama_paket: string
  tanggal_keberangkatan: string
  waktu_keberangkatan: string
  nama_instansi: string
  jumlah_pax: number
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [upcomingDepartures, setUpcomingDepartures] = useState<UpcomingDeparture[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single()

      if (statsError) throw statsError
      setStats(statsData)

      // Fetch recent bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('recent_bookings')
        .select('*')

      if (bookingsError) throw bookingsError
      setRecentBookings(bookingsData || [])

      // Fetch upcoming departures
      const { data: departuresData, error: departuresError } = await supabase
        .from('upcoming_departures')
        .select('*')

      if (departuresError) throw departuresError
      setUpcomingDepartures(departuresData || [])

      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    recentBookings,
    upcomingDepartures,
    loading,
    error,
    refetch: fetchDashboardData
  }
}
