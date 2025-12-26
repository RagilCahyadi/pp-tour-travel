"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  User,
  Phone,
  Users,
  Building2,
  FileText,
  Save,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EditBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    kode_booking: string;
    paket_tour: string;
    destination?: string;
    tanggal_keberangkatan: string;
    jumlah_pax: number;
    nama_pemesan: string;
    instansi: string;
    kontak: string;
    catatan?: string;
    total_pembayaran?: string;
  } | null;
}

export default function EditBookingDialog({ isOpen, onClose, booking }: EditBookingDialogProps) {
  // Helper to convert "9 Desember 2025" to "2025-12-09" for input type="date"
  const formatDateForInput = (dateString: string) => {
    const months: { [key: string]: string } = {
      'Januari': '01', 'Februari': '02', 'Maret': '03', 'April': '04', 'Mei': '05', 'Juni': '06',
      'Juli': '07', 'Agustus': '08', 'September': '09', 'Oktober': '10', 'November': '11', 'Desember': '12'
    };
    const parts = dateString.split(' ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]];
      const year = parts[2];
      if (month) return `${year}-${month}-${day}`;
    }
    return "";
  };

  // State for form fields
  const [namaPemesan, setNamaPemesan] = useState("");
  const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState("");
  const [kontak, setKontak] = useState("");
  const [instansi, setInstansi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form when booking changes
  React.useEffect(() => {
    if (booking) {
      setNamaPemesan(booking.nama_pemesan);
      setTanggalKeberangkatan(formatDateForInput(booking.tanggal_keberangkatan));
      setKontak(booking.kontak);
      setInstansi(booking.instansi);
      setCatatan(booking.catatan || "Penyediaan Obat umum dan Alat P3K Sederhana");
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      // Prepare updated booking data
      const updatedData = {
        id: booking.id,
        nama_pemesan: namaPemesan,
        tanggal_keberangkatan: tanggalKeberangkatan,
        kontak: kontak,
        instansi: instansi,
        catatan: catatan,
      };

      console.log("Saving booking:", updatedData);

      // TODO: Call API to update booking in database
      // await updateBooking(updatedData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("✅ Perubahan berhasil disimpan!");
      onClose();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("❌ Gagal menyimpan perubahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const minDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[800px] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#2b7fff] to-[#155dfc] h-[100px] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-[10px] w-9 h-9 flex items-center justify-center">
              <Edit className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white text-[32px] font-bold leading-tight">Edit Pesanan</h2>
              <p className="text-blue-100 text-[16px]">Kode: {booking.kode_booking}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-[10px] w-9 h-9 flex items-center justify-center"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">

          {/* Package Info Box */}
          <div className="bg-gradient-to-r from-[#ecfdf5] to-[rgba(208,250,229,0.5)] border border-[#a4f4cf] rounded-[16px] p-4 flex flex-col gap-1">
            <span className="text-[#4a5565] text-sm">Paket Tour</span>
            <h3 className="text-[#101828] text-lg font-medium">{booking.paket_tour}</h3>
            <span className="text-[#009966] text-sm">{booking.destination || "Bali"}</span>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Nama Pemesan */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#364153] text-sm">
                <User className="w-4 h-4" />
                Nama Pemesan
              </label>
              <Input
                value={namaPemesan}
                onChange={(e) => setNamaPemesan(e.target.value)}
                className="h-[50px] rounded-[16px] border-[#d1d5dc] text-[16px]"
              />
            </div>

            {/* Keberangkatan */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#364153] text-sm">
                <Calendar className="w-4 h-4" />
                Keberangkatan
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={tanggalKeberangkatan}
                  onChange={(e) => setTanggalKeberangkatan(e.target.value)}
                  min={minDate}
                  className="h-[50px] rounded-[16px] border-[#d1d5dc] text-[16px] block"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#364153] text-sm">
                <Phone className="w-4 h-4" />
                WhatsApp
              </label>
              <Input
                value={kontak}
                onChange={(e) => setKontak(e.target.value)}
                className="h-[50px] rounded-[16px] border-[#d1d5dc] text-[16px]"
              />
            </div>

            {/* Jumlah PAX */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#364153] text-sm">
                <Users className="w-4 h-4" />
                Jumlah PAX
              </label>
              <Input
                type="number"
                defaultValue={booking.jumlah_pax}
                disabled
                className="h-[50px] rounded-[16px] border-[#d1d5dc] text-[16px] bg-[#f3f4f6] text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Instansi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#364153] text-sm">
                <Building2 className="w-4 h-4" />
                Instansi
              </label>
              <Input
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                className="h-[50px] rounded-[16px] border-[#d1d5dc] text-[16px]"
              />
            </div>

          </div>

          {/* Catatan Tambahan (Full Width) */}
          <div className="space-y-2">
            <label className="text-[#364153] text-sm">
              Catatan Tambahan (Opsional)
            </label>
            <textarea
              className="w-full min-h-[98px] rounded-[16px] border border-[#d1d5dc] p-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>

          {/* Total Pembayaran Box */}
          <div className="bg-gradient-to-r from-[#eff6ff] to-[rgba(219,234,254,0.5)] border border-[#bedbff] rounded-[16px] p-4 flex items-center justify-between">
            <span className="text-[#4a5565] text-sm">Total Pembayaran</span>
            <span className="text-[#155dfc] text-2xl font-bold">{booking.total_pembayaran || "Rp 55.000.000"}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-[48px] rounded-[16px] bg-[#f3f4f6] text-[#364153] hover:bg-[#e5e7eb] text-[16px] font-normal"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex-1 h-[48px] rounded-[16px] bg-gradient-to-r from-[#2b7fff] to-[#155dfc] text-white hover:opacity-90 text-[16px] font-normal gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
