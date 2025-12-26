"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Script from "next/script";
import {
  Search,
  ChevronLeft,
  Edit,
  Trash2,
  CreditCard,
  Printer,
  MapPin,
  Calendar,
  Users,
  Building2,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar";
import Footer from "@/components/landing/Footer";
import EditBookingDialog from "@/components/ui/custom/EditBookingDialog";
import DeleteBookingDialog from "@/components/ui/custom/DeleteBookingDialog";
import PrintBookingDialog from "@/components/ui/custom/PrintBookingDialog";

interface BookingRaw {
  id: string;
  kode_booking: string;
  jumlah_pax: number;
  tanggal_keberangkatan: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  catatan: string | null;
  total_biaya: number | null;
  created_at: string;
  customers: {
    nama_pelanggan: string;
    nama_perusahaan: string | null;
    nomor_telepon: string | null;
    email: string | null;
  } | null;
  tour_packages: {
    id: string;
    nama_paket: string;
    lokasi: string;
    harga: number;
  } | null;
  payments: {
    id: string;
    status: 'pending' | 'verified' | 'rejected';
    snap_token: string | null;
    midtrans_order_id: string | null;
  }[];
}

export default function RiwayatPesanan() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRaw[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"semua" | "menunggu" | "terkonfirmasi">("semua");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Fetch user bookings from Supabase
  const fetchBookings = async () => {
    if (!isLoaded || !user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          kode_booking,
          jumlah_pax,
          tanggal_keberangkatan,
          status,
          catatan,
          total_biaya,
          created_at,
          customers!inner (
            user_id,
            nama_pelanggan,
            nama_perusahaan,
            nomor_telepon,
            email
          ),
          tour_packages (
            id,
            nama_paket,
            lokasi,
            harga
          ),
          payments (
            id,
            status,
            snap_token,
            midtrans_order_id
          )
        `)
        .eq('customers.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      const transformedData: BookingRaw[] = (data || []).map((item: any) => ({
        ...item,
        customers: Array.isArray(item.customers) ? item.customers[0] : item.customers,
        tour_packages: Array.isArray(item.tour_packages) ? item.tour_packages[0] : item.tour_packages,
        payments: item.payments || [],
      }));

      setBookings(transformedData);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id, isLoaded]);

  // Filter bookings based on search and tab
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      booking.kode_booking.toLowerCase().includes(searchLower) ||
      booking.tour_packages?.nama_paket.toLowerCase().includes(searchLower) ||
      booking.customers?.nama_pelanggan.toLowerCase().includes(searchLower);

    let matchesTab = true;
    if (activeTab === "menunggu") {
      matchesTab = booking.status === "pending";
    } else if (activeTab === "terkonfirmasi") {
      matchesTab = booking.status === "confirmed" || booking.status === "completed";
    }

    return matchesSearch && matchesTab;
  });

  // Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const confirmedBookings = bookings.filter(b => b.status === "confirmed" || b.status === "completed").length;

  // Single selection handler
  const handleSelectBooking = (id: string) => {
    if (selectedBookingId === id) {
      setSelectedBookingId(null);
    } else {
      setSelectedBookingId(id);
    }
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "Rp 0";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get payment status
  const getPaymentStatus = (payments: { status: string }[]) => {
    if (!payments || payments.length === 0) return 'pending';
    // Check if any payment is verified
    const hasVerified = payments.some(p => p.status === 'verified');
    if (hasVerified) return 'verified';
    const hasRejected = payments.some(p => p.status === 'rejected');
    if (hasRejected) return 'rejected';
    return 'pending';
  };

  // Render payment status badge
  const renderPaymentBadge = (payments: { status: string }[]) => {
    const status = getPaymentStatus(payments);

    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 bg-[rgba(0,212,146,0.3)] px-3 py-1.5 rounded-full w-fit">
            <CheckCircle className="w-3.5 h-3.5 text-[#007a55]" />
            <span className="text-[#007a55] text-[12px]">Sudah dibayar</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 bg-red-100 px-3 py-1.5 rounded-full w-fit">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            <span className="text-red-600 text-[12px]">Ditolak</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1.5 rounded-full w-fit">
            <Clock className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-yellow-600 text-[12px]">Menunggu</span>
          </div>
        );
    }
  };

  // Handle Midtrans payment
  const handlePayment = async () => {
    if (!selectedBookingId || !snapReady) return;

    const selectedBooking = bookings.find(b => b.id === selectedBookingId);
    if (!selectedBooking) return;

    // Check if already paid
    if (getPaymentStatus(selectedBooking.payments) === 'verified') {
      alert('Pesanan ini sudah dibayar');
      return;
    }

    setIsPaymentLoading(true);

    try {
      // Check if there's an existing snap token
      const existingPayment = selectedBooking.payments.find(p => p.snap_token);

      if (existingPayment?.snap_token) {
        // Use existing snap token
        window.snap.pay(existingPayment.snap_token, {
          onSuccess: function (result) {
            console.log('Payment success:', result);
            alert('Pembayaran berhasil!');
            fetchBookings();
          },
          onPending: function (result) {
            console.log('Payment pending:', result);
            alert('Menunggu pembayaran');
            fetchBookings();
          },
          onError: function (result) {
            console.log('Payment error:', result);
            alert('Pembayaran gagal');
          },
          onClose: function () {
            console.log('Payment popup closed');
            setIsPaymentLoading(false);
          }
        });
      } else {
        // Create new transaction
        const response = await fetch('/api/payment/retry-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: selectedBooking.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Gagal membuat transaksi');
        }

        window.snap.pay(data.token, {
          onSuccess: function (result) {
            console.log('Payment success:', result);
            alert('Pembayaran berhasil!');
            fetchBookings();
          },
          onPending: function (result) {
            console.log('Payment pending:', result);
            alert('Menunggu pembayaran');
            fetchBookings();
          },
          onError: function (result) {
            console.log('Payment error:', result);
            alert('Pembayaran gagal');
          },
          onClose: function () {
            console.log('Payment popup closed');
            setIsPaymentLoading(false);
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
      setIsPaymentLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedBookingId) return;

    try {
      // First delete related payments
      await supabase
        .from('payments')
        .delete()
        .eq('booking_id', selectedBookingId);

      // Then delete the booking
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', selectedBookingId);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setSelectedBookingId(null);
      fetchBookings();
      alert('Pesanan berhasil dihapus');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Gagal menghapus pesanan');
    }
  };

  // Get selected booking data for dialogs
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const dialogBooking = selectedBooking ? {
    id: selectedBooking.id,
    kode_booking: selectedBooking.kode_booking,
    paket_tour: selectedBooking.tour_packages?.nama_paket || '',
    destination: selectedBooking.tour_packages?.lokasi || '',
    tanggal_keberangkatan: formatDate(selectedBooking.tanggal_keberangkatan),
    jumlah_pax: selectedBooking.jumlah_pax,
    nama_pemesan: selectedBooking.customers?.nama_pelanggan || '',
    instansi: selectedBooking.customers?.nama_perusahaan || '-',
    kontak: selectedBooking.customers?.nomor_telepon || '-',
    email: selectedBooking.customers?.email || '-',
    catatan: selectedBooking.catatan || '',
    total_pembayaran: formatCurrency(selectedBooking.total_biaya),
    status_bayar: getPaymentStatus(selectedBooking.payments) === 'verified' ? 'SUDAH DIBAYAR' : 'MENUNGGU PEMBAYARAN',
    status: selectedBooking.status,
  } : null;

  return (
    <>
      {/* Midtrans Snap Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onLoad={() => setSnapReady(true)}
      />

      <div className="min-h-screen bg-white">
        <AuthenticatedNavbar />

        <div className="pt-[96px] pb-20">
          <div className="max-w-[1216px] mx-auto px-4">
            {/* Back Button */}
            <Link href="/" className="flex items-center gap-2 text-[#4a5565] hover:text-[#00bc7d] mb-6 w-fit group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[16px] font-['Inter']">Kembali ke Beranda</span>
            </Link>

            {/* Title Section */}
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
                style={{ backgroundImage: "linear-gradient(135deg, #00bc7d 0%, #009966 100%)" }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-[40px] font-bold text-[#101828] leading-[48px] font-['Inter']">
                  Riwayat Pemesanan
                </h1>
                <p className="text-[#4a5565] text-[16px] leading-[25.6px] font-['Inter']">
                  Kelola dan lacak semua pesanan Anda
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] p-[25px] mb-8 h-[100px] flex items-center">
              <div className="flex items-center justify-between w-full gap-4">
                <div className="relative flex-1 max-w-[837px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(10,10,10,0.5)]" />
                  <Input
                    placeholder="Cari berdasarkan paket, kode booking, atau nama pemesan..."
                    className="pl-12 h-[50px] border-[#e5e7eb] rounded-[16.4px] text-[16px] placeholder:text-[rgba(10,10,10,0.5)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 bg-[#f9fafb] p-1 rounded-[16.4px] h-[50px]">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("semua")}
                    className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${activeTab === "semua"
                        ? "bg-white shadow-sm text-[#009966]"
                        : "text-[#4a5565] hover:text-[#009966]"
                      }`}
                  >
                    Semua
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("menunggu")}
                    className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${activeTab === "menunggu"
                        ? "bg-white shadow-sm text-[#009966]"
                        : "text-[#4a5565] hover:text-[#009966]"
                      }`}
                  >
                    Menunggu
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("terkonfirmasi")}
                    className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${activeTab === "terkonfirmasi"
                        ? "bg-white shadow-sm text-[#009966]"
                        : "text-[#4a5565] hover:text-[#009966]"
                      }`}
                  >
                    Terkonfirmasi
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div
              className="rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] mb-8 overflow-hidden h-[116px]"
              style={{ backgroundImage: "linear-gradient(to right, #00bc7d 0%, #009966 100%)" }}
            >
              <div className="grid grid-cols-3 divide-x divide-[rgba(0,212,146,0.3)] h-full">
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <div className="text-[36px] font-normal text-white leading-[40px]">{totalBookings}</div>
                  <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Total Pesanan</div>
                </div>
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <div className="text-[36px] font-normal text-white leading-[40px]">{pendingBookings}</div>
                  <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Menunggu Konfirmasi</div>
                </div>
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <div className="text-[36px] font-normal text-white leading-[40px]">{confirmedBookings}</div>
                  <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Terkonfirmasi</div>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden mb-20">

              {/* Action Bar */}
              {selectedBookingId && (
                <div className="bg-gradient-to-r from-[#f9fafb] to-[rgba(243,244,246,0.5)] border-b border-[#e5e7eb] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-[#d0fae5] px-3 py-1.5 rounded-full">
                      <span className="text-[#007a55] text-[14px] font-normal">
                        1 pesanan dipilih
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setIsEditDialogOpen(true)}
                        className="bg-[#2b7fff] hover:bg-[#1e5fd9] text-white rounded-[10px] px-4 h-10 flex items-center gap-2 text-[14px] font-normal"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="bg-[#fb2c36] hover:bg-[#d91f28] text-white rounded-[10px] px-4 h-10 flex items-center gap-2 text-[14px] font-normal"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isPaymentLoading || !snapReady || getPaymentStatus(selectedBooking?.payments || []) === 'verified'}
                        className="bg-[#00bc7d] hover:bg-[#00a870] text-white rounded-[10px] px-4 h-10 flex items-center gap-2 text-[14px] font-normal disabled:opacity-50"
                      >
                        {isPaymentLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CreditCard className="w-4 h-4" />
                        )}
                        {getPaymentStatus(selectedBooking?.payments || []) === 'verified' ? 'Sudah Dibayar' : 'Bayar'}
                      </Button>
                      <Button
                        onClick={() => setIsPrintDialogOpen(true)}
                        className="bg-[#ad46ff] hover:bg-[#9333ea] text-white rounded-[10px] px-4 h-10 flex items-center gap-2 text-[14px] font-normal"
                      >
                        <Printer className="w-4 h-4" />
                        Cetak
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Content */}
              <div className="overflow-x-auto">
                <div className="min-w-[1214px]">
                  {/* Table Header */}
                  <div
                    className="border-b border-[#a4f4cf]"
                    style={{ backgroundImage: "linear-gradient(to right, #ecfdf5 0%, rgba(208,250,229,0.5) 100%)" }}
                  >
                    <div className="grid grid-cols-[64px_183px_195px_165px_164px_141px_141px_161px] h-[56.5px] items-center">
                      <div className="px-6">
                        {/* Empty header for radio column */}
                      </div>
                      <div className="px-6 flex items-center gap-2 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        <MapPin className="w-4 h-4" />
                        Paket Tour
                      </div>
                      <div className="px-6 flex items-center gap-2 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        <Calendar className="w-4 h-4" />
                        Keberangkatan
                      </div>
                      <div className="px-6 flex items-center gap-2 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        <Users className="w-4 h-4" />
                        Jumlah PAX
                      </div>
                      <div className="px-6 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        Nama Pemesan
                      </div>
                      <div className="px-6 flex items-center gap-2 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        <Building2 className="w-4 h-4" />
                        Instansi
                      </div>
                      <div className="px-6 flex items-center gap-2 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        <Phone className="w-4 h-4" />
                        Kontak
                      </div>
                      <div className="px-6 text-[#364153] text-[12px] font-bold uppercase tracking-[0.6px]">
                        Status Bayar
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div>
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-[#00bc7d]" />
                        <span className="ml-3 text-[#4a5565]">Memuat data...</span>
                      </div>
                    ) : filteredBookings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-[#4a5565] text-lg mb-2">Belum ada pesanan</p>
                        <p className="text-[#9ca3af] text-sm">Pesanan Anda akan muncul di sini</p>
                        <Link href="/paket-tour">
                          <Button className="mt-6 bg-[#00bc7d] hover:bg-[#00a870] text-white rounded-xl">
                            Lihat Paket Tour
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          onClick={() => handleSelectBooking(booking.id)}
                          className={`grid grid-cols-[64px_183px_195px_165px_164px_141px_141px_161px] items-center border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors h-[72.5px] cursor-pointer ${selectedBookingId === booking.id ? 'bg-[#ecfdf5]' : ''
                            }`}
                        >
                          <div className="px-6">
                            <input
                              type="radio"
                              name="booking-select"
                              checked={selectedBookingId === booking.id}
                              onChange={() => handleSelectBooking(booking.id)}
                              className="w-4 h-4 text-[#00bc7d] focus:ring-[#00bc7d]"
                            />
                          </div>
                          <div className="px-6">
                            <div className="text-[#101828] text-[14px] font-normal mb-1">
                              {booking.tour_packages?.nama_paket || '-'}
                            </div>
                            <div className="text-[#6a7282] text-[12px]">
                              Kode: {booking.kode_booking}
                            </div>
                          </div>
                          <div className="px-6 text-[#364153] text-[14px]">
                            {formatDate(booking.tanggal_keberangkatan)}
                          </div>
                          <div className="px-6">
                            <span className="bg-[#d0fae5] text-[#007a55] px-3 py-1 rounded-full text-[14px]">
                              {booking.jumlah_pax}
                            </span>
                          </div>
                          <div className="px-6 text-[#101828] text-[14px]">
                            {booking.customers?.nama_pelanggan || '-'}
                          </div>
                          <div className="px-6 text-[#364153] text-[14px]">
                            {booking.customers?.nama_perusahaan || '-'}
                          </div>
                          <div className="px-6 text-[#364153] text-[14px]">
                            {booking.customers?.nomor_telepon || '-'}
                          </div>
                          <div className="px-6">
                            {renderPaymentBadge(booking.payments)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <EditBookingDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          booking={dialogBooking}
          onSave={fetchBookings}
        />

        <DeleteBookingDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          count={1}
        />

        <PrintBookingDialog
          isOpen={isPrintDialogOpen}
          onClose={() => setIsPrintDialogOpen(false)}
          booking={dialogBooking}
        />

        <Footer />
      </div>
    </>
  );
}
