'use client'

import AdminSidebar from '@/components/AdminSidebar'
import { useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useSchedules } from '@/lib/hooks/useSchedules'
import { useTourPackages } from '@/lib/hooks/useTourPackages'
import { formatDate } from '@/lib/utils/helpers'

export default function AdminPenjadwalanPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    package_id: '',
    status: 'aktif' as 'aktif' | 'tidak-aktif' | 'selesai',
    kode_jadwal: '',
    tanggal_keberangkatan: '',
    waktu_keberangkatan: '',
    nama_instansi: '',
    catatan: ''
  })

  const { schedules, loading, error, createSchedule, updateSchedule, deleteSchedule } = useSchedules()
  const { packages } = useTourPackages()

  // Generate unique schedule code
  const generateScheduleCode = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `SCH${year}${month}${day}${random}`
  }

  const handleSelectSchedule = (id: string) => {
    if (selectedSchedule === id) {
      setSelectedSchedule(null)
    } else {
      setSelectedSchedule(id)
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = searchQuery === '' || 
                         (schedule.nama_instansi?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         schedule.tour_packages.nama_paket.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         schedule.kode_jadwal.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalJadwal = schedules.length
  const jadwalAktif = schedules.filter(s => s.status === 'aktif').length
  const jadwalTidakAktif = schedules.filter(s => s.status === 'tidak-aktif').length

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setFormData({
      package_id: '',
      status: 'aktif',
      kode_jadwal: generateScheduleCode(), // Auto-generate unique code
      tanggal_keberangkatan: '',
      waktu_keberangkatan: '',
      nama_instansi: '',
      catatan: ''
    })
  }

  const handleEditSchedule = (scheduleId: string) => {
    setIsModalOpen(true)
    
    if (scheduleId) {
      const schedule = schedules.find(s => s.id === scheduleId)
      if (schedule) {
        setFormData({
          package_id: schedule.package_id,
          status: schedule.status,
          kode_jadwal: schedule.kode_jadwal,
          tanggal_keberangkatan: schedule.tanggal_keberangkatan,
          waktu_keberangkatan: schedule.waktu_keberangkatan || '',
          nama_instansi: schedule.nama_instansi || '',
          catatan: schedule.catatan || ''
        })
      }
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.package_id || !formData.kode_jadwal || !formData.tanggal_keberangkatan) {
      alert('Mohon lengkapi data yang diperlukan (Paket Tour, Kode Jadwal, dan Tanggal Keberangkatan)!')
      return
    }

    // Validate package exists
    const packageExists = packages.find(pkg => pkg.id === formData.package_id)
    if (!packageExists) {
      alert('Paket tour tidak valid. Silakan pilih paket tour yang tersedia.')
      return
    }

    // Clean data - remove empty strings for optional fields
    const cleanedData = {
      package_id: formData.package_id,
      kode_jadwal: formData.kode_jadwal.trim(),
      tanggal_keberangkatan: formData.tanggal_keberangkatan,
      status: formData.status,
      ...(formData.waktu_keberangkatan && { waktu_keberangkatan: formData.waktu_keberangkatan }),
      ...(formData.nama_instansi && { nama_instansi: formData.nama_instansi.trim() }),
      ...(formData.catatan && { catatan: formData.catatan.trim() })
    }

    console.log('Submitting data:', cleanedData)

    if (selectedSchedule) {
      // Update existing schedule
      const { error } = await updateSchedule(selectedSchedule, cleanedData)
      if (error) {
        alert('❌ Gagal memperbarui jadwal:\n' + error)
      } else {
        alert('✅ Jadwal berhasil diperbarui!')
        handleCloseModal()
      }
    } else {
      // Create new schedule
      const { error } = await createSchedule(cleanedData)
      if (error) {
        alert('❌ Gagal menambahkan jadwal:\n' + error)
      } else {
        alert('✅ Jadwal baru berhasil ditambahkan!')
        handleCloseModal()
      }
    }
  }

  const handleDeleteClick = () => {
    if (selectedSchedule) {
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return
    
    const { error } = await deleteSchedule(selectedSchedule)
    if (error) {
      alert('Gagal menghapus jadwal: ' + error)
    } else {
      alert('Jadwal berhasil dihapus!')
      setSelectedSchedule(null)
      setIsDeleteModalOpen(false)
    }
  }

  const handleExportAllPDF = () => {
    if (schedules.length === 0) {
      alert('Tidak ada jadwal untuk diexport!')
      return
    }

    // Create new PDF document
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Laporan Semua Penjadwalan Tour', 14, 20)

    // Add metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    doc.text(`Tanggal Export: ${currentDate}`, 14, 28)
    doc.text(`Total Jadwal: ${schedules.length}`, 14, 34)
    doc.text(`Jadwal Aktif: ${jadwalAktif}`, 14, 40)
    doc.text(`Jadwal Tidak Aktif: ${jadwalTidakAktif}`, 14, 46)

    // Prepare table data - semua jadwal
    const tableData = schedules.map((schedule, index) => [
      index + 1,
      schedule.nama_instansi || '-',
      schedule.tour_packages.nama_paket,
      schedule.kode_jadwal,
      formatDate(schedule.tanggal_keberangkatan),
      schedule.waktu_keberangkatan || '-',
      schedule.status === 'aktif' ? 'Aktif' : schedule.status === 'selesai' ? 'Selesai' : 'Tidak Aktif'
    ])

    // Add table
    autoTable(doc, {
      startY: 52,
      head: [['No', 'Instansi', 'Paket Tour', 'Kode', 'Tanggal', 'Waktu', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 153, 102],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 35 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 25, halign: 'center' }
      },
      margin: { top: 52, left: 14, right: 14 }
    })

    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
      doc.text(
        'PP Tour Travel - Sistem Manajemen Penjadwalan',
        14,
        doc.internal.pageSize.getHeight() - 10
      )
    }

    // Save the PDF
    doc.save(`Laporan-Semua-Penjadwalan-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const handleExportPDF = () => {
    if (!selectedSchedule) {
      alert('Pilih jadwal untuk diexport!')
      return
    }

    // Get selected schedule data
    const selectedData = schedules.filter(schedule => 
      schedule.id === selectedSchedule
    )

    // Create new PDF document
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('Laporan Penjadwalan Tour', 14, 20)

    // Add metadata
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
    doc.text(`Tanggal Export: ${currentDate}`, 14, 28)
    doc.text(`Total Jadwal: ${selectedData.length}`, 14, 34)

    // Prepare table data
    const tableData = selectedData.map((schedule, index) => [
      index + 1,
      schedule.nama_instansi || '-',
      schedule.tour_packages.nama_paket,
      schedule.kode_jadwal,
      formatDate(schedule.tanggal_keberangkatan),
      schedule.status === 'aktif' ? 'Aktif' : schedule.status === 'selesai' ? 'Selesai' : 'Tidak Aktif'
    ])

    // Add table
    autoTable(doc, {
      startY: 40,
      head: [['No', 'Instansi', 'Paket Tour', 'Kode', 'Keberangkatan', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 153, 102], // Green color matching the theme
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [50, 50, 50]
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 40 },
        2: { cellWidth: 45 },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 35, halign: 'center' },
        5: { cellWidth: 30, halign: 'center' }
      },
      margin: { top: 40 }
    })

    // Add footer with page numbers
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
      doc.text(
        'PP Tour Travel - Sistem Manajemen Penjadwalan',
        14,
        doc.internal.pageSize.getHeight() - 10
      )
    }

    // Save the PDF
    const fileName = `Jadwal_Tour_${new Date().getTime()}.pdf`
    doc.save(fileName)

    // Show success message
    alert(`${selectedData.length} jadwal berhasil diexport ke PDF!`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar activePage="penjadwalan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009966] mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar activePage="penjadwalan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="penjadwalan" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-6" style={{ background: 'linear-gradient(141.98deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">Kelola Penjadwalan</h1>
              <p className="text-[#6a7282] text-base">Kelola jadwal keberangkatan paket tour</p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleDeleteClick}
                disabled={!selectedSchedule}
                className="flex items-center gap-2 px-5 py-3 bg-[#e7000b] text-white rounded-[16.4px] hover:bg-[#c00009] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Hapus</span>
              </button>

              <button 
                onClick={handleExportPDF}
                disabled={!selectedSchedule}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-[16.4px] shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="text-[#364153]">Export PDF</span>
              </button>

              <button 
                onClick={handleExportAllPDF}
                disabled={schedules.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#009966] to-[#00CC88] text-white rounded-[16.4px] shadow-sm hover:from-[#008855] hover:to-[#00BB77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Semua</span>
              </button>
              
              <button 
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-[16.4px] hover:opacity-90 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Kelola Jadwal</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-[16.4px] p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Total Jadwal</p>
                  <p className="text-[#101828] text-base font-semibold">{totalJadwal}</p>
                </div>
                <div className="bg-blue-100 rounded-[16.4px] p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[16.4px] p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Jadwal Aktif</p>
                  <p className="text-[#009966] text-base font-semibold">{jadwalAktif}</p>
                </div>
                <div className="bg-[#d0fae5] rounded-[16.4px] p-3">
                  <svg className="w-6 h-6 text-[#009966]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[16.4px] p-5 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#6a7282] text-base mb-1">Tidak Aktif</p>
                  <p className="text-[#e7000b] text-base font-semibold">{jadwalTidakAktif}</p>
                </div>
                <div className="bg-[#ffe2e2] rounded-[16.4px] p-3">
                  <svg className="w-6 h-6 text-[#e7000b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-lg">
            <div className="relative">
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cari berdasarkan instansi, paket, atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[16.4px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#f9fafb] to-[#f3f4f6] border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-left">
                      <span className="text-xs font-bold text-[#4a5565] uppercase tracking-wider">Pilih</span>
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Instansi</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Paket Tour</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Kode</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Keberangkatan</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Status Layanan</th>
                    <th className="px-6 py-5 text-left text-xs font-bold text-[#4a5565] uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-6">
                        <input
                          type="radio"
                          checked={selectedSchedule === schedule.id}
                          onChange={() => handleSelectSchedule(schedule.id)}
                          className="w-5 h-5 border-gray-300 text-[#009966] focus:ring-[#009966]"
                        />
                      </td>
                      <td className="px-6 py-6 text-[#101828]">{schedule.nama_instansi || '-'}</td>
                      <td className="px-6 py-6 text-[#101828]">{schedule.tour_packages.nama_paket}</td>
                      <td className="px-6 py-6">
                        <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-[#101828] text-sm font-mono rounded-[10px]">
                          {schedule.kode_jadwal}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[#101828]">{formatDate(schedule.tanggal_keberangkatan)} {schedule.waktu_keberangkatan ? `, ${schedule.waktu_keberangkatan}` : ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {schedule.status === 'aktif' ? (
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-[#a4f4cf] rounded-full">
                            <svg className="w-4 h-4 text-[#007a55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-[#007a55]">Aktif</span>
                          </div>
                        ) : schedule.status === 'selesai' ? (
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-[#c9d4ff] rounded-full">
                            <svg className="w-4 h-4 text-[#0055c1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-[#0055c1]">Selesai</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-[#ffc9c9] rounded-full">
                            <svg className="w-4 h-4 text-[#c10007]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-[#c10007]">Tidak Aktif</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditSchedule(schedule.id)}
                            className="p-2 text-[#009966] hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Jadwal"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="text-[#4a5565]">
                <span>Menampilkan </span>
                <span className="font-semibold">1-{filteredSchedules.length}</span>
                <span> dari </span>
                <span className="font-semibold">{filteredSchedules.length}</span>
                <span> jadwal</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-[10px] text-[#364153] hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 bg-[#009966] text-white rounded-[10px] font-medium">
                  1
                </button>
                <button className="px-3 py-2 bg-white border border-gray-200 rounded-[10px] text-[#364153] hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 rounded-[10px] text-[#364153] hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-[16.4px] shadow-2xl w-[576px] max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[#101828]">
                {selectedSchedule ? 'Edit Penjadwalan' : 'Tambah Penjadwalan'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[calc(90vh-140px)] overflow-y-auto">
              {/* Paket Tour */}
              <div>
                <label className="block text-sm text-[#364153] mb-2">Paket Tour *</label>
                <div className="relative">
                  <select
                    name="package_id"
                    value={formData.package_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] text-[#101828] appearance-none focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    required>
                    <option value="">Pilih Paket Tour</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.nama_paket} - {pkg.lokasi} ({pkg.durasi})
                      </option>
                    ))}
                  </select>
                  <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Kode Jadwal */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Kode Jadwal *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="kode_jadwal"
                      value={formData.kode_jadwal}
                      onChange={handleInputChange}
                      placeholder="SCH20250115001"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, kode_jadwal: generateScheduleCode() }))}
                      className="px-3 py-3 bg-gray-100 border border-gray-200 rounded-[10px] hover:bg-gray-200 transition-colors"
                      title="Generate Kode Baru"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Status</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] text-[#101828] appearance-none focus:outline-none focus:ring-2 focus:ring-[#009966]">
                      <option value="aktif">Aktif</option>
                      <option value="tidak-aktif">Tidak Aktif</option>
                      <option value="selesai">Selesai</option>
                    </select>
                    <svg className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Tanggal Keberangkatan */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Tanggal Keberangkatan *</label>
                  <input
                    type="date"
                    name="tanggal_keberangkatan"
                    value={formData.tanggal_keberangkatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    required
                  />
                </div>

                {/* Waktu Keberangkatan */}
                <div>
                  <label className="block text-sm text-[#364153] mb-2">Waktu Keberangkatan</label>
                  <input
                    type="time"
                    name="waktu_keberangkatan"
                    value={formData.waktu_keberangkatan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                  />
                </div>
              </div>

              {/* Nama Instansi */}
              <div>
                <label className="block text-sm text-[#364153] mb-2">Nama Instansi</label>
                <input
                  type="text"
                  name="nama_instansi"
                  value={formData.nama_instansi}
                  onChange={handleInputChange}
                  placeholder="PT. Contoh Perusahaan"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm text-[#364153] mb-2">Catatan</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  placeholder="Catatan tambahan..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#009966] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
              <button 
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-[10px] hover:opacity-90 transition-opacity">
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
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <svg className="w-12 h-12 text-[#e7000b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-[#101828] mb-2">Konfirmasi Penghapusan</h3>
              <p className="text-[#6a7282] text-base">
                Apakah Anda yakin ingin menghapus jadwal yang dipilih? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleConfirmDelete}
                className="bg-[#e7000b] text-white px-8 py-3 rounded-lg text-base hover:bg-[#c00009] transition-colors font-medium"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-[#99a1af] text-white px-8 py-3 rounded-lg text-base hover:bg-[#8891a1] transition-colors font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
