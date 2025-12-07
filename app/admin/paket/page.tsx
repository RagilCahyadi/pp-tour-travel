'use client'

import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'
import { useState } from 'react'
import { useTourPackages } from '@/lib/hooks/useTourPackages'
import { formatRupiah } from '@/lib/utils/helpers'
import { uploadImage, deleteImage, isValidUrl } from '@/lib/utils/storage'

export default function AdminPaketPage() {
  const { packages, loading, error, createPackage, updatePackage, deletePackage, toggleActiveStatus, refetch } = useTourPackages()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Semua Tipe')
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    namaPaket: '',
    durasiIklan: '',
    tipePaket: '',
    nominalHarga: '',
    namaDaerah: '',
    minimalPenumpang: '',
    brosurFile: null as File | null
  })
  const [editFormData, setEditFormData] = useState({
    namaPaket: '',
    durasiIklan: '',
    tipePaket: '',
    nominalHarga: '',
    namaDaerah: '',
    pulauBali: '',
    minimalPenumpang: '',
    brosurFile: null as File | null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, brosurFile: e.target.files![0] }))
    }
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData(prev => ({ ...prev, brosurFile: e.target.files![0] }))
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
      let imageUrl = null
      
      // Upload image if file is selected
      if (formData.brosurFile) {
        console.log('Uploading image...', formData.brosurFile.name)
        const { url, error: uploadError } = await uploadImage(formData.brosurFile)
        
        if (uploadError) {
          alert(`❌ Gagal upload gambar: ${uploadError}`)
          setIsUploading(false)
          return
        }
        
        imageUrl = url
        console.log('Image uploaded:', imageUrl)
      }
      
      const packageData = {
        nama_paket: formData.namaPaket,
        lokasi: formData.namaDaerah || 'Indonesia',
        durasi: formData.durasiIklan || '1 hari',
        tipe_paket: formData.tipePaket as 'Premium' | 'Ekonomis',
        harga: parseInt(formData.nominalHarga.replace(/\D/g, '')) || 0,
        minimal_penumpang: parseInt(formData.minimalPenumpang) || 1,
        nama_daerah: formData.namaDaerah || undefined,
        gambar_url: imageUrl || undefined
      }
      
      const result = await createPackage(packageData)
      
      if (result.error) {
        alert(`❌ Gagal menambahkan paket: ${result.error}`)
        setIsUploading(false)
        return
      }
      
      alert('✅ Paket tour berhasil ditambahkan!')
      setIsModalOpen(false)
      // Reset form
      setFormData({
        namaPaket: '',
        durasiIklan: '',
        tipePaket: '',
        nominalHarga: '',
        namaDaerah: '',
        minimalPenumpang: '',
        brosurFile: null
      })
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
    
    console.log('Edit form data:', editFormData) // Debug
    console.log('Selected package before update:', selectedPackage) // Debug
    
    setIsUploading(true)
    
    try {
      let imageUrl = selectedPackage.gambar_url // Keep existing image URL
      
      // Upload new image if file is selected
      if (editFormData.brosurFile) {
        console.log('Uploading new image...', editFormData.brosurFile.name)
        
        // Delete old image if exists
        if (selectedPackage.gambar_url && isValidUrl(selectedPackage.gambar_url)) {
          console.log('Deleting old image...')
          await deleteImage(selectedPackage.gambar_url)
        }
        
        // Upload new image
        const { url, error: uploadError } = await uploadImage(editFormData.brosurFile)
        
        if (uploadError) {
          alert(`❌ Gagal upload gambar: ${uploadError}`)
          setIsUploading(false)
          return
        }
        
        imageUrl = url
        console.log('New image uploaded:', imageUrl)
      }
      
      const packageData: any = {
        nama_paket: editFormData.namaPaket,
        lokasi: editFormData.namaDaerah || 'Indonesia',
        durasi: editFormData.durasiIklan || '1 hari',
        tipe_paket: editFormData.tipePaket as 'Premium' | 'Ekonomis',
        harga: parseInt(editFormData.nominalHarga.replace(/\D/g, '')) || 0,
        minimal_penumpang: parseInt(editFormData.minimalPenumpang) || 1,
        nama_daerah: editFormData.pulauBali || editFormData.namaDaerah || null,
        gambar_url: imageUrl
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
        `Nama Daerah: ${packageData.nama_daerah}\n` +
        `Harga: Rp ${packageData.harga.toLocaleString('id-ID')}\n` +
        (imageUrl ? `Gambar: Berhasil diupload` : '')
      
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
      brosurFile: null
    })
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
        alert(`❌ Gagal menghapus paket: ${result.error}`)
        return
      }
      
      alert('✅ Paket tour berhasil dihapus!')
      setIsDeleteModalOpen(false)
      setSelectedPackage(null)
    } catch (err: any) {
      console.error('Error deleting package:', err)
      alert(`❌ Terjadi kesalahan: ${err.message}`)
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

  const stats = {
    total: packages.length,
    premium: packages.filter(p => p.tipe_paket === 'Premium').length,
    ekonomis: packages.filter(p => p.tipe_paket === 'Ekonomis').length
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="paket" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#101828] tracking-tight">
                Kelola Paket Tour Travel
              </h1>
              <p className="text-base text-[#6a7282] mt-1">
                Manage semua paket wisata Anda
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
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
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari paket tour berdasarkan nama atau destinasi..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009966]"
                />
              </div>
              <div className="flex items-center gap-3">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="border border-gray-200 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#009966]"
                >
                  <option>Semua Tipe</option>
                  <option>Premium</option>
                  <option>Ekonomis</option>
                </select>
                <button className="border border-gray-200 rounded-2xl px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#364153]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-[#364153]">Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
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
                  <p className="text-base text-[#101828] font-semibold">Rp 976K</p>
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
            <div className="grid grid-cols-3 gap-6">
              {filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
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
                    <span className={`px-3 py-1 rounded-full text-xs text-white border ${
                      pkg.tipe_paket === 'Premium' 
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
              <div className="col-span-3 bg-white border border-gray-100 rounded-2xl shadow-md p-16 text-center">
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
          )}
        </div>
      </div>

      {/* Modal Tambah Paket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
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
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              {/* Row 1: Nama Paket & Durasi Iklan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nama Paket</label>
                  <input
                    type="text"
                    name="namaPaket"
                    value={formData.namaPaket}
                    onChange={handleInputChange}
                    placeholder="Tambahkan nama paket"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Durasi Iklan</label>
                  <input
                    type="text"
                    name="durasiIklan"
                    value={formData.durasiIklan}
                    onChange={handleInputChange}
                    placeholder="Berapa hari"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 2: Tipe Paket & Nominal Harga */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Tipe Paket</label>
                  <select
                    name="tipePaket"
                    value={formData.tipePaket}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                  >
                    <option value="">Pilih tipe paket</option>
                    <option value="Premium">Premium</option>
                    <option value="Ekonomis">Ekonomis</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nominal Harga</label>
                  <input
                    type="text"
                    name="nominalHarga"
                    value={formData.nominalHarga}
                    onChange={handleInputChange}
                    placeholder="Berapa hari"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 3: Nama Daerah & Upload Brosur */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nama Daerah</label>
                  <input
                    type="text"
                    name="namaDaerah"
                    value={formData.namaDaerah}
                    onChange={handleInputChange}
                    placeholder="Tambahkan nama daerah"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Upload Brosur Poster</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.brosurFile?.name || ''}
                      placeholder="Pilih gambar"
                      readOnly
                      className="w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer"
                      onClick={() => document.getElementById('fileInput')?.click()}
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('fileInput')?.click()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Minimal Penumpang */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Minimal Penumpang</label>
                <input
                  type="text"
                  name="minimalPenumpang"
                  value={formData.minimalPenumpang}
                  onChange={handleInputChange}
                  placeholder="Tambahkan Minimal Penumpang"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#009966] text-white py-3 rounded-lg text-base font-medium hover:bg-[#008055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengupload...</span>
                  </>
                ) : (
                  'Di Simpan'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Paket */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
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
            <form onSubmit={handleEditSubmit} className="px-6 py-6 space-y-4">
              {/* Row 1: Nama Paket & Durasi Iklan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nama Paket</label>
                  <input
                    type="text"
                    name="namaPaket"
                    value={editFormData.namaPaket}
                    onChange={handleEditInputChange}
                    placeholder="Paket Bali Premium"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Durasi Iklan</label>
                  <input
                    type="text"
                    name="durasiIklan"
                    value={editFormData.durasiIklan}
                    onChange={handleEditInputChange}
                    placeholder="4 Hari 2 Malam"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 2: Tipe Paket & Nominal Harga */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Tipe Paket</label>
                  <select
                    name="tipePaket"
                    value={editFormData.tipePaket}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] bg-white"
                  >
                    <option value="">Pilih tipe paket</option>
                    <option value="Premium">Premium</option>
                    <option value="Ekonomis">Ekonomis</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nominal Harga</label>
                  <input
                    type="text"
                    name="nominalHarga"
                    value={editFormData.nominalHarga}
                    onChange={handleEditInputChange}
                    placeholder="1450000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 3: Nama Daerah & Pulau Bali */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Nama Daerah</label>
                  <input
                    type="text"
                    name="namaDaerah"
                    value={editFormData.namaDaerah}
                    onChange={handleEditInputChange}
                    placeholder="Bali, Indonesia"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-[#364153]">Pulau</label>
                  <input
                    type="text"
                    name="pulauBali"
                    value={editFormData.pulauBali}
                    onChange={handleEditInputChange}
                    placeholder="Pulau Bali"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Upload Gambar */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Upload Gambar Paket</label>
                <div className="relative">
                  <input
                    type="text"
                    value={editFormData.brosurFile?.name || (selectedPackage?.gambar_url ? selectedPackage.gambar_url.split('/').pop() : 'Pilih gambar...')}
                    placeholder="Pilih file gambar"
                    readOnly
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer bg-gray-50"
                    onClick={() => document.getElementById('editFileInput')?.click()}
                  />
                  <input
                    id="editFileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('editFileInput')?.click()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </button>
                </div>
                {editFormData.brosurFile && (
                  <p className="text-xs text-[#009966]">✓ File dipilih: {editFormData.brosurFile.name}</p>
                )}
              </div>

              {/* Row 4: Minimal Penumpang */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Minimal Penumpang</label>
                <input
                  type="text"
                  name="minimalPenumpang"
                  value={editFormData.minimalPenumpang}
                  onChange={handleEditInputChange}
                  placeholder="50"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#009966] text-white py-3 rounded-lg text-base font-medium hover:bg-[#008055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Mengupload...</span>
                  </>
                ) : (
                  'Di Simpan'
                )}
              </button>
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
