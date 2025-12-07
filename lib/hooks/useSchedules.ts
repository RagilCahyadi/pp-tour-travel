import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Schedule {
  id: string
  kode_jadwal: string
  booking_id: string | null
  package_id: string
  nama_instansi: string | null
  tanggal_keberangkatan: string
  waktu_keberangkatan: string | null
  status: 'aktif' | 'tidak-aktif' | 'selesai'
  catatan: string | null
  created_at: string
  tour_packages: {
    nama_paket: string
    lokasi: string
    durasi: string
  }
  bookings: {
    kode_booking: string
    jumlah_pax: number
    customers: {
      nama_pelanggan: string
      nama_perusahaan: string | null
    }
  } | null
}

export interface CreateScheduleData {
  kode_jadwal: string
  package_id: string
  booking_id?: string
  nama_instansi?: string
  tanggal_keberangkatan: string
  waktu_keberangkatan?: string
  status?: 'aktif' | 'tidak-aktif' | 'selesai'
  catatan?: string
}

export function useSchedules(statusFilter?: string) {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedules()
  }, [statusFilter])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('schedules')
        .select(`
          *,
          tour_packages (
            nama_paket,
            lokasi,
            durasi
          ),
          bookings (
            kode_booking,
            jumlah_pax,
            customers (
              nama_pelanggan,
              nama_perusahaan
            )
          )
        `)
        .order('tanggal_keberangkatan', { ascending: true })

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setSchedules(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching schedules:', err)
    } finally {
      setLoading(false)
    }
  }

  const createSchedule = async (scheduleData: CreateScheduleData) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert([scheduleData as any])
        .select()
        .single()

      if (error) throw error
      await fetchSchedules()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating schedule:', err)
      return { data: null, error: err.message }
    }
  }

  const updateSchedule = async (id: string, scheduleData: Partial<CreateScheduleData>) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update(scheduleData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchSchedules()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating schedule:', err)
      return { data: null, error: err.message }
    }
  }

  const updateScheduleStatus = async (id: string, status: Schedule['status']) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      await fetchSchedules()
      return { error: null }
    } catch (err: any) {
      console.error('Error updating schedule status:', err)
      return { error: err.message }
    }
  }

  const deleteSchedule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchSchedules()
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting schedule:', err)
      return { error: err.message }
    }
  }

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
    createSchedule,
    updateSchedule,
    updateScheduleStatus,
    deleteSchedule
  }
}
