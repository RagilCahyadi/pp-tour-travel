'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

const imgLogo = "/Logo_Transparent_White.png"

export default function AdminDashboard() {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <div className="bg-white relative min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-[#009966] via-[#007a55] to-[#006045] shadow-2xl flex flex-col">
        {/* Logo Section */}
        <div className="border-b border-[rgba(0,188,125,0.3)] p-6">
          <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-4">
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
            <p className="text-white font-bold text-xl text-center tracking-tight">
              PP TOUR TRAVEL
            </p>
            <p className="text-[#a4f4cf] text-center text-base mt-2">
              Admin Dashboard
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 bg-white text-[#007a55] rounded-2xl shadow-lg font-semibold"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/admin/paket"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Paket</span>
          </Link>

          <Link
            href="/admin/pemesanan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <span>Pemesanan</span>
          </Link>

          <Link
            href="/admin/pembayaran"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>Pembayaran</span>
          </Link>

          <Link
            href="/admin/penjadwalan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>Penjadwalan</span>
          </Link>

          <Link
            href="/admin/pengaturan"
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <span>Pengaturan</span>
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="border-t border-[rgba(0,188,125,0.3)] p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-emerald-50 rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors w-full"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 overflow-auto">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#101828] tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-[#6a7282] mt-1">
                Selamat datang kembali, Admin! 👋
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009966]"
                />
                <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Notification */}
              <button className="relative p-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>

              {/* Settings */}
              <button className="p-2.5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:bg-gray-50">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg ring-2 ring-[#00bc7d]"></div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            {/* Booking Bulan Ini */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#6a7282] text-sm mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>Booking Bulan Ini</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#101828] mb-2">24</h2>
                  <div className="flex items-center gap-2 text-sm text-[#009966]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+15% dari bulan lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pendapatan Bulan Ini */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#6a7282] text-sm mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span>Pendapatan Bulan Ini</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#101828] mb-2">Rp 72,5 jt</h2>
                  <div className="flex items-center gap-2 text-sm text-[#009966]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>+25% dari bulan lalu</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Menunggu Verifikasi */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#6a7282] text-sm mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Menunggu Verifikasi</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#101828] mb-2">3</h2>
                  <div className="flex items-center gap-2 text-sm text-[#e17100]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Perlu perhatian</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Keberangkatan Minggu Ini */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#6a7282] text-sm mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <span>Keberangkatan Minggu Ini</span>
                  </div>
                  <h2 className="text-3xl font-bold text-[#101828] mb-2">7</h2>
                  <p className="text-sm text-[#4a5565]">2 hari ini</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Trend Booking */}
            <div className="col-span-2 bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#101828] mb-6">
                Trend Booking 7 Bulan Terakhir
              </h3>
              <div className="h-72 flex items-center justify-center text-gray-400">
                {/* Placeholder for chart */}
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  <p>Chart akan ditampilkan di sini</p>
                </div>
              </div>
            </div>

            {/* Status Pembayaran */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#101828] mb-6">
                Status Pembayaran
              </h3>
              <div className="h-48 flex items-center justify-center mb-6">
                {/* Placeholder for donut chart */}
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="220 280" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="30 280" strokeDashoffset="-220" transform="rotate(-90 50 50)" />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-[#4a5565]">Sudah Dibayar</span>
                  </div>
                  <span className="text-sm font-medium text-[#101828]">21</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-[#4a5565]">Menunggu Verifikasi</span>
                  </div>
                  <span className="text-sm font-medium text-[#101828]">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Paket Tour Terpopuler */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-[#101828] mb-6">
              Paket Tour Terpopuler Bulan Ini
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-32">Bali 5D4N</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div className="bg-emerald-500 h-8 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-32">Bromo 3D2N</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div className="bg-emerald-500 h-8 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-32">Yogyakarta 4D3N</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div className="bg-emerald-500 h-8 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 w-32">Raja Ampat 6D5N</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                  <div className="bg-emerald-500 h-8 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Booking Terbaru */}
            <div className="col-span-2 bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#101828]">Booking Terbaru</h3>
                <Link href="/admin/pemesanan" className="text-sm text-[#009966] hover:underline">
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-3">
                {/* Booking Item 1 */}
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#101828]">Sigit</span>
                        <span className="bg-yellow-100 text-[#bb4d00] text-xs px-2 py-1 rounded">Menunggu Verifikasi</span>
                      </div>
                      <p className="text-[#6a7282] text-sm">Paket Bali Ekonomis • 2 orang</p>
                      <p className="text-[#99a1af] text-sm">10 menit lalu</p>
                    </div>
                  </div>
                  <span className="text-[#99a1af] text-sm">BHRS937</span>
                </div>

                {/* Booking Item 2 */}
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-[#101828] block mb-1">Dewi Kusuma</span>
                      <p className="text-[#6a7282] text-sm">Paket Yogyakarta Premium • 3 orang</p>
                      <p className="text-[#99a1af] text-sm">1 jam lalu</p>
                    </div>
                  </div>
                  <span className="text-[#99a1af] text-sm">DEWK123</span>
                </div>

                {/* Booking Item 3 */}
                <div className="border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-[#101828] block mb-1">Bambang</span>
                      <p className="text-[#6a7282] text-sm">Paket Bali Premium • 4 orang</p>
                      <p className="text-[#99a1af] text-sm">2 jam lalu</p>
                    </div>
                  </div>
                  <span className="text-[#99a1af] text-sm">BAMH760</span>
                </div>
              </div>
            </div>

            {/* Keberangkatan Terdekat */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#101828] mb-6">
                Keberangkatan Terdekat
              </h3>
              <div className="space-y-4">
                {/* Departure 1 */}
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#101828] mb-1">Bali 5D4N</h4>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282] mb-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Hari Ini, 08:00</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282]">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>10 orang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departure 2 */}
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#101828] mb-1">Bromo 3D2N</h4>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282] mb-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Besok, 05:00</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282]">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>8 orang</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Departure 3 */}
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-[#101828] mb-1">Yogyakarta 4D3N</h4>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282] mb-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>8 Des, 07:00</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#6a7282]">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <span>6 orang</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
