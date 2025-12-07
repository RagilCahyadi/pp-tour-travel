'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState, useEffect } from 'react'
import { useBookings } from '@/lib/hooks/useBookings'
import { formatRupiah, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils/helpers'

export default function AdminPemesananPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderStatus, setOrderStatus] = useState('')
  const [bookingToken, setBookingToken] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { bookings, loading, error, updateBookingStatus, deleteBooking, refetch } = useBookings()

  useEffect(() => {
    console.log('Bookings state updated:', { 
      count: bookings.length, 
      loading, 
      error,
      sample: bookings[0] 
    })
  }, [bookings, loading, error])

  const handleManageSubmission = (submission: any) => {
    if (!submission) return
    setSelectedSubmission(submission)
    setSubmissionStatus(submission.submissionStatus || '')
    setIsSubmissionModalOpen(true)
  }

  const handleSaveSubmission = () => {
    if (!submissionStatus) {
      alert('Mohon pilih status pengajuan!')
      return
    }
    console.log('Saving submission status:', submissionStatus)
    // TODO: Implement actual API call
    alert('Status pengajuan pembatalan berhasil diperbarui!')
    setIsSubmissionModalOpen(false)
  }

  const handleManageOrder = (order: any) => {
    if (!order) return
    console.log('Opening modal with order:', order) // Debug
    setSelectedOrder(order)
    setOrderStatus(order.status || '')
    setBookingToken(order.kode_booking || '')
    setIsOrderModalOpen(true)
  }

  const handleSaveOrder = async () => {
    if (!orderStatus) {
      alert('Mohon pilih status pemesanan!')
      return
    }
    
    console.log('Updating booking:', { id: selectedOrder.id, status: orderStatus }) // Debug
    
    try {
      await updateBookingStatus(selectedOrder.id, orderStatus as any)
      alert(`✅ Status pemesanan berhasil diperbarui menjadi "${getStatusLabel(orderStatus)}"!`)
      setIsOrderModalOpen(false)
      refetch()
    } catch (err: any) {
      console.error('Error updating booking status:', err)
      alert(`❌ Gagal memperbarui status pemesanan!\n\nError: ${err.message || 'Unknown error'}`)
    }
  }

  const handleDeleteClick = () => {
    if (selectedOrders.length > 0) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await Promise.all(selectedOrders.map(id => deleteBooking(id)))
      alert(`${selectedOrders.length} pemesanan berhasil dihapus!`)
      setSelectedOrders([])
      setIsDeleteModalOpen(false)
      refetch()
    } catch (err) {
      alert('Gagal menghapus pemesanan!')
    }
  }

  // Filter bookings based on search and tab
  const filteredBookings = bookings.filter(booking => {
    const matchesTab = selectedTab === 'all' || booking.status === selectedTab
    const matchesSearch = searchQuery === '' || 
                         booking.customers.nama_pelanggan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.customers.nama_perusahaan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.kode_booking.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(filteredBookings.map(booking => booking.id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectOrder = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  if (loading) {
    return (
      <div className="bg-white relative min-h-screen flex">
        <AdminSidebar activePage="pemesanan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009966] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data pemesanan...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white relative min-h-screen flex">
        <AdminSidebar activePage="pemesanan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-2xl p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-semibold text-red-900 mb-2">Error Memuat Data</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <p className="text-sm text-red-600">Periksa koneksi Supabase dan pastikan environment variables sudah diset dengan benar.</p>
              <button 
                onClick={() => refetch()} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getSubmissionStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-[#a4f4cf] rounded-full">
            <svg className="w-4 h-4 text-[#007a55]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#007a55]">Diproses</span>
          </div>
        )
      case 'pending':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-[#fee685] rounded-full">
            <svg className="w-4 h-4 text-[#bb4d00]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#bb4d00]">Belum Diproses</span>
          </div>
        )
      case 'approved':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-[#bedbff] rounded-full">
            <svg className="w-4 h-4 text-[#1447e6]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#1447e6]">Disetujui</span>
          </div>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-[#a4f4cf] rounded-full">
            <svg className="w-4 h-4 text-[#007a55]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#007a55]">Dikonfirmasi</span>
          </div>
        )
      case 'pending':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-[#fee685] rounded-full">
            <svg className="w-4 h-4 text-[#bb4d00]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#bb4d00]">Pending</span>
          </div>
        )
      case 'cancelled':
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-[#ffc9c9] rounded-full">
            <svg className="w-4 h-4 text-[#c10007]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-[#c10007]">Dibatalkan</span>
          </div>
        )
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="pemesanan" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6" style={{ background: 'linear-gradient(141.98deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">
                Kelola Pemesanan Pelanggan
              </h1>
              <p className="text-[#6a7282] text-base">
                Monitor dan kelola semua pemesanan
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => refetch()}
                className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
                title="Refresh data dari Supabase"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
              <button 
                onClick={handleDeleteClick}
                className="bg-[#e7000b] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-[#c00009] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedOrders.length === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus</span>
              </button>
              <button 
                onClick={() => {
                  if (selectedOrders.length > 0) {
                    const booking = bookings.find(b => b.id === selectedOrders[0])
                    if (booking) handleManageOrder(booking)
                  }
                }}
                className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:from-[#008055] hover:to-[#00a66b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedOrders.length === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Kelola Pesanan</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-2">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTab('all')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                  selectedTab === 'all'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className={selectedTab === 'all' ? 'font-semibold' : ''}>Semua Pesanan</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  selectedTab === 'all' 
                    ? 'bg-[rgba(255,255,255,0.2)] text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {stats.total}
                </span>
              </button>

              <button
                onClick={() => setSelectedTab('confirmed')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                  selectedTab === 'confirmed'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className={selectedTab === 'confirmed' ? 'font-semibold' : ''}>Dikonfirmasi</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  selectedTab === 'confirmed' 
                    ? 'bg-[rgba(255,255,255,0.2)] text-white' 
                    : 'bg-[#d0fae5] text-[#009966]'
                }`}>
                  {stats.confirmed}
                </span>
              </button>

              <button
                onClick={() => setSelectedTab('pending')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                  selectedTab === 'pending'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className={selectedTab === 'pending' ? 'font-semibold' : ''}>Pending</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  selectedTab === 'pending' 
                    ? 'bg-[rgba(255,255,255,0.2)] text-white' 
                    : 'bg-[#fef3c6] text-[#e17100]'
                }`}>
                  {stats.pending}
                </span>
              </button>

              <button
                onClick={() => setSelectedTab('cancelled')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl transition-all ${
                  selectedTab === 'cancelled'
                    ? 'bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white shadow-lg'
                    : 'text-[#4a5565] hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className={selectedTab === 'cancelled' ? 'font-semibold' : ''}>Dibatalkan</span>
                <span className={`px-2.5 py-0.5 rounded-full text-sm ${
                  selectedTab === 'cancelled' 
                    ? 'bg-[rgba(255,255,255,0.2)] text-white' 
                    : 'bg-[#ffe2e2] text-[#e7000b]'
                }`}>
                  {stats.cancelled}
                </span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Total Pesanan</p>
                  <p className="text-[#101828] text-base font-medium">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Dikonfirmasi</p>
                  <p className="text-[#009966] text-base font-medium">{stats.confirmed}</p>
                </div>
                <div className="w-12 h-12 bg-[#d0fae5] rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#009966]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Pending</p>
                  <p className="text-[#e17100] text-base font-medium">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-[#fef3c6] rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e17100]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Dibatalkan</p>
                  <p className="text-[#e7000b] text-base font-medium">{stats.cancelled}</p>
                </div>
                <div className="w-12 h-12 bg-[#ffe2e2] rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#e7000b]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                        checked={selectedOrders.length === filteredBookings.length && filteredBookings.length > 0}
                        className="w-5 h-5 rounded-md border-gray-300 text-[#009966] focus:ring-[#009966]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Paket
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Kontak
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Kode Booking
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="text-lg font-medium text-gray-700 mb-1">Belum ada pemesanan</p>
                            <p className="text-sm text-gray-500">Data pemesanan akan muncul di sini setelah ada booking dari customer</p>
                          </div>
                          <button
                            onClick={() => refetch()}
                            className="mt-2 px-4 py-2 bg-[#009966] text-white rounded-lg hover:bg-[#008055] transition-colors"
                          >
                            Refresh Data
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div>
                            <p className="text-lg font-medium text-gray-700 mb-1">Tidak ditemukan</p>
                            <p className="text-sm text-gray-500">Tidak ada pemesanan yang sesuai dengan filter atau pencarian</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-6">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(booking.id)}
                            onChange={() => handleSelectOrder(booking.id)}
                            className="w-5 h-5 rounded-md border-gray-300 text-[#009966] focus:ring-[#009966]"
                          />
                        </td>
                        <td className="px-6 py-6">
                          <div>
                            <p className="text-[#101828] text-base font-medium">{booking.customers.nama_pelanggan}</p>
                            <p className="text-[#6a7282] text-base">{booking.customers.nama_perusahaan || '-'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-[#101828] text-base">{booking.tour_packages.nama_paket}</p>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-[#101828] text-base">{booking.customers.nomor_telepon || '-'}</p>
                        </td>
                        <td className="px-6 py-6">
                          <code className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-[#101828]">
                            {booking.kode_booking}
                          </code>
                        </td>
                        <td className="px-6 py-6">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleManageOrder(booking)}
                              className="p-2 text-[#009966] hover:bg-green-50 rounded-lg transition-colors"
                              title="Kelola Pesanan"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <p className="text-[#4a5565] text-base">
                Menampilkan <span className="font-semibold">1-{filteredBookings.length}</span> dari <span className="font-semibold">{filteredBookings.length}</span> pesanan
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

      {/* Submission Management Modal */}
      {isSubmissionModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#101828]">Kelola Pengajuan</h2>
              <button
                onClick={() => setIsSubmissionModalOpen(false)}
                className="w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Row 1: Nama Pelanggan & Instalasi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Nama Pelanggan</p>
                  <p className="text-[#101828] text-base">{selectedSubmission.customerName}</p>
                </div>
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Instalasi</p>
                  <p className="text-[#101828] text-base">{selectedSubmission.company}</p>
                </div>
              </div>

              {/* Paket Dibatalkan */}
              <div>
                <p className="text-[#6a7282] text-base mb-1">Paket Dibatalkan</p>
                <p className="text-[#101828] text-base">{selectedSubmission.package}</p>
              </div>

              {/* Status Pengajuan Dropdown */}
              <div>
                <p className="text-[#6a7282] text-base mb-2">Status Pengajuan</p>
                <div className="relative">
                  <select
                    value={submissionStatus}
                    onChange={(e) => setSubmissionStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-[#009966] appearance-none bg-white"
                  >
                    <option value="">Pilih status</option>
                    <option value="pending">Belum Diproses</option>
                    <option value="processing">Diproses</option>
                    <option value="approved">Disetujui</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Kode Booking */}
              <div>
                <p className="text-[#6a7282] text-base mb-2">Kode Booking</p>
                <code className="inline-block px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-[#101828]">
                  {selectedSubmission.bookingCode}
                </code>
              </div>

              {/* Alasan Pembatalan */}
              <div>
                <p className="text-[#6a7282] text-base mb-1">Alasan Pembatalan</p>
                <p className="text-[#101828] text-base">Kesalahan Pesan Kode Perusahaan</p>
              </div>

              {/* Catatan Pengguna */}
              <div>
                <p className="text-[#6a7282] text-base mb-1">Catatan Pengguna</p>
                <p className="text-[#101828] text-base">Kurang Pengunjung dari Luring 4 Cyl</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={handleSaveSubmission}
                className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-6 py-2.5 rounded-2xl hover:from-[#008055] hover:to-[#00a66b] transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Management Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#101828]">Kelola Pemesanan</h2>
              <button 
                onClick={() => setIsOrderModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-5 space-y-4">
              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Nama Pelanggan */}
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Nama Pelanggan</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      <p className="text-sm text-[#101828]">{selectedOrder.customers?.nama_pelanggan || selectedOrder.customerName || '-'}</p>
                    </div>
                  </div>

                  {/* Instalasi */}
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Instalasi</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      <p className="text-sm text-[#101828]">{selectedOrder.customers?.nama_perusahaan || selectedOrder.company || '-'}</p>
                    </div>
                  </div>

                  {/* Informasi Kontak */}
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Informasi Kontak</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      <div className="text-sm text-[#101828]">
                        <p>{selectedOrder.customers?.nomor_telepon || selectedOrder.contact || '-'}</p>
                        {selectedOrder.customers?.email && (
                          <p className="text-gray-600 mt-1">{selectedOrder.customers.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Pilih Paket */}
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Pilih Paket</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      <p className="text-sm text-[#101828]">{selectedOrder.tour_packages?.nama_paket || selectedOrder.package || '-'}</p>
                      {selectedOrder.jumlah_pax && (
                        <p className="text-xs text-gray-600 mt-1">{selectedOrder.jumlah_pax} pax • {formatRupiah(selectedOrder.total_biaya || 0)}</p>
                      )}
                    </div>
                  </div>

                  {/* Status Pesanan */}
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Status Pesanan</label>
                    <div className="relative">
                      <select
                        value={orderStatus}
                        onChange={(e) => setOrderStatus(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#101828] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009966]"
                      >
                        <option value="">Pilih Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="cancelled">Dibatalkan</option>
                        <option value="completed">Selesai</option>
                      </select>
                      <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-4">
                {/* Kode Token Pesanan */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Kode Token Pesanan</label>
                  <input
                    type="text"
                    value={bookingToken}
                    onChange={(e) => setBookingToken(e.target.value)}
                    placeholder="Buat Kode Token Pemesanan"
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#101828] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009966]"
                  />
                </div>

                {/* Catatan Pelanggan */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Catatan Pelanggan</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 min-h-[62px]">
                    <p className="text-sm text-[#101828] whitespace-pre-wrap">{selectedOrder.catatan || selectedOrder.notes || '-'}</p>
                  </div>
                </div>

                {/* Kode Booking */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Kode Booking</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                    <code className="text-sm font-mono text-[#101828]">{selectedOrder.kode_booking || '-'}</code>
                  </div>
                </div>

                {/* Tanggal Keberangkatan */}
                {selectedOrder.tanggal_keberangkatan && (
                  <div>
                    <label className="block text-sm text-[#364153] mb-2">Tanggal Keberangkatan</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5">
                      <p className="text-sm text-[#101828]">{formatDate(selectedOrder.tanggal_keberangkatan)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={handleSaveOrder}
                className="bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:from-[#008055] hover:to-[#00a66b] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Simpan</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
}
