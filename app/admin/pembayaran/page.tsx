'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState } from 'react'
import { usePayments } from '@/lib/hooks/usePayments'
import { formatRupiah } from '@/lib/utils/helpers'
import { supabase } from '@/lib/supabase'

export default function AdminPembayaranPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const { payments, loading, error, verifyPayment, rejectPayment, deletePayment, refetch } = usePayments(selectedTab === 'all' ? undefined : selectedTab)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [verificationNote, setVerificationNote] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSelectPayment = (id: string) => {
    if (selectedPayment === id) {
      setSelectedPayment(null)
    } else {
      setSelectedPayment(id)
    }
  }

  const handleVerifyClick = () => {
    if (selectedPayment) {
      setIsVerifyModalOpen(true)
    }
  }

  const handleConfirmVerify = async () => {
    if (!verificationNote.trim()) {
      alert('Mohon berikan catatan verifikasi!')
      return
    }
    
    if (!selectedPayment) {
      alert('Tidak ada pembayaran yang dipilih!')
      return
    }
    
    try {
      // For now, use null for verified_by (allowed by schema: ON DELETE SET NULL)
      // This avoids auth session issues while still allowing payment verification
      const result = await verifyPayment(selectedPayment, null, verificationNote)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Close modal
      setIsVerifyModalOpen(false)
      setVerificationNote('')
      setSelectedPayment(null)
      
      // Switch to "Semua" tab to show the verified payment
      // (If we stay on "Menunggu" tab, the verified payment will disappear from the list)
      setSelectedTab('all')
      
      // Refresh data will happen automatically via useEffect when selectedTab changes
      
      alert(`✅ Pembayaran berhasil diverifikasi!\n\n💡 Anda dipindahkan ke tab "Semua" untuk melihat pembayaran yang sudah diverifikasi.`)
    } catch (err: any) {
      console.error('Error verifying payment:', err)
      alert(`❌ Gagal memverifikasi pembayaran:\n${err.message || err}`)
    }
  }

  const handleRejectPayment = async () => {
    if (!verificationNote.trim()) {
      alert('Mohon berikan alasan penolakan!')
      return
    }
    
    if (!selectedPayment) {
      alert('Tidak ada pembayaran yang dipilih!')
      return
    }
    
    if (!confirm('Apakah Anda yakin ingin menolak pembayaran ini?')) {
      return
    }
    
    try {
      const result = await rejectPayment(selectedPayment, null, verificationNote)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Close modal
      setIsVerifyModalOpen(false)
      setVerificationNote('')
      setSelectedPayment(null)
      
      // Switch to "Semua" tab to show the rejected payment
      setSelectedTab('all')
      
      alert(`✅ Pembayaran berhasil ditolak!\n\n💡 Anda dipindahkan ke tab "Semua" untuk melihat pembayaran yang ditolak.`)
    } catch (err: any) {
      console.error('Error rejecting payment:', err)
      alert(`❌ Gagal menolak pembayaran:\n${err.message || err}`)
    }
  }

  const handleDeleteClick = () => {
    if (selectedPayment) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedPayment) return
    
    try {
      const result = await deletePayment(selectedPayment)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      setIsDeleteModalOpen(false)
      setSelectedPayment(null)
      
      alert('✅ Pembayaran berhasil dihapus!')
    } catch (err: any) {
      console.error('Error deleting payment:', err)
      alert(`❌ Gagal menghapus pembayaran:\n${err.message || err}`)
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (searchQuery === '') return true
    
    const searchLower = searchQuery.toLowerCase()
    const customerName = payment.bookings.customers.nama_pelanggan?.toLowerCase() || ''
    const company = payment.bookings.customers.nama_perusahaan?.toLowerCase() || ''
    const bookingCode = payment.bookings.kode_booking?.toLowerCase() || ''
    
    return customerName.includes(searchLower) || 
           company.includes(searchLower) || 
           bookingCode.includes(searchLower)
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPayments = filteredPayments.slice(startIndex, endIndex)

  // Reset to page 1 when search or tab changes
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const stats = {
    total: payments.length,
    verified: payments.filter(p => p.status === 'verified').length,
    pending: payments.filter(p => p.status === 'pending').length,
    rejected: payments.filter(p => p.status === 'rejected').length
  }

  const getStatusBadge = (status: string) => {
    if (status === 'verified') {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-[#a4f4cf] rounded-full">
          <svg className="w-4 h-4 text-[#007a55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm text-[#007a55]">Sudah Dibayar</span>
        </div>
      )
    } else if (status === 'rejected') {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-sm text-red-600">Ditolak</span>
        </div>
      )
    } else {
      return (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-[#fee685] rounded-full">
          <svg className="w-4 h-4 text-[#bb4d00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-[#bb4d00]">Menunggu Verifikasi</span>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="pembayaran" />

      {/* Main Content */}
      <div className="ml-64 min-h-screen overflow-auto">
        <div className="p-8 space-y-6" style={{ background: 'linear-gradient(141.98deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">Verifikasi Pembayaran</h1>
              <p className="text-[#6a7282] text-base">Kelola dan verifikasi bukti pembayaran dari pelanggan</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleDeleteClick}
                className="bg-[#e7000b] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-[#c00009] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedPayment}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus</span>
              </button>
              <button
                onClick={handleVerifyClick}
                className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:from-[#008055] hover:to-[#00a66b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedPayment}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verifikasi Pembayaran</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-2">
            <div className="flex gap-2">
              <button
                onClick={() => handleTabChange('all')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className={selectedTab === 'all' ? 'font-semibold' : ''}>Semua Pembayaran</span>
                <span className={`px-2.5 py-1 rounded-full text-sm ${
                  selectedTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#d0fae5] text-[#009966]'
                }`}>
                  {stats.total}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('verified')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-colors ${
                  selectedTab === 'verified'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={selectedTab === 'verified' ? 'font-semibold' : ''}>Sudah Dibayar</span>
                <span className={`px-2.5 py-1 rounded-full text-sm ${
                  selectedTab === 'verified' ? 'bg-white/20 text-white' : 'bg-[#d0fae5] text-[#009966]'
                }`}>
                  {stats.verified}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('pending')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-colors ${
                  selectedTab === 'pending'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={selectedTab === 'pending' ? 'font-semibold' : ''}>Menunggu Verifikasi</span>
                <span className={`px-2.5 py-1 rounded-full text-sm ${
                  selectedTab === 'pending' ? 'bg-white/20 text-white' : 'bg-[#fef3c6] text-[#e17100]'
                }`}>
                  {stats.pending}
                </span>
              </button>

              <button
                onClick={() => handleTabChange('rejected')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-colors ${
                  selectedTab === 'rejected'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className={selectedTab === 'rejected' ? 'font-semibold' : ''}>Ditolak</span>
                <span className={`px-2.5 py-1 rounded-full text-sm ${
                  selectedTab === 'rejected' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
                }`}>
                  {stats.rejected}
                </span>
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#6a7282] mb-1">Total Pembayaran</p>
                  <p className="text-base text-[#101828] font-semibold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#6a7282] mb-1">Menunggu Verifikasi</p>
                  <p className="text-base text-[#e17100] font-semibold">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-[#fef3c6] rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e17100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#6a7282] mb-1">Sudah Dibayar</p>
                  <p className="text-base text-[#009966] font-semibold">{stats.verified}</p>
                </div>
                <div className="w-12 h-12 bg-[#d0fae5] rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-[#6a7282] mb-1">Ditolak</p>
                  <p className="text-base text-red-600 font-semibold">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Cari berdasarkan nama, perusahaan, atau kode booking..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6] border-b border-gray-200">
                    <th className="px-6 py-4 text-left w-16">
                      <span className="text-xs font-bold text-[#4a5565] uppercase tracking-wider">Pilih</span>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Kode Booking
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Nama Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Instansi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Paket Tour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Jumlah Pax
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Total Biaya
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Status Pembayaran
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-[#009966] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-600">Memuat data pembayaran...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-red-700 font-medium">Gagal memuat data</p>
                            <p className="text-red-600 text-sm">{error}</p>
                          </div>
                          <button
                            onClick={() => refetch()}
                            className="mt-2 px-4 py-2 bg-[#009966] text-white rounded-lg hover:bg-[#008055] transition-colors"
                          >
                            Coba Lagi
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : currentPayments.length > 0 ? currentPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <input
                          type="radio"
                          checked={selectedPayment === payment.id}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="w-5 h-5 border-gray-300 text-[#009966] focus:ring-[#009966]"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-[#101828]">
                          {payment.bookings.kode_booking}
                        </code>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.bookings.customers.nama_pelanggan}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.bookings.customers.nama_perusahaan || '-'}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.bookings.tour_packages.nama_paket}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.bookings.jumlah_pax}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{formatRupiah(payment.jumlah_pembayaran)}</p>
                      </td>
                      <td className="px-6 py-6">
                        {getStatusBadge(payment.status)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <p className="text-gray-500 text-lg">Tidak ada data yang ditemukan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-[#4a5565] text-base">
                Menampilkan <span className="font-semibold">{startIndex + 1}-{Math.min(endIndex, filteredPayments.length)}</span> dari <span className="font-semibold">{filteredPayments.length}</span> pembayaran
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
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page 
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
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
            <div className="text-center mb-8">
              <p className="text-[#101828] text-base">
                Apakah Anda yakin ingin menghapus item ini?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmDelete}
                className="bg-[#e7000b] text-white px-8 py-3 rounded-lg hover:bg-[#c00009] transition-colors font-medium"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-[#99a1af] text-white px-8 py-3 rounded-lg hover:bg-[#8891a1] transition-colors font-medium"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Verification Modal */}
      {isVerifyModalOpen && selectedPayment && (() => {
        const selectedPaymentData = payments.find(p => p.id === selectedPayment)
        if (!selectedPaymentData) return null
        
        return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-[746px] relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#101828]">Verifikasi Pembayaran</h3>
              <button 
                onClick={() => setIsVerifyModalOpen(false)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-6">
              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Booking Code */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Kode Booking</label>
                    <div className="inline-block bg-gray-100 px-3 py-1.5 rounded-[10px]">
                      <span className="font-mono text-sm text-[#101828]">
                        {selectedPaymentData.bookings.kode_booking}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Nama Pelanggan</label>
                    <p className="text-base text-[#101828]">
                      {selectedPaymentData.bookings.customers.nama_pelanggan}
                    </p>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Instansi</label>
                    <p className="text-base text-[#101828]">
                      {selectedPaymentData.bookings.customers.nama_perusahaan || '-'}
                    </p>
                  </div>

                  {/* Package */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Paket Tour</label>
                    <p className="text-base text-[#101828]">
                      {selectedPaymentData.bookings.tour_packages.nama_paket}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Pax */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Jumlah Pax</label>
                    <p className="text-base text-[#101828]">
                      {selectedPaymentData.bookings.jumlah_pax} orang
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Total Biaya</label>
                    <p className="text-base text-[#101828]">
                      {formatRupiah(selectedPaymentData.jumlah_pembayaran)}
                    </p>
                  </div>

                  {/* Current Status */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Status Saat Ini</label>
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-[#fee685] rounded-full">
                      <svg className="w-4 h-4 text-[#bb4d00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-[#bb4d00]">Menunggu Verifikasi</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bukti Pembayaran Section */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <label className="block text-sm text-[#364153]">Bukti Pembayaran</label>
                <div className="bg-gray-50 border-2 border-[#d1d5dc] rounded-[16.4px] p-7">
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className="w-12 h-12 bg-[#d0fae5] rounded-[10px] flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1">
                      <p className="text-base text-[#101828]">bukti_transfer_{selectedPaymentData.bookings.customers.nama_pelanggan?.toLowerCase().replace(/\s+/g, '_')}.jpg</p>
                      <p className="text-base text-[#6a7282]">Sudah diupload</p>
                    </div>

                    {/* View Button */}
                    {selectedPaymentData.bukti_pembayaran_url && (
                      <a
                        href={selectedPaymentData.bukti_pembayaran_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#009966] text-white text-sm rounded-[10px] hover:opacity-90 transition-opacity"
                      >
                        Lihat Bukti
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Note */}
              <div className="space-y-2">
                <label className="block text-sm text-[#364153]">Catatan (Wajib diisi)</label>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Contoh: Transfer sudah masuk, nominal sesuai (untuk verifikasi) atau Bukti transfer tidak valid (untuk penolakan)"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-[10px] text-sm text-[#101828] placeholder:text-[rgba(16,24,40,0.5)] focus:outline-none focus:ring-2 focus:ring-[#009966] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-[17px] flex items-center justify-end gap-3">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-[#364153] text-base rounded-[16.4px] hover:bg-gray-200 transition-colors h-11"
              >
                Batal
              </button>
              <button
                onClick={handleRejectPayment}
                className="px-6 py-2.5 bg-[#e7000b] text-white text-base rounded-[16.4px] hover:opacity-90 transition-opacity h-11"
              >
                Tolak
              </button>
              <button
                onClick={handleConfirmVerify}
                className="px-5 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white text-base rounded-[16.4px] hover:opacity-90 transition-opacity flex items-center gap-2 h-11"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verifikasi & Setujui</span>
              </button>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
