import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadImage, deleteImage } from '@/lib/utils/storage'

export interface TourPackage {
  id: string
  nama_paket: string
  lokasi: string
  durasi: string
  tipe_paket: 'Premium' | 'Ekonomis'
  harga: number
  minimal_penumpang: number
  gambar_url: string | null
  poster_url: string | null
  brosur_url: string | null
  nama_daerah: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  package_destinations?: { id: string, nama_destinasi: string }[]
  package_gallery?: { id: string, image_url: string }[]
  package_facilities?: { id: string, nama_fasilitas: string, icon_name: string }[]
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
  poster_url?: string
  brosur_url?: string
  deskripsi?: string
  _destinations?: string[]
  _facilities?: { name: string, icon: string }[]
  _gallery?: File[]
  _existingGalleryUrls?: string[]
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
        .select(`
          *,
          package_destinations(*),
          package_gallery(*),
          package_facilities(*)
        `)
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
      // 1. Insert Main Package
      // Exclude auxiliary data fields passed with underscore convention
      const { _destinations, _facilities, _gallery, ...mainData } = packageData

      const { data: newPackage, error } = await supabase
        .from('tour_packages')
        .insert([mainData as any])
        .select()
        .single()

      if (error) throw error
      if (!newPackage) throw new Error('Failed to create package')

      const packageId = newPackage.id

      // 2. Insert Destinations
      if (_destinations && _destinations.length > 0) {
        const destInserts = _destinations.map((dest, idx) => ({
          package_id: packageId,
          nama_destinasi: dest,
          urutan: idx + 1
        }))
        const { error: destError } = await supabase.from('package_destinations').insert(destInserts)
        if (destError) console.error('Error inserting destinations:', destError)
      }

      // 3. Insert Facilities
      if (_facilities && _facilities.length > 0) {
        const facInserts = _facilities.map((fac, idx) => ({
          package_id: packageId,
          nama_fasilitas: fac.name,
          icon_name: fac.icon,
          urutan: idx + 1
        }))
        const { error: facError } = await supabase.from('package_facilities').insert(facInserts)
        if (facError) console.error('Error inserting facilities:', facError)
      }

      // 4. Upload & Insert Gallery
      if (_gallery && _gallery.length > 0) {
        const galleryPromises = _gallery.map(async (file, idx) => {
          const { url, error: uploadError } = await uploadImage(file)
          if (uploadError) {
            console.error(`Failed to upload gallery image ${idx}:`, uploadError)
            return null
          }
          return {
            package_id: packageId,
            image_url: url,
            urutan: idx + 1
          }
        })

        const galleryResults = await Promise.all(galleryPromises)
        const validGallery = galleryResults.filter(item => item !== null)

        if (validGallery.length > 0) {
          console.log('Attempting to insert gallery items:', validGallery)
          const { data: insertedGallery, error: galleryError } = await supabase
            .from('package_gallery')
            .insert(validGallery)
            .select()

          if (galleryError) {
            console.error('Error inserting gallery:', {
              error: galleryError,
              message: galleryError.message,
              details: galleryError.details,
              hint: galleryError.hint,
              code: galleryError.code
            })
            throw new Error(`Failed to insert gallery: ${galleryError.message || JSON.stringify(galleryError)}`)
          }
          console.log('Successfully inserted gallery:', insertedGallery)
        }
      }

      await fetchPackages()
      return { data: newPackage, error: null }
    } catch (err: any) {
      console.error('Error creating package:', err)
      return { data: null, error: err.message }
    }
  }

  const updatePackage = async (id: string, packageData: Partial<CreateTourPackageData>) => {
    try {
      const { _destinations, _facilities, _gallery, _existingGalleryUrls, ...mainData } = packageData

      // 1. Update Main Package
      const { data, error } = await supabase
        .from('tour_packages')
        .update(mainData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // 2. Update Destinations (Replace Strategy: Delete All & Re-insert)
      if (_destinations !== undefined) {
        await supabase.from('package_destinations').delete().eq('package_id', id)
        if (_destinations.length > 0) {
          const destInserts = _destinations.map((dest, idx) => ({
            package_id: id,
            nama_destinasi: dest,
            urutan: idx + 1
          }))
          const { error: destError } = await supabase.from('package_destinations').insert(destInserts)
          if (destError) console.error('Error updating destinations:', destError)
        }
      }

      // 3. Update Facilities (Replace Strategy)
      if (_facilities !== undefined) {
        await supabase.from('package_facilities').delete().eq('package_id', id)
        if (_facilities.length > 0) {
          const facInserts = _facilities.map((fac, idx) => ({
            package_id: id,
            nama_fasilitas: fac.name,
            icon_name: fac.icon,
            urutan: idx + 1
          }))
          const { error: facError } = await supabase.from('package_facilities').insert(facInserts)
          if (facError) console.error('Error updating facilities:', facError)
        }
      }

      // 4. Update Gallery
      // 4a. Handle Deletions: Delete images not present in _existingGalleryUrls
      // Fetch current gallery images
      const { data: currentGallery } = await supabase
        .from('package_gallery')
        .select('*')
        .eq('package_id', id)

      if (currentGallery) {
        // Identify images to delete (those in DB but NOT in the kept list)
        const imagesToDelete = currentGallery.filter(
          item => !_existingGalleryUrls?.includes(item.image_url)
        )

        if (imagesToDelete.length > 0) {
          // Delete from Storage
          await Promise.all(imagesToDelete.map(img => deleteImage(img.image_url)))
          // Delete from DB
          const idsToDelete = imagesToDelete.map(img => img.id)
          await supabase.from('package_gallery').delete().in('id', idsToDelete)
        }
      }

      // 4b. Upload & Insert NEW Gallery Images
      if (_gallery && _gallery.length > 0) {
        const galleryPromises = _gallery.map(async (file, idx) => {
          const { url, error: uploadError } = await uploadImage(file)
          if (uploadError) {
            console.error(`Failed to upload gallery image ${idx}:`, uploadError)
            return null
          }

          return {
            package_id: id,
            image_url: url,
            urutan: 99 // Append order
          }
        })

        const galleryResults = await Promise.all(galleryPromises)
        const validGallery = galleryResults.filter(item => item !== null)

        if (validGallery.length > 0) {
          console.log('Attempting to insert gallery items:', validGallery)
          const { data: insertedGallery, error: galleryError } = await supabase
            .from('package_gallery')
            .insert(validGallery)
            .select()

          if (galleryError) {
            console.error('Error inserting gallery:', {
              error: galleryError,
              message: galleryError.message,
              details: galleryError.details,
              hint: galleryError.hint,
              code: galleryError.code
            })
            throw new Error(`Failed to insert gallery: ${galleryError.message || JSON.stringify(galleryError)}`)
          }
          console.log('Successfully inserted gallery:', insertedGallery)
        }
      }

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
