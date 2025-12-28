'use client'

import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { useTourPackages } from '@/lib/hooks/useTourPackages'
import { formatRupiah } from '@/lib/utils/helpers'
import { uploadImage, deleteImage, isValidUrl } from '@/lib/utils/storage'
import {
  X, MapPin, Bus, Ship, Utensils, Hotel, Coffee, Camera, User, Users,
  Ticket, Wallet, Flag, Gift, Star, Upload, Trash2, Plus, ChevronDown, Check
} from 'lucide-react'

// Icon Options for Facilities
const ICON_OPTIONS = [
  { value: 'bus', label: 'Transportasi', icon: Bus },
  { value: 'ship', label: 'Kapal Ferry', icon: Ship },
  { value: 'utensils', label: 'Makan', icon: Utensils },
  { value: 'hotel', label: 'Penginapan', icon: Hotel },
  { value: 'coffee', label: 'Snack', icon: Coffee },
  { value: 'camera', label: 'Dokumentasi', icon: Camera },
  { value: 'user', label: 'Tour Leader', icon: User },
  { value: 'users', label: 'Tour Guide', icon: Users },
  { value: 'ticket', label: 'Tiket Masuk', icon: Ticket },
  { value: 'wallet', label: 'Biaya Lain', icon: Wallet },
  { value: 'flag', label: 'Banner', icon: Flag },
  { value: 'gift', label: 'Doorprize', icon: Gift },
  { value: 'star', label: 'Bonus', icon: Star },
]

export default function AdminPaketPage() {
  const { packages, loading, error, createPackage, updatePackage, deletePackage, toggleActiveStatus, refetch } = useTourPackages()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Semua Tipe')
  const [isUploading, setIsUploading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [formData, setFormData] = useState({
    namaPaket: '',
    durasiIklan: '',
    tipePaket: '',
    nominalHarga: '',
    namaDaerah: '',
    minimalPenumpang: '',
    imageFile: null as File | null,
    posterFile: null as File | null
  })
  const [editFormData, setEditFormData] = useState({
    namaPaket: '',
    durasiIklan: '',
    tipePaket: '',
    nominalHarga: '',
    namaDaerah: '',
    pulauBali: '', // Will be removed visually but kept for state compatibility until clean up
    minimalPenumpang: '',
    imageFile: null as File | null,
    posterFile: null as File | null
  })

  // --- New Features State ---
  // Gallery
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  // Destinations
  const [destinations, setDestinations] = useState<string[]>([])
  const [tempDest, setTempDest] = useState('')

  // Facilities
  const [facilities, setFacilities] = useState<{ name: string, icon: string }[]>([])
  const [tempFacName, setTempFacName] = useState('')
  const [tempFacIcon, setTempFacIcon] = useState('bus')
  const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false)

  // --- Helper Functions ---

  // Gallery Logic
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (galleryPreviews.length >= 5) {
        alert('Maksimal 5 foto gallery!')
        return
      }

      const newFiles = Array.from(e.target.files)
      // Calculate how many more can be added
      const remainingSlots = 5 - galleryPreviews.length

      const allowedFiles = newFiles.slice(0, remainingSlots)

      if (allowedFiles.length < newFiles.length) {
        alert(`Hanya ${remainingSlots} foto yang dapat ditambahkan.`)
      }

      setGalleryFiles(prev => [...prev, ...allowedFiles])

      const newPreviews = allowedFiles.map(file => URL.createObjectURL(file))
      setGalleryPreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  // Destinations Logic
  const addDestination = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter') return
    e?.preventDefault() // Prevent form submit on Enter

    if (tempDest.trim()) {
      setDestinations(prev => [...prev, tempDest.trim()])
      setTempDest('')
    }
  }

  const removeDestination = (index: number) => {
    setDestinations(prev => prev.filter((_, i) => i !== index))
  }

  // Facilities Logic
  const addFacility = () => {
    if (tempFacName.trim()) {
      setFacilities(prev => [...prev, { name: tempFacName.trim(), icon: tempFacIcon }])
      setTempFacName('')
    }
  }

  const removeFacility = (index: number) => {
    setFacilities(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }))
    }
  }

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, posterFile: e.target.files![0] }))
    }
  }

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData(prev => ({ ...prev, imageFile: e.target.files![0] }))
    }
  }

  const handleEditPosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData(prev => ({ ...prev, posterFile: e.target.files![0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate required fields
    if (!formData.namaPaket || !formData.tipePaket || !formData.nominalHarga) {
      alert('Mohon lengkapi semua field yang wajib diisi!')
      return
    }

    setIsUploading(true)

    try {
      // LOG DATA FOR NEW FEATURES (Backend Integration Todo)
      console.group('📦 New Package Data')
      console.log('Basic Info:', formData)
      console.log('Destinations:', destinations)
      console.log('Facilities:', facilities)
      console.log('Gallery Files:', galleryFiles)
      console.groupEnd()

      let gambarUrl = null
      let posterUrl = null

      // Upload main image
      if (formData.imageFile) {
        console.log('Uploading main image...', formData.imageFile.name)
        const { url, error: uploadError } = await uploadImage(formData.imageFile)

        if (uploadError) {
          alert(`❌ Gagal upload gambar utama: ${uploadError}`)
          setIsUploading(false)
          return
        }
        gambarUrl = url
      }

      // Upload poster
      if (formData.posterFile) {
        console.log('Uploading poster...', formData.posterFile.name)
        const { url, error: uploadError } = await uploadImage(formData.posterFile)

        if (uploadError) {
          alert(`❌ Gagal upload poster: ${uploadError}`)
          setIsUploading(false)
          return
        }
        posterUrl = url
      }

      const packageData = {
        nama_paket: formData.namaPaket,
        lokasi: formData.namaDaerah || 'Indonesia',
        durasi: formData.durasiIklan || '1 hari',
        tipe_paket: formData.tipePaket as 'Premium' | 'Ekonomis',
        harga: parseInt(formData.nominalHarga.replace(/\D/g, '')) || 0,
        minimal_penumpang: parseInt(formData.minimalPenumpang) || 1,
        nama_daerah: formData.namaDaerah || undefined,
        gambar_url: gambarUrl || undefined,
        poster_url: posterUrl || undefined,
        _destinations: destinations,
        _facilities: facilities,
        _gallery: galleryFiles
      }

      const result = await createPackage(packageData)

      if (result.error) {
        alert(`❌ Gagal menambahkan paket: ${result.error}`)
        setIsUploading(false)
        return
      }

      alert('✅ Paket tour berhasil ditambahkan! (Catatan: Destinasi & Fasilitas belum tersimpan ke DB)')
      setIsModalOpen(false)
      // Reset form
      setFormData({
        namaPaket: '',
        durasiIklan: '',
        tipePaket: '',
        nominalHarga: '',
        namaDaerah: '',
        minimalPenumpang: '',
        imageFile: null,
        posterFile: null
      })
      // Reset new features
      setDestinations([])
      setFacilities([])
      setGalleryFiles([])
      setGalleryPreviews([])
    } catch (err: any) {
      console.error('Error creating package:', err)
      alert(`❌ Terjadi kesalahan: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate required fields
    if (!editFormData.namaPaket || !editFormData.tipePaket || !editFormData.nominalHarga) {
      alert('Mohon lengkapi semua field yang wajib diisi!')
      return
    }

    if (!selectedPackage) return

    setIsUploading(true)

    try {
      // LOG DATA FOR NEW FEATURES (Backend Integration Todo)
      console.group('📝 Update Package Data')
      console.log('Basic Info:', editFormData)
      console.log('Destinations:', destinations)
      console.log('Facilities:', facilities)
      console.log('Gallery Files:', galleryFiles)
      console.groupEnd()

      let gambarUrl = selectedPackage.gambar_url
      let posterUrl = selectedPackage.poster_url

      // Upload new main image
      if (editFormData.imageFile) {
        if (selectedPackage.gambar_url && isValidUrl(selectedPackage.gambar_url)) {
          await deleteImage(selectedPackage.gambar_url)
        }
        const { url, error } = await uploadImage(editFormData.imageFile)
        if (error) throw new Error(`Upload gambar gagal: ${error}`)
        gambarUrl = url
      }

      // Upload new poster
      if (editFormData.posterFile) {
        if (selectedPackage.poster_url && isValidUrl(selectedPackage.poster_url)) {
          await deleteImage(selectedPackage.poster_url)
        }
        const { url, error } = await uploadImage(editFormData.posterFile)
        if (error) throw new Error(`Upload poster gagal: ${error}`)
        posterUrl = url
      }

      // Filter out blob URLs to get existing gallery URLs
      const existingGalleryUrls = galleryPreviews.filter(url => !url.startsWith('blob:'))

      const packageData: any = {
        nama_paket: editFormData.namaPaket,
        lokasi: editFormData.namaDaerah || 'Indonesia',
        durasi: editFormData.durasiIklan || '1 hari',
        tipe_paket: editFormData.tipePaket as 'Premium' | 'Ekonomis',
        harga: parseInt(editFormData.nominalHarga.replace(/\D/g, '')) || 0,
        minimal_penumpang: parseInt(editFormData.minimalPenumpang) || 1,
        nama_daerah: editFormData.namaDaerah || null,
        gambar_url: gambarUrl,
        poster_url: posterUrl,
        // TODO: Pass these to backend
        _destinations: destinations,
        _facilities: facilities,
        _gallery: galleryFiles,
        _existingGalleryUrls: existingGalleryUrls
      }

      console.log('Package data to update:', packageData) // Debug

      const result = await updatePackage(selectedPackage.id, packageData)

      if (result.error) {
        console.error('Update error:', result.error)
        alert(`❌ Gagal memperbarui paket: ${result.error}`)
        setIsUploading(false)
        return
      }

      console.log('Update result:', result) // Debug

      // Show success message with updated data
      const successMsg = `✅ Paket tour berhasil diperbarui!\n\n` +
        `Nama: ${packageData.nama_paket}\n` +
        `Lokasi: ${packageData.lokasi}\n` +
        `Harga: Rp ${packageData.harga.toLocaleString('id-ID')}\n` +
        `(Catatan: Destinasi & Fasilitas belum tersimpan ke DB)`

      alert(successMsg)
      setIsEditModalOpen(false)
      setSelectedPackage(null)

      // Force refresh to show updated data
      await refetch()
    } catch (err: any) {
      console.error('Error updating package:', err)
      alert(`❌ Terjadi kesalahan: ${err.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenAddModal = () => {
    // Reset Form
    setFormData({
      namaPaket: '',
      durasiIklan: '',
      tipePaket: '',
      nominalHarga: '',
      namaDaerah: '',
      minimalPenumpang: '',
      imageFile: null,
      posterFile: null
    })
    // Reset New Features
    setGalleryFiles([])
    setGalleryPreviews([])
    setDestinations([])
    setFacilities([])
    setIsModalOpen(true)
  }

  const handleEditClick = (pkg: any) => {
    console.log('Opening edit modal for package:', pkg) // Debug
    setSelectedPackage(pkg)
    setEditFormData({
      namaPaket: pkg.nama_paket || '',
      durasiIklan: pkg.durasi || '',
      tipePaket: pkg.tipe_paket || '',
      nominalHarga: pkg.harga ? pkg.harga.toString() : '',
      namaDaerah: pkg.lokasi || '',
      pulauBali: pkg.nama_daerah || '',
      minimalPenumpang: pkg.minimal_penumpang ? pkg.minimal_penumpang.toString() : '',
      imageFile: null,
      posterFile: null
    })

    // Populate fields from pkg if available (Future-proof)
    setGalleryFiles([])
    // Use existing image as first gallery preview if gallery is empty
    const existingGallery = pkg.package_gallery?.map((g: any) => g.image_url) || []
    setGalleryPreviews(existingGallery)

    setDestinations(pkg.package_destinations?.map((d: any) => d.nama_destinasi) || [])

    setFacilities(pkg.package_facilities?.map((f: any) => ({
      name: f.nama_fasilitas,
      icon: f.icon_name
    })) || [])

    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (pkg: any) => {
    setSelectedPackage(pkg)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPackage) return

    try {
      const result = await deletePackage(selectedPackage.id)

      if (result.error) {
        // Show detailed error message
        alert(`❌ ${result.error}`)
        setIsDeleteModalOpen(false)
        setSelectedPackage(null)
        return
      }

      alert('✅ Paket tour berhasil dihapus!')
      setIsDeleteModalOpen(false)
      setSelectedPackage(null)
    } catch (err: any) {
      console.error('Error deleting package:', err)
      alert(`❌ Terjadi kesalahan: ${err.message}`)
      setIsDeleteModalOpen(false)
      setSelectedPackage(null)
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedPackage(null)
  }

  // Filter packages based on search and type
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.nama_paket.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'Semua Tipe' || pkg.tipe_paket === selectedType
    return matchesSearch && matchesType
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPackages = filteredPackages.slice(startIndex, endIndex)

  // Reset to page 1 when search or type changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    setCurrentPage(1)
  }

  const stats = {
    total: packages.length,
    premium: packages.filter(p => p.tipe_paket === 'Premium').length,
    ekonomis: packages.filter(p => p.tipe_paket === 'Ekonomis').length,
    avgHarga: packages.length > 0
      ? Math.round(packages.reduce((sum, p) => sum + (p.harga || 0), 0) / packages.length)
      : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="paket" />

      {/* Main Content */}
      <div className="ml-0 lg:ml-64 pt-14 lg:pt-0 min-h-screen overflow-auto">
        <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#101828] tracking-tight">
                Kelola Paket Tour Travel
              </h1>
              <p className="text-base text-[#6a7282] mt-1">
                Manage semua paket wisata Anda
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Paket
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Cari paket tour berdasarkan nama atau destinasi..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009966]"
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="border border-gray-200 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#009966]"
              >
                <option>Semua Tipe</option>
                <option>Premium</option>
                <option>Ekonomis</option>
              </select>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d0fae5] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-[#6a7282]">Total Paket</p>
                  <p className="text-base text-[#101828] font-semibold">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-[#6a7282]">Avg. Harga</p>
                  <p className="text-base text-[#101828] font-semibold">{formatRupiah(stats.avgHarga)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-[#6a7282]">Premium</p>
                  <p className="text-base text-[#101828] font-semibold">{stats.premium}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ffedd4] rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base text-[#6a7282]">Ekonomis</p>
                  <p className="text-base text-[#101828] font-semibold">{stats.ekonomis}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-16 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-[#009966] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600">Memuat data paket...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl shadow-md p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-lg font-medium text-red-700 mb-1">Gagal memuat data</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="mt-2 px-4 py-2 bg-[#009966] text-white rounded-lg hover:bg-[#008055] transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* Package Cards Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {currentPackages.length > 0 ? currentPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
                    {/* Package Image */}
                    <div className="relative h-48">
                      {isValidUrl(pkg.gambar_url) ? (
                        <Image
                          src={pkg.gambar_url!}
                          alt={pkg.nama_paket}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#009966] to-[#00bc7d] flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-16 h-16 text-white opacity-50 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {pkg.gambar_url && (
                              <p className="text-xs text-white opacity-75 px-4">{pkg.gambar_url}</p>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2">
                        <span className={`px-3 py-1 rounded-full text-xs text-white border ${pkg.tipe_paket === 'Premium'
                          ? 'bg-[rgba(254,154,0,0.9)] border-[#ffb900]'
                          : 'bg-[rgba(43,127,255,0.9)] border-[#51a2ff]'
                          }`}>
                          {pkg.tipe_paket}
                        </span>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-[#101828] mb-2">{pkg.nama_paket}</h3>

                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-[#6a7282]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-[#6a7282]">{pkg.lokasi}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#4a5565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-[#4a5565]">{pkg.durasi}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#4a5565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm text-[#4a5565]">Min. {pkg.minimal_penumpang} orang</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                        <div>
                          <p className="text-base text-[#6a7282]">Mulai dari</p>
                          <p className="text-base text-[#009966] font-semibold">{formatRupiah(pkg.harga)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditClick(pkg)}
                            className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(pkg)}
                            className="w-9 h-9 bg-red-50 rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-gray-100 rounded-2xl shadow-md p-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-lg font-medium text-gray-700 mb-1">Belum ada paket tour</p>
                        <p className="text-sm text-gray-500">Tambahkan paket tour pertama Anda untuk ditampilkan di sini</p>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 px-6 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-2xl hover:from-[#008055] hover:to-[#00a66b] transition-colors"
                      >
                        Tambah Paket Tour
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filteredPackages.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl shadow-md px-6 py-4 flex items-center justify-between">
                  <p className="text-[#4a5565] text-base">
                    Menampilkan <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredPackages.length)}</span> dari <span className="font-semibold">{filteredPackages.length}</span> paket
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-[#364153] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                          ? 'bg-[#009966] text-white'
                          : 'bg-white border border-gray-200 text-[#364153] hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-[#364153] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Tambah Paket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-3xl font-bold text-[#101828] tracking-tight">Tambah Paket</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
              {/* Row 1: Nama Paket */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Nama Paket Wisata</label>
                <input
                  type="text"
                  name="namaPaket"
                  value={formData.namaPaket}
                  onChange={handleInputChange}
                  placeholder="Bali Nusa Penida Exclusive"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                />
              </div>

              {/* Row 2: Harga & Tipe Paket */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Harga (IDR)</label>
                  <input
                    type="text"
                    name="nominalHarga"
                    value={formData.nominalHarga}
                    onChange={handleInputChange}
                    placeholder="2500000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                  {formData.nominalHarga && !isNaN(Number(formData.nominalHarga)) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Terbaca: {formatRupiah(Number(formData.nominalHarga))}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Tipe Paket</label>
                  <select
                    name="tipePaket"
                    value={formData.tipePaket}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                  >
                    <option value="" disabled>Pilih tipe paket</option>
                    <option value="Premium">Premium</option>
                    <option value="Ekonomis">Ekonomis</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Nama Daerah & Durasi & Min Pax */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Lokasi / Daerah</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="namaDaerah"
                      value={formData.namaDaerah}
                      onChange={handleInputChange}
                      placeholder="Nusa Penida, Bali"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Durasi</label>
                  <input
                    type="text"
                    name="durasiIklan"
                    value={formData.durasiIklan}
                    onChange={handleInputChange}
                    placeholder="3 Hari 2 Malam"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Min. Pax</label>
                  <input
                    type="text"
                    name="minimalPenumpang"
                    value={formData.minimalPenumpang}
                    onChange={handleInputChange}
                    placeholder="2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 4: Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Main Image */}
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Upload Gambar (Utama)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.imageFile?.name || ''}
                      placeholder="Pilih gambar utama"
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer text-ellipsis"
                      onClick={() => document.getElementById('addMainImage')?.click()}
                    />
                    <input
                      id="addMainImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('addMainImage')?.click()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                {/* Upload Poster */}
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Upload Poster</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.posterFile?.name || ''}
                      placeholder="Pilih poster"
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer text-ellipsis"
                      onClick={() => document.getElementById('addPoster')?.click()}
                    />
                    <input
                      id="addPoster"
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('addPoster')?.click()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Foto Grid */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-[#364153]">Gallery Foto</label>
                  <span className="text-xs text-muted-foreground">Upload dokumentasi (Max 5)</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    onClick={() => document.getElementById('addGalleryInput')?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-[#009966] hover:bg-emerald-50/50 transition-all h-32"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 text-center">Klik untuk upload foto</p>
                  </div>
                  <input
                    id="addGalleryInput"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryChange}
                  />

                  {galleryPreviews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden h-32 border border-gray-100 bg-gray-50">
                      <Image src={src} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* List Destinasi Wisata */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#364153]">List Destinasi Wisata</label>
                  <span className="text-xs text-gray-500">Tambahkan tempat yang dikunjungi</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tempDest}
                      onChange={(e) => setTempDest(e.target.value)}
                      onKeyDown={(e) => addDestination(e)}
                      placeholder="Ketik nama tempat wisata..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => addDestination()}
                    className="bg-[#009966] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#008055] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-100 rounded-xl min-h-[60px]">
                  {destinations.length > 0 ? destinations.map((dest, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#009966] rounded-full border border-[#009966]/20 shadow-sm animate-in fade-in zoom-in duration-200">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm font-medium">{dest}</span>
                      <button type="button" onClick={() => removeDestination(idx)} className="hover:text-red-500 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">Belum ada destinasi ditambahkan</p>
                  )}
                </div>
              </div>

              {/* Fasilitas & Icon */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#364153]">Fasilitas & Icon</label>
                  <span className="text-xs text-gray-500">Pilih icon yang sesuai agar menarik</span>
                </div>

                <div className="flex gap-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NAMA FASILITAS</label>
                    <input
                      type="text"
                      value={tempFacName}
                      onChange={(e) => setTempFacName(e.target.value)}
                      placeholder="Contoh: Tiket Masuk"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                    />
                  </div>
                  <div className="w-[200px] space-y-1 relative">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PILIH ICON</label>
                    <button
                      type="button"
                      onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white flex items-center justify-between hover:border-[#009966] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const SelectedIcon = ICON_OPTIONS.find(o => o.value === tempFacIcon)?.icon || Bus;
                          return <SelectedIcon className="w-4 h-4 text-[#009966]" />
                        })()}
                        <span className="truncate">{ICON_OPTIONS.find(o => o.value === tempFacIcon)?.label}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {isIconDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setTempFacIcon(opt.value);
                              setIsIconDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${tempFacIcon === opt.value ? 'bg-emerald-50 text-[#009966]' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <div className={`p-1.5 rounded-md ${tempFacIcon === opt.value ? 'bg-white' : 'bg-gray-100'}`}>
                              <opt.icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{opt.label}</span>
                            {tempFacIcon === opt.value && <Check className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addFacility}
                      className="h-[42px] w-[42px] bg-[#2563eb] text-white rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {facilities.map((fac, idx) => {
                    const FacIcon = ICON_OPTIONS.find(o => o.value === fac.icon)?.icon || Star;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#009966]">
                            <FacIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#101828]">{fac.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">icon: {fac.icon}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFacility(idx)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-[#009966] text-white font-medium rounded-lg hover:bg-[#008055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-100"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Paket'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Paket */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-3xl font-bold text-[#101828] tracking-tight">Edit Paket</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="px-6 py-6 space-y-6">
              {/* Row 1: Nama Paket */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Nama Paket Wisata</label>
                <input
                  type="text"
                  name="namaPaket"
                  value={editFormData.namaPaket}
                  onChange={handleEditInputChange}
                  placeholder="Bali Nusa Penida Exclusive"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                />
              </div>

              {/* Row 2: Harga & Tipe Paket */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Harga (IDR)</label>
                  <input
                    type="text"
                    name="nominalHarga"
                    value={editFormData.nominalHarga}
                    onChange={handleEditInputChange}
                    placeholder="2500000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                  {editFormData.nominalHarga && !isNaN(Number(editFormData.nominalHarga)) && (
                    <p className="text-xs text-gray-500 mt-1">
                      Terbaca: {formatRupiah(Number(editFormData.nominalHarga))}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Tipe Paket</label>
                  <select
                    name="tipePaket"
                    value={editFormData.tipePaket}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                  >
                    <option value="" disabled>Pilih tipe paket</option>
                    <option value="Premium">Premium</option>
                    <option value="Ekonomis">Ekonomis</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Lokasi, Durasi, Min Pax */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Lokasi / Daerah</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="namaDaerah"
                      value={editFormData.namaDaerah}
                      onChange={handleEditInputChange}
                      placeholder="Nusa Penida, Bali"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Durasi</label>
                  <input
                    type="text"
                    name="durasiIklan"
                    value={editFormData.durasiIklan}
                    onChange={handleEditInputChange}
                    placeholder="3 Hari 2 Malam"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Min. Pax</label>
                  <input
                    type="text"
                    name="minimalPenumpang"
                    value={editFormData.minimalPenumpang}
                    onChange={handleEditInputChange}
                    placeholder="2"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 4: Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Main Image */}
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Upload Gambar (Utama)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editFormData.imageFile ? editFormData.imageFile.name : (isValidUrl(selectedPackage?.gambar_url) ? 'Gambar Tersimpan' : '')}
                      placeholder="Pilih gambar utama"
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer text-ellipsis"
                      onClick={() => document.getElementById('editMainImage')?.click()}
                    />
                    <input
                      id="editMainImage"
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('editMainImage')?.click()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                {/* Upload Poster */}
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Upload Poster</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editFormData.posterFile ? editFormData.posterFile.name : (isValidUrl(selectedPackage?.poster_url) ? 'Poster Tersimpan' : '')}
                      placeholder="Pilih poster"
                      readOnly
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer text-ellipsis"
                      onClick={() => document.getElementById('editPoster')?.click()}
                    />
                    <input
                      id="editPoster"
                      type="file"
                      accept="image/*"
                      onChange={handleEditPosterChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('editPoster')?.click()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Upload className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Gallery Foto Grid */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-[#364153]">Gallery Foto</label>
                  <span className="text-xs text-muted-foreground">Upload dokumentasi (Max 5)</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Upload Button */}
                  <div
                    onClick={() => document.getElementById('editGalleryInput')?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-[#009966] hover:bg-emerald-50/50 transition-all h-32"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 text-center">Klik untuk upload foto</p>
                  </div>
                  <input
                    id="editGalleryInput"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryChange}
                  />

                  {/* Previews */}
                  {galleryPreviews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden h-32 border border-gray-100 bg-gray-50">
                      <Image src={src} alt="Preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* List Destinasi Wisata */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#364153]">List Destinasi Wisata</label>
                  <span className="text-xs text-gray-500">Tambahkan tempat yang dikunjungi</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={tempDest}
                      onChange={(e) => setTempDest(e.target.value)}
                      onKeyDown={(e) => addDestination(e)}
                      placeholder="Ketik nama tempat wisata..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => addDestination()}
                    className="bg-[#009966] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#008055] flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap gap-2 p-4 border-2 border-dashed border-gray-100 rounded-xl min-h-[60px]">
                  {destinations.length > 0 ? destinations.map((dest, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#009966] rounded-full border border-[#009966]/20 shadow-sm animate-in fade-in zoom-in duration-200">
                      <MapPin className="w-3 h-3" />
                      <span className="text-sm font-medium">{dest}</span>
                      <button type="button" onClick={() => removeDestination(idx)} className="hover:text-red-500 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 italic w-full text-center py-2">Belum ada destinasi ditambahkan</p>
                  )}
                </div>
              </div>

              {/* Fasilitas & Icon */}
              <div className="space-y-3">
                <div className="flex flex-col gap-1">
                  <label className="block text-sm font-medium text-[#364153]">Fasilitas & Icon</label>
                  <span className="text-xs text-gray-500">Pilih icon yang sesuai agar menarik</span>
                </div>

                <div className="flex gap-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">NAMA FASILITAS</label>
                    <input
                      type="text"
                      value={tempFacName}
                      onChange={(e) => setTempFacName(e.target.value)}
                      placeholder="Contoh: Tiket Masuk"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                    />
                  </div>
                  <div className="w-[200px] space-y-1 relative">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">PILIH ICON</label>
                    <button
                      type="button"
                      onClick={() => setIsIconDropdownOpen(!isIconDropdownOpen)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white flex items-center justify-between hover:border-[#009966] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {(() => {
                          const SelectedIcon = ICON_OPTIONS.find(o => o.value === tempFacIcon)?.icon || Bus;
                          return <SelectedIcon className="w-4 h-4 text-[#009966]" />
                        })()}
                        <span className="truncate">{ICON_OPTIONS.find(o => o.value === tempFacIcon)?.label}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {/* Custom Dropdown */}
                    {isIconDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
                        {ICON_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setTempFacIcon(opt.value);
                              setIsIconDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${tempFacIcon === opt.value ? 'bg-emerald-50 text-[#009966]' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <div className={`p-1.5 rounded-md ${tempFacIcon === opt.value ? 'bg-white' : 'bg-gray-100'}`}>
                              <opt.icon className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{opt.label}</span>
                            {tempFacIcon === opt.value && <Check className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addFacility}
                      className="h-[42px] w-[42px] bg-[#2563eb] text-white rounded-lg flex items-center justify-center hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Facilities List */}
                <div className="space-y-2">
                  {facilities.map((fac, idx) => {
                    const FacIcon = ICON_OPTIONS.find(o => o.value === fac.icon)?.icon || Star;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#009966]">
                            <FacIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#101828]">{fac.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">icon: {fac.icon}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFacility(idx)}
                          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-[#009966] text-white font-medium rounded-lg hover:bg-[#008055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-emerald-100"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-[#ffe2e2] rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#e7000b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <p className="text-center text-[#101828] text-base mb-6">
              Apakah Anda yakin ingin menghapus item ini?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmDelete}
                className="bg-[#e7000b] text-white px-8 py-3 rounded-lg text-base hover:bg-[#c00009] transition-colors"
              >
                Ya, Hapus
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-[#99a1af] text-white px-8 py-3 rounded-lg text-base hover:bg-[#808894] transition-colors"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
