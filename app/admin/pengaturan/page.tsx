'use client'

import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'
import { useState } from 'react'

export default function AdminPengaturanPage() {
  const [profileData, setProfileData] = useState({
    nama: 'Gatot Subroto',
    hakAkses: 'Admin-1',
    negara: 'Indonesia',
    kota: 'Gresik',
    alamat: 'Jalan Raya Kebomas',
    email: 'admin1@gmail.com',
    nomorHp: '088176847238',
    bahasa: 'id',
    zonaWaktu: 'GMT+7'
  })

  const [companyData, setCompanyData] = useState({
    namaPerusahaan: 'PP Tour Travel',
    alamatKantor: 'Jl. Raya Kebomas No. 123, Gresik, Jawa Timur',
    teleponKantor: '031-1234567',
    whatsappBisnis: '6281234567890',
    emailBisnis: 'info@pptourtravel.com'
  })

  const [notifications, setNotifications] = useState({
    email: true,
    bookingBaru: true,
    pembayaran: true,
    laporanMingguan: false
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompanyData(prev => ({ ...prev, [name]: value }))
  }

  const handleNotificationToggle = (key: string) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData)
    // TODO: Implement save logic
  }

  const handleSaveCompany = () => {
    console.log('Saving company:', companyData)
    // TODO: Implement save logic
  }

  const handleSaveNotifications = () => {
    console.log('Saving notifications:', notifications)
    // TODO: Implement save logic
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="pengaturan" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6" style={{ background: 'linear-gradient(141.98deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">Pengaturan Profil</h1>
            <p className="text-[#6a7282] text-base">Kelola profil, keamanan, dan preferensi akun Anda</p>
          </div>

          {/* Profil Admin Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-[#009966] to-[#00bc7d] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-[16.4px] p-2.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Profil Admin</h2>
                  <p className="text-[#d0fae5]">Informasi pribadi dan kontak</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Left Column - Profile Photo & Settings */}
              <div className="space-y-6">
                <div className="border border-gray-100 rounded-[16.4px] p-6">
                  <label className="block text-sm text-[#364153] mb-3">Foto Profil</label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32">
                      <div className="w-32 h-32 rounded-full border-4 border-[#d0fae5] overflow-hidden shadow-md">
                        <Image
                          src="https://www.figma.com/api/mcp/asset/6501e1a0-3a9f-4561-b69e-eeda69df911c"
                          alt="Profile"
                          width={128}
                          height={128}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#009966] text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Unggah Gambar
                      </button>
                      <button className="px-4 py-2 bg-red-50 border border-[#ffc9c9] text-[#e7000b] text-sm rounded-[10px] hover:bg-red-100 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time & Language */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-[#364153] mb-4">Waktu dan Bahasa</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2">Pilih Bahasa</label>
                      <select
                        name="bahasa"
                        value={profileData.bahasa}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]">
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2">Zona Waktu</label>
                      <select
                        name="zonaWaktu"
                        value={profileData.zonaWaktu}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]">
                        <option value="GMT+7">GMT +7:00 (Jakarta)</option>
                        <option value="GMT+8">GMT +8:00 (Bali)</option>
                        <option value="GMT+9">GMT +9:00 (Jayapura)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - General Information */}
              <div className="col-span-2 border border-gray-100 rounded-[16.4px] p-6">
                <h3 className="text-xl font-semibold text-[#364153] mb-6">Informasi Umum</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Nama</label>
                    <input
                      type="text"
                      name="nama"
                      value={profileData.nama}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Hak Akses</label>
                    <input
                      type="text"
                      name="hakAkses"
                      value={profileData.hakAkses}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[#6a7282]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Negara</label>
                    <input
                      type="text"
                      name="negara"
                      value={profileData.negara}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Kota</label>
                    <input
                      type="text"
                      name="kota"
                      value={profileData.kota}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-[#6a7282] mb-2">Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      value={profileData.alamat}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Nomor HP</label>
                    <input
                      type="tel"
                      name="nomorHp"
                      value={profileData.nomorHp}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-[16.4px] hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Active Sessions Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Red Gradient */}
            <div className="bg-gradient-to-r from-[#e7000b] to-[#fb2c36] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-[16.4px] p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Keamanan & Sesi Aktif</h2>
                    <p className="text-[#ffe2e2]">Kelola perangkat yang terhubung dengan akun Anda</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 text-white text-sm rounded-[10px] hover:bg-white/30 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar dari Semua Perangkat
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* OAuth Notice */}
              <div className="bg-blue-50 border border-[#bedbff] rounded-[16.4px] p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-[10px] p-2.5">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#101828] font-medium">Login dengan Google OAuth</p>
                    <p className="text-[#4a5565] text-sm">Akun Anda dilindungi oleh Google. Keamanan password dikelola melalui akun Google Anda.</p>
                  </div>
                </div>
              </div>

              {/* Connected Devices */}
              <div>
                <h3 className="text-xl font-semibold text-[#364153] mb-4">Perangkat yang Terhubung</h3>
                <div className="space-y-3">
                  {/* Device 1 - Current */}
                  <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 rounded-[16.4px] p-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[#101828] font-medium">Windows PC</p>
                          <span className="px-2 py-0.5 bg-[#d0fae5] text-[#007a55] text-xs rounded">Perangkat Ini</span>
                        </div>
                        <p className="text-[#6a7282] text-sm">Chrome 120 • Gresik, Jawa Timur</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3 text-[#99a1af]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" />
                          </svg>
                          <span className="text-[#99a1af] text-sm">Aktif sekarang</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Device 2 - iPhone */}
                  <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 rounded-[16.4px] p-3">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#101828] font-medium mb-1">iPhone 13</p>
                        <p className="text-[#6a7282] text-sm">Safari • Surabaya, Jawa Timur</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3 text-[#99a1af]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" />
                          </svg>
                          <span className="text-[#99a1af] text-sm">2 jam yang lalu</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-[#ffc9c9] text-[#e7000b] text-sm rounded-[10px] hover:bg-red-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluarkan
                    </button>
                  </div>

                  {/* Device 3 - MacBook */}
                  <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 rounded-[16.4px] p-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[#101828] font-medium mb-1">MacBook Pro</p>
                        <p className="text-[#6a7282] text-sm">Chrome 119 • Jakarta, DKI Jakarta</p>
                        <div className="flex items-center gap-1 mt-1">
                          <svg className="w-3 h-3 text-[#99a1af]" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="8" />
                          </svg>
                          <span className="text-[#99a1af] text-sm">1 hari yang lalu</span>
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-[#ffc9c9] text-[#e7000b] text-sm rounded-[10px] hover:bg-red-100 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluarkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Tips */}
              <div className="bg-amber-50 border border-[#fee685] rounded-[16.4px] p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-[#101828] font-medium mb-1">Tips Keamanan</p>
                    <ul className="text-[#4a5565] text-xs space-y-1">
                      <li>• Jika Anda melihat aktivitas yang mencurigakan, segera keluarkan perangkat tersebut</li>
                      <li>• Pastikan Anda logout setelah menggunakan perangkat umum atau bersama</li>
                      <li>• Gunakan koneksi internet yang aman saat mengakses dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Settings Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Blue Gradient */}
            <div className="bg-gradient-to-r from-[#155dfc] to-[#2b7fff] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-[16.4px] p-2.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Pengaturan Perusahaan</h2>
                  <p className="text-blue-100">Informasi travel agency dan kontak bisnis</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Left Column - Company Logo */}
              <div className="border border-gray-100 rounded-[16.4px] p-6">
                <label className="block text-sm text-[#364153] mb-3">Logo Perusahaan</label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 border-2 border-gray-200 rounded-[16.4px] flex items-center justify-center bg-white shadow-md">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#155dfc] text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Logo
                  </button>
                </div>
              </div>

              {/* Right Column - Business Information */}
              <div className="col-span-2 border border-gray-100 rounded-[16.4px] p-6">
                <h3 className="text-xl font-semibold text-[#364153] mb-6">Informasi Bisnis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Nama Perusahaan</label>
                    <input
                      type="text"
                      name="namaPerusahaan"
                      value={companyData.namaPerusahaan}
                      onChange={handleCompanyChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Alamat Kantor</label>
                    <textarea
                      name="alamatKantor"
                      value={companyData.alamatKantor}
                      onChange={handleCompanyChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2">Telepon Kantor</label>
                      <input
                        type="tel"
                        name="teleponKantor"
                        value={companyData.teleponKantor}
                        onChange={handleCompanyChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2">WhatsApp Bisnis</label>
                      <input
                        type="tel"
                        name="whatsappBisnis"
                        value={companyData.whatsappBisnis}
                        onChange={handleCompanyChange}
                        placeholder="6281234567890"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Email Bisnis</label>
                    <input
                      type="email"
                      name="emailBisnis"
                      value={companyData.emailBisnis}
                      onChange={handleCompanyChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#155dfc]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={handleSaveCompany}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#155dfc] to-[#2b7fff] text-white rounded-[16.4px] hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Purple Gradient */}
            <div className="bg-gradient-to-r from-[#9810fa] to-[#ad46ff] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-[16.4px] p-2.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Preferensi Notifikasi</h2>
                  <p className="text-purple-100">Atur notifikasi email untuk berbagai aktivitas</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="max-w-2xl space-y-3">
                {/* Notification Item 1 */}
                <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#d0fae5] rounded-[10px] p-2.5">
                      <svg className="w-5 h-5 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#101828] font-medium">Notifikasi Email</p>
                      <p className="text-[#6a7282] text-sm">Terima notifikasi melalui email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('email')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications.email ? 'bg-[#009966]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.email ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {/* Notification Item 2 */}
                <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-[10px] p-2.5">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#101828] font-medium">Alert Booking Baru</p>
                      <p className="text-[#6a7282] text-sm">Notifikasi saat ada booking baru</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('bookingBaru')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications.bookingBaru ? 'bg-[#009966]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.bookingBaru ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {/* Notification Item 3 */}
                <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#fef3c6] rounded-[10px] p-2.5">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#101828] font-medium">Alert Pembayaran</p>
                      <p className="text-[#6a7282] text-sm">Notifikasi saat ada pembayaran menunggu verifikasi</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('pembayaran')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications.pembayaran ? 'bg-[#009966]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.pembayaran ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {/* Notification Item 4 */}
                <div className="border border-gray-200 rounded-[16.4px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 rounded-[10px] p-2.5">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#101828] font-medium">Laporan Mingguan</p>
                      <p className="text-[#6a7282] text-sm">Terima ringkasan laporan setiap minggu</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNotificationToggle('laporanMingguan')}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifications.laporanMingguan ? 'bg-[#009966]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notifications.laporanMingguan ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end max-w-2xl">
                <button 
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#9810fa] to-[#ad46ff] text-white rounded-[16.4px] hover:opacity-90 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Preferensi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
