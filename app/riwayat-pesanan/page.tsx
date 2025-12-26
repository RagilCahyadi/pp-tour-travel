"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  User,
  Building2,
  Phone,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar";
import Footer from "@/components/landing/Footer";
import EditBookingDialog from "@/components/ui/custom/EditBookingDialog";
import DeleteBookingDialog from "@/components/ui/custom/DeleteBookingDialog";
import PrintBookingDialog from "@/components/ui/custom/PrintBookingDialog";

// For now using mock data - will be replaced with Supabase data later
const mockBookings = [
  {
    id: "1",
    kode_booking: "BKGXX8MWZ3",
    paket_tour: "Paket Ekonomis Bali",
    tanggal_keberangkatan: "9 Desember 2025",
    jumlah_pax: 50,
    nama_pemesan: "Sigit",
    instansi: "PT BUANA",
    kontak: "08521641118",
    status_bayar: "Sudah dibayar",
    status: "confirmed",
  },
];

export default function RiwayatPesanan() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"semua" | "menunggu" | "terkonfirmasi">("semua");
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const handleSelectBooking = (id: string) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter((bookingId) => bookingId !== id));
    } else {
      setSelectedBookings([...selectedBookings, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === mockBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(mockBookings.map((b) => b.id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedNavbar />
      
      <div className="pt-[96px] pb-20">
        {/* Header Section */}
        <div className="max-w-[1216px] mx-auto px-0">
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
              {/* Search Input */}
              <div className="relative w-[837px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(10,10,10,0.5)]" />
                <Input
                  placeholder="Cari berdasarkan paket, kode booking, atau nama pemesan..."
                  className="pl-12 h-[50px] border-[#e5e7eb] rounded-[16.4px] text-[16px] placeholder:text-[rgba(10,10,10,0.5)]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tab Filter */}
              <div className="flex items-center gap-2 bg-[#f9fafb] p-1 rounded-[16.4px] h-[50px]">
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("semua")}
                  className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${
                    activeTab === "semua"
                      ? "bg-white shadow-sm text-[#009966]"
                      : "text-[#4a5565] hover:text-[#009966]"
                  }`}
                >
                  Semua
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("menunggu")}
                  className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${
                    activeTab === "menunggu"
                      ? "bg-white shadow-sm text-[#009966]"
                      : "text-[#4a5565] hover:text-[#009966]"
                  }`}
                >
                  Menunggu
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab("terkonfirmasi")}
                  className={`rounded-[10px] px-4 h-9 text-[14px] font-normal ${
                    activeTab === "terkonfirmasi"
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
                <div className="text-[36px] font-normal text-white leading-[40px]">1</div>
                <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Total Pesanan</div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center gap-2">
                <div className="text-[36px] font-normal text-white leading-[40px]">1</div>
                <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Menunggu Konfirmasi</div>
              </div>
              <div className="p-6 flex flex-col items-center justify-center gap-2">
                <div className="text-[36px] font-normal text-white leading-[40px]">0</div>
                <div className="text-[#ecfdf5] text-[14px] leading-[20px]">Terkonfirmasi</div>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#f3f4f6] rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] overflow-hidden mb-20">
            
            {/* Action Bar */}
            {selectedBookings.length > 0 && (
              <div className="bg-gradient-to-r from-[#f9fafb] to-[rgba(243,244,246,0.5)] border-b border-[#e5e7eb] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="bg-[#d0fae5] px-3 py-1.5 rounded-full">
                    <span className="text-[#007a55] text-[14px] font-normal">
                      {selectedBookings.length} pesanan dipilih
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
                    <Button className="bg-[#00bc7d] hover:bg-[#00a870] text-white rounded-[10px] px-4 h-10 flex items-center gap-2 text-[14px] font-normal">
                      <CreditCard className="w-4 h-4" />
                      Bayar
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
                      <input
                        type="checkbox"
                        checked={selectedBookings.length === mockBookings.length}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-[#00bc7d] focus:ring-[#00bc7d]"
                      />
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
                  {mockBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="grid grid-cols-[64px_183px_195px_165px_164px_141px_141px_161px] items-center border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors h-[72.5px]"
                    >
                      <div className="px-6">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => handleSelectBooking(booking.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#00bc7d] focus:ring-[#00bc7d]"
                        />
                      </div>
                      <div className="px-6">
                        <div className="text-[#101828] text-[14px] font-normal mb-1">
                          {booking.paket_tour}
                        </div>
                        <div className="text-[#6a7282] text-[12px]">
                          Kode: {booking.kode_booking}
                        </div>
                      </div>
                      <div className="px-6 text-[#364153] text-[14px]">
                        {booking.tanggal_keberangkatan}
                      </div>
                      <div className="px-6">
                        <span className="bg-[#d0fae5] text-[#007a55] px-3 py-1 rounded-full text-[14px]">
                          {booking.jumlah_pax}
                        </span>
                      </div>
                      <div className="px-6 text-[#101828] text-[14px]">
                        {booking.nama_pemesan}
                      </div>
                      <div className="px-6 text-[#364153] text-[14px]">
                        {booking.instansi}
                      </div>
                      <div className="px-6 text-[#364153] text-[14px]">
                        {booking.kontak}
                      </div>
                      <div className="px-6">
                        <div className="flex items-center gap-1.5 bg-[rgba(0,212,146,0.3)] px-3 py-1.5 rounded-full w-fit">
                          <CheckCircle className="w-3.5 h-3.5 text-[#007a55]" />
                          <span className="text-[#007a55] text-[12px]">
                            {booking.status_bayar}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <EditBookingDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        booking={mockBookings.find(b => selectedBookings.includes(b.id)) || null}
      />

      <DeleteBookingDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          // Handle delete logic here
          setIsDeleteDialogOpen(false);
          setSelectedBookings([]);
        }}
        count={selectedBookings.length}
      />

      <PrintBookingDialog 
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        booking={mockBookings.find(b => selectedBookings.includes(b.id)) || null}
      />

      <Footer />
    </div>
  );
}
