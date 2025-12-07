'use client'

import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const imgLogo = "/Logo_Transparent_White.png"

export default function AdminPaketPage() {
  const router = useRouter()
  const { signOut } = useClerk()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
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

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form data:', formData)
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
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle edit form submission here
    console.log('Edit data:', editFormData)
    setIsEditModalOpen(false)
  }

  const handleEditClick = (pkg: any) => {
    setSelectedPackage(pkg)
    setEditFormData({
      namaPaket: pkg.name,
      durasiIklan: pkg.duration,
      tipePaket: pkg.type,
      nominalHarga: pkg.price.replace('Rp ', '').replace('.', ''),
      namaDaerah: pkg.location,
      pulauBali: 'Pulau Bali',
      minimalPenumpang: pkg.minPeople.replace(' orang', ''),
      brosurFile: null
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (pkg: any) => {
    setSelectedPackage(pkg)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    console.log('Deleting package:', selectedPackage)
    // TODO: Implement actual delete API call
    setIsDeleteModalOpen(false)
    setSelectedPackage(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedPackage(null)
  }

  // Mock data for packages
  const packages = [
    {
      id: 1,
      name: 'Paket Bali Premium',
      image: '/images/bali-premium.jpg',
      location: 'Bali, Indonesia',
      duration: '4 Hari 2 Malam',
      minPeople: '50 orang',
      price: 'Rp 1.450.000',
      type: 'Premium'
    },
    {
      id: 2,
      name: 'Paket Bali Ekonomis',
      image: '/images/bali-ekonomis.jpg',
      location: 'Bali, Indonesia',
      duration: '3 Hari 1 Malam',
      minPeople: '30 orang',
      price: 'Rp 1.000.000',
      type: 'Ekonomis'
    },
    {
      id: 3,
      name: 'Paket Yogyakarta Premium',
      image: '/images/yogyakarta-premium.jpg',
      location: 'Yogyakarta, Indonesia',
      duration: '2 Hari 1 Malam',
      minPeople: '40 orang',
      price: 'Rp 750.000',
      type: 'Premium'
    },
    {
      id: 4,
      name: 'Paket Yogyakarta Ekonomis',
      image: '/images/yogyakarta-ekonomis.jpg',
      location: 'Yogyakarta, Indonesia',
      duration: '2 Hari 1 Malam',
      minPeople: '25 orang',
      price: 'Rp 690.000',
      type: 'Ekonomis'
    },
    {
      id: 5,
      name: 'Paket Bandung Ekonomis',
      image: '/images/bandung-ekonomis.jpg',
      location: 'Bandung, Indonesia',
      duration: '3 Hari 1 Malam',
      minPeople: '35 orang',
      price: 'Rp 990.000',
      type: 'Ekonomis'
    }
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#009966] via-[#007a55] to-[#006045] shadow-2xl">
        {/* Logo Section */}
        <div className="border-b border-[rgba(0,188,125,0.3)] p-6">
          <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="relative w-24 h-24">
                  <Image
                    src={imgLogo}
                    alt="PP Tour Travel Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">PP TOUR TRAVEL</h1>
              <p className="text-[#a4f4cf] text-base mt-2">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 px-4 flex-1">
          <Link 
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl mb-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-base">Dashboard</span>
          </Link>

          <div className="bg-white px-4 py-3 rounded-2xl mb-2 shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#007a55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-base font-semibold text-[#007a55]">Paket</span>
            </div>
          </div>

          <Link 
            href="/admin/pemesanan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl mb-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-base">Pemesanan</span>
          </Link>

          <Link 
            href="/admin/pembayaran"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl mb-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-base">Pembayaran</span>
          </Link>

          <Link 
            href="/admin/penjadwalan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl mb-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-base">Penjadwalan</span>
          </Link>

          <Link 
            href="/admin/pengaturan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl mb-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-base">Pengaturan</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-[rgba(0,188,125,0.3)] p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-white/10 rounded-2xl w-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-base">Keluar</span>
          </button>
        </div>
      </div>

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
                  placeholder="Cari paket tour berdasarkan nama atau destinasi..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#009966]"
                />
              </div>
              <div className="flex items-center gap-3">
                <select className="border border-gray-200 rounded-2xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-[#009966]">
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
                  <p className="text-base text-[#101828] font-semibold">5</p>
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
                  <p className="text-base text-[#101828] font-semibold">2</p>
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
                  <p className="text-base text-[#101828] font-semibold">3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden">
                {/* Package Image */}
                <div className="relative h-48">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs text-white border ${
                      pkg.type === 'Premium' 
                        ? 'bg-[rgba(254,154,0,0.9)] border-[#ffb900]' 
                        : 'bg-[rgba(43,127,255,0.9)] border-[#51a2ff]'
                    }`}>
                      {pkg.type}
                    </span>
                  </div>
                </div>

                {/* Package Details */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-[#101828] mb-2">{pkg.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-[#6a7282]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-[#6a7282]">{pkg.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#4a5565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-[#4a5565]">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#4a5565]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-sm text-[#4a5565]">Min. {pkg.minPeople}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                      <p className="text-base text-[#6a7282]">Mulai dari</p>
                      <p className="text-base text-[#009966] font-semibold">{pkg.price}</p>
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
            ))}
          </div>
        </div>
      </div>

      {/* Modal Tambah Paket */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                className="w-full bg-[#009966] text-white py-3 rounded-lg text-base font-medium hover:bg-[#008055] transition-colors"
              >
                Di Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Paket */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
                  <label className="block text-sm text-[#364153]">Pulau Bali</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={editFormData.brosurFile?.name || 'bali.jpg'}
                      placeholder="bali.jpg"
                      readOnly
                      className="w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none placeholder:text-gray-400 cursor-pointer"
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
                </div>
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
                className="w-full bg-[#009966] text-white py-3 rounded-lg text-base font-medium hover:bg-[#008055] transition-colors"
              >
                Di Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
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
