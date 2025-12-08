import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface TourPackage {
  id: string
  nama_paket: string
  lokasi: string
  durasi: string
  tipe_paket: 'Premium' | 'Ekonomis'
  harga: number
  minimal_penumpang: number
  gambar_url: string | null
  brosur_url: string | null
  nama_daerah: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTourPackageData {
  nama_paket: string
  lokasi: string
  durasi: string
  tipe_paket: 'Premium' | 'Ekonomis'
  harga: number
  minimal_penumpang: number
  nama_daerah?: string
  gambar_url?: string
  brosur_url?: string
  deskripsi?: string
}

export function useTourPackages() {
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tour_packages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPackages(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching packages:', err)
    } finally {
      setLoading(false)
    }
  }

  const createPackage = async (packageData: CreateTourPackageData) => {
    try {
      const { data, error } = await supabase
        .from('tour_packages')
        .insert([packageData as any])
        .select()
        .single()

      if (error) throw error
      await fetchPackages()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating package:', err)
      return { data: null, error: err.message }
    }
  }

  const updatePackage = async (id: string, packageData: Partial<CreateTourPackageData>) => {
    try {
      const { data, error } = await supabase
        .from('tour_packages')
        .update(packageData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchPackages()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating package:', err)
      return { data: null, error: err.message }
    }
  }

  const deletePackage = async (id: string) => {
    try {
      // Check if package is used in any bookings
      const { data: bookings, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .eq('package_id', id)
        .limit(1)

      if (checkError && checkError.code) {
        console.error('Error checking bookings:', checkError)
        throw checkError
      }

      if (bookings && bookings.length > 0) {
        return { 
          error: 'Paket tour tidak dapat dihapus karena masih ada pemesanan yang menggunakan paket ini. Silakan hapus atau ubah pemesanan terkait terlebih dahulu.' 
        }
      }

      // If no bookings, proceed with deletion
      const { error } = await supabase
        .from('tour_packages')
        .delete()
        .eq('id', id)

      if (error && error.code) {
        console.error('Error deleting package:', error)
        throw error
      }

      await fetchPackages()
      return { error: null }
    } catch (err: any) {
      // Only log if error has meaningful properties
      if (err && (err.code || err.message)) {
        console.error('Error deleting package:', err.message || err)
      }
      
      // Check if it's a foreign key error
      if (err?.code === '23503' || err?.message?.includes('foreign key constraint')) {
        return { 
          error: 'Paket tour tidak dapat dihapus karena masih ada pemesanan yang menggunakan paket ini. Silakan hapus atau ubah pemesanan terkait terlebih dahulu.' 
        }
      }
      
      return { error: err?.message || 'Terjadi kesalahan saat menghapus paket' }
    }
  }

  const toggleActiveStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('tour_packages')
        .update({ is_active: isActive })
        .eq('id', id)

      if (error) throw error
      await fetchPackages()
      return { error: null }
    } catch (err: any) {
      console.error('Error toggling active status:', err)
      return { error: err.message }
    }
  }

  return {
    packages,
    loading,
    error,
    refetch: fetchPackages,
    createPackage,
    updatePackage,
    deletePackage,
    toggleActiveStatus
  }
}
