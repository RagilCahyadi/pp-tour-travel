'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState } from 'react'

export default function AdminPembayaranPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedPayments, setSelectedPayments] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [verificationNote, setVerificationNote] = useState('')

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const filtered = payments.filter(payment => {
        const matchesTab = selectedTab === 'all' || payment.status === selectedTab
        const matchesSearch = searchQuery === '' || 
                             payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             payment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             payment.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
      })
      setSelectedPayments(filtered.map(p => p.id))
    } else {
      setSelectedPayments([])
    }
  }

  const handleSelectPayment = (id: number) => {
    if (selectedPayments.includes(id)) {
      setSelectedPayments(selectedPayments.filter(paymentId => paymentId !== id))
    } else {
      setSelectedPayments([...selectedPayments, id])
    }
  }

  const handleVerifyClick = () => {
    if (selectedPayments.length > 0) {
      setIsVerifyModalOpen(true)
    }
  }

  const handleConfirmVerify = () => {
    if (!verificationNote.trim()) {
      alert('Mohon berikan catatan verifikasi!')
      return
    }
    console.log('Verifying payments:', selectedPayments)
    console.log('Verification note:', verificationNote)
    // TODO: Implement verification logic
    alert(`${selectedPayments.length} pembayaran berhasil diverifikasi!`)
    setSelectedPayments([])
    setIsVerifyModalOpen(false)
    setVerificationNote('')
  }

  const handleDeleteClick = () => {
    if (selectedPayments.length > 0) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    console.log('Deleting payments:', selectedPayments)
    // TODO: Implement delete logic
    alert(`${selectedPayments.length} data pembayaran berhasil dihapus!`)
    setSelectedPayments([])
    setIsDeleteModalOpen(false)
  }

  // Mock data for payments
  const payments = [
    {
      id: 1,
      bookingCode: 'BAMH760',
      customerName: 'Bambang',
      company: 'PT. Amerta Jaya',
      package: 'Bali Premium',
      pax: 48,
      totalCost: 'Rp 69.600.000',
      status: 'verified'
    },
    {
      id: 2,
      bookingCode: 'BHRS937',
      customerName: 'Sigit',
      company: 'PT. Amerta Jaya',
      package: 'Bali Ekonomis',
      pax: 56,
      totalCost: 'Rp 61.600.000',
      status: 'verified'
    },
    {
      id: 3,
      bookingCode: 'DEWK123',
      customerName: 'Dewi Kusuma',
      company: 'CV. Maju Bersama',
      package: 'Yogyakarta Premium',
      pax: 32,
      totalCost: 'Rp 24.000.000',
      status: 'verified'
    },
    {
      id: 4,
      bookingCode: 'ANDW456',
      customerName: 'Andi Wijaya',
      company: 'PT. Sukses Makmur',
      package: 'Bandung Ekonomis',
      pax: 40,
      totalCost: 'Rp 39.600.000',
      status: 'pending'
    },
    {
      id: 5,
      bookingCode: 'SITN321',
      customerName: 'Siti Nurhaliza',
      company: 'CV. Berkah Jaya',
      package: 'Lombok Premium',
      pax: 28,
      totalCost: 'Rp 33.600.000',
      status: 'pending'
    }
  ]

  const filteredPayments = payments.filter(payment => {
    const matchesTab = selectedTab === 'all' || payment.status === selectedTab
    const matchesSearch = searchQuery === '' || 
                         payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const stats = {
    total: payments.length,
    verified: payments.filter(p => p.status === 'verified').length,
    pending: payments.filter(p => p.status === 'pending').length
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="pembayaran" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
                disabled={selectedPayments.length === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus</span>
              </button>
              <button
                onClick={handleVerifyClick}
                className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:from-[#008055] hover:to-[#00a66b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedPayments.length === 0}
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
                onClick={() => setSelectedTab('all')}
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
                onClick={() => setSelectedTab('verified')}
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
                onClick={() => setSelectedTab('pending')}
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
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-4">
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
          </div>

          {/* Search and Filter */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama, perusahaan, atau kode booking..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#009966] placeholder:text-gray-400"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-2xl text-[#364153] hover:bg-gray-50 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filter Lanjutan</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6] border-b border-gray-200">
                    <th className="px-6 py-4 text-left w-16">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedPayments.length === filteredPayments.length && filteredPayments.length > 0}
                        className="w-5 h-5 rounded-md border-gray-300 text-[#009966] focus:ring-[#009966]"
                      />
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
                  {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <input
                          type="checkbox"
                          checked={selectedPayments.includes(payment.id)}
                          onChange={() => handleSelectPayment(payment.id)}
                          className="w-5 h-5 rounded-md border-gray-300 text-[#009966] focus:ring-[#009966]"
                        />
                      </td>
                      <td className="px-6 py-6">
                        <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-[#101828]">
                          {payment.bookingCode}
                        </code>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.customerName}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.company}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.package}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.pax}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-[#101828] text-base">{payment.totalCost}</p>
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
                Menampilkan <span className="font-semibold">1-{filteredPayments.length}</span> dari <span className="font-semibold">{filteredPayments.length}</span> pembayaran
              </p>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-[#364153] hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#009966] text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[#364153] hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-[#364153] hover:bg-gray-50 transition-colors">
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
      {isVerifyModalOpen && selectedPayments.length > 0 && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#101828]">Konfirmasi Pembayaran</h3>
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
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Booking Code */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Kode Booking</label>
                    <div className="inline-block bg-gray-100 px-3 py-1.5 rounded-lg">
                      <span className="font-mono text-sm text-[#101828]">
                        {payments.find(p => p.id === selectedPayments[0])?.bookingCode}
                      </span>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Nama Pelanggan</label>
                    <p className="text-base text-[#101828]">
                      {payments.find(p => p.id === selectedPayments[0])?.customerName}
                    </p>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Instansi</label>
                    <p className="text-base text-[#101828]">
                      {payments.find(p => p.id === selectedPayments[0])?.company}
                    </p>
                  </div>

                  {/* Package */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Paket Tour</label>
                    <p className="text-base text-[#101828]">
                      {payments.find(p => p.id === selectedPayments[0])?.package}
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Pax */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Jumlah Pax</label>
                    <p className="text-base text-[#101828]">
                      {payments.find(p => p.id === selectedPayments[0])?.pax} orang
                    </p>
                  </div>

                  {/* Total Cost */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Total Biaya</label>
                    <p className="text-base text-[#101828]">
                      {payments.find(p => p.id === selectedPayments[0])?.totalCost}
                    </p>
                  </div>

                  {/* Current Status */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Status Saat Ini</label>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-[#fee685] rounded-full">
                      <svg className="w-4 h-4 text-[#bb4d00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-[#bb4d00]">Menunggu Verifikasi</span>
                    </div>
                  </div>

                  {/* WhatsApp Contact */}
                  <div>
                    <label className="block text-sm text-[#6a7282] mb-1">Kontak WhatsApp</label>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-[#b9f8cf] rounded-lg">
                      <svg className="w-4 h-4 text-[#008236]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-sm text-[#008236]">081234567893</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-blue-50 border border-[#bedbff] rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#1447e6]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-[#1c398e] mb-1">
                        Pastikan bukti transfer sudah diterima via WhatsApp
                      </p>
                      <p className="text-base text-[#1447e6]">
                        Verifikasi pembayaran setelah Anda mengecek bukti transfer yang dikirim pelanggan melalui WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Note */}
              <div>
                <label className="block text-sm text-[#364153] mb-2">Catatan Verifikasi (Opsional)</label>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Contoh: Transfer sudah masuk, nominal sesuai"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-[#101828] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009966] focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-6 py-2.5 bg-gray-100 text-[#364153] rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVerify}
                className="px-5 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-2xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Verifikasi & Setujui</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
