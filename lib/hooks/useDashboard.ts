import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface DashboardStats {
  booking_bulan_ini: number
  pendapatan_bulan_ini: number
  menunggu_verifikasi: number
  keberangkatan_minggu_ini: number
  total_pelanggan: number
}

export interface MonthlyBooking {
  month: string
  bookings: number
  revenue: number
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

export interface PopularPackage {
  id: string
  nama_paket: string
  bookings: number
  percentage: number
  color: string
}

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyBooking[]>([])
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [upcomingDepartures, setUpcomingDepartures] = useState<UpcomingDeparture[]>([])
  const [popularPackages, setPopularPackages] = useState<PopularPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())

      // Fetch booking bulan ini
      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())

      // Fetch pendapatan bulan ini (hanya dari pembayaran yang sudah verified)
      const { data: verifiedPayments } = await supabase
        .from('payments')
        .select('jumlah_pembayaran')
        .eq('status', 'verified')
        .gte('verified_at', startOfMonth.toISOString())

      const pendapatan = verifiedPayments?.reduce((sum, p) => sum + (p.jumlah_pembayaran || 0), 0) || 0

      // Fetch menunggu verifikasi
      const { count: pendingCount } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Fetch keberangkatan minggu ini
      const { count: departureCount } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })
        .gte('tanggal_keberangkatan', startOfWeek.toISOString())
        .lte('tanggal_keberangkatan', new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())

      // Fetch total pelanggan
      const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

      setStats({
        booking_bulan_ini: bookingCount || 0,
        pendapatan_bulan_ini: pendapatan,
        menunggu_verifikasi: pendingCount || 0,
        keberangkatan_minggu_ini: departureCount || 0,
        total_pelanggan: customerCount || 0
      })

      // Fetch 6 months data for chart
      const monthlyBookings: MonthlyBooking[] = []
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString())

        const { data: monthPayments } = await supabase
          .from('payments')
          .select('jumlah_pembayaran, bookings!inner(created_at)')
          .eq('status', 'verified')
          .gte('bookings.created_at', monthStart.toISOString())
          .lte('bookings.created_at', monthEnd.toISOString())

        const revenue = monthPayments?.reduce((sum, p) => sum + (p.jumlah_pembayaran || 0), 0) || 0

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
        monthlyBookings.push({
          month: monthNames[monthStart.getMonth()],
          bookings: count || 0,
          revenue: revenue
        })
      }
      setMonthlyData(monthlyBookings)

      // Fetch recent bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          id,
          kode_booking,
          jumlah_pax,
          status,
          created_at,
          customers(nama_pelanggan),
          tour_packages(nama_paket)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      const formattedBookings = bookingsData?.map(b => ({
        id: b.id,
        kode_booking: b.kode_booking,
        nama_pelanggan: (b.customers as any)?.nama_pelanggan || 'N/A',
        nama_paket: (b.tour_packages as any)?.nama_paket || 'N/A',
        jumlah_pax: b.jumlah_pax,
        status: b.status,
        created_at: b.created_at
      })) || []

      setRecentBookings(formattedBookings)

      // Fetch upcoming departures
      const { data: departuresData } = await supabase
        .from('schedules')
        .select(`
          id,
          kode_jadwal,
          tanggal_keberangkatan,
          waktu_keberangkatan,
          tour_packages(nama_paket),
          bookings(jumlah_pax, customers(nama_perusahaan))
        `)
        .gte('tanggal_keberangkatan', now.toISOString())
        .order('tanggal_keberangkatan', { ascending: true })
        .limit(5)

      const formattedDepartures = departuresData?.map(d => {
        const bookingsArray = Array.isArray(d.bookings) ? d.bookings : (d.bookings ? [d.bookings] : [])
        return {
          id: d.id,
          kode_jadwal: d.kode_jadwal,
          nama_paket: (d.tour_packages as any)?.nama_paket || 'N/A',
          tanggal_keberangkatan: d.tanggal_keberangkatan,
          waktu_keberangkatan: d.waktu_keberangkatan,
          nama_instansi: (bookingsArray[0] as any)?.customers?.nama_perusahaan || 'N/A',
          jumlah_pax: bookingsArray.reduce((sum: number, b: any) => sum + (b.jumlah_pax || 0), 0)
        }
      }) || []

      setUpcomingDepartures(formattedDepartures)

      // Fetch popular packages this month
      const { data: packageBookingsData } = await supabase
        .from('bookings')
        .select(`
          package_id,
          tour_packages(id, nama_paket)
        `)
        .gte('created_at', startOfMonth.toISOString())

      // Count bookings per package
      const packageCounts: { [key: string]: { id: string, nama_paket: string, count: number } } = {}
      packageBookingsData?.forEach(booking => {
        const pkg = booking.tour_packages as any
        if (pkg?.id) {
          if (!packageCounts[pkg.id]) {
            packageCounts[pkg.id] = { id: pkg.id, nama_paket: pkg.nama_paket, count: 0 }
          }
          packageCounts[pkg.id].count++
        }
      })

      // Sort by count and take top 4
      const sortedPackages = Object.values(packageCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)

      // Calculate percentages and assign colors
      const maxBookings = sortedPackages[0]?.count || 1
      const colors = [
        'from-emerald-500 to-emerald-600',
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-amber-500 to-amber-600'
      ]

      const formattedPopular: PopularPackage[] = sortedPackages.map((pkg, idx) => ({
        id: pkg.id,
        nama_paket: pkg.nama_paket,
        bookings: pkg.count,
        percentage: Math.round((pkg.count / maxBookings) * 100),
        color: colors[idx] || colors[0]
      }))

      setPopularPackages(formattedPopular)

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
    monthlyData,
    recentBookings,
    upcomingDepartures,
    popularPackages,
    loading,
    error,
    refetch: fetchDashboardData
  }
}
