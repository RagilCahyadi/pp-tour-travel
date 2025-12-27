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

      // First, update any expired schedules to 'tidak-aktif' via API
      try {
        await fetch('/api/schedule/update-expired', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (expiredErr) {
        console.error('Error updating expired schedules:', expiredErr);
        // Continue fetching even if this fails
      }

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
      console.log('Creating schedule with data:', scheduleData)

      const { data, error } = await supabase
        .from('schedules')
        .insert([scheduleData as any])
        .select()
        .single()

      if (error) {
        console.error('Supabase error (full):', JSON.stringify(error, null, 2))
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)

        // Handle duplicate key error
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
          throw new Error('Kode jadwal sudah digunakan. Silakan gunakan kode jadwal yang berbeda.')
        }

        // Handle other specific errors
        if (error.code === '23503') {
          throw new Error('Paket tour tidak ditemukan. Silakan pilih paket tour yang valid.')
        }

        throw new Error(error.message || error.hint || 'Gagal membuat jadwal')
      }

      await fetchSchedules()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating schedule (full):', err)
      const errorMessage = err?.message || err?.error_description || 'Terjadi kesalahan saat membuat jadwal'
      return { data: null, error: errorMessage }
    }
  }

  const updateSchedule = async (id: string, scheduleData: Partial<CreateScheduleData>) => {
    try {
      console.log('Updating schedule with data:', scheduleData)

      const { data, error } = await supabase
        .from('schedules')
        .update(scheduleData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Supabase error (full):', JSON.stringify(error, null, 2))
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)

        // Handle duplicate key error
        if (error.code === '23505' || error.message?.includes('duplicate key') || error.message?.includes('unique constraint')) {
          throw new Error('Kode jadwal sudah digunakan. Silakan gunakan kode jadwal yang berbeda.')
        }

        // Handle foreign key error
        if (error.code === '23503') {
          throw new Error('Paket tour tidak ditemukan. Silakan pilih paket tour yang valid.')
        }

        throw new Error(error.message || error.hint || 'Gagal memperbarui jadwal')
      }

      await fetchSchedules()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating schedule (full):', err)
      const errorMessage = err?.message || err?.error_description || 'Terjadi kesalahan saat memperbarui jadwal'
      return { data: null, error: errorMessage }
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
