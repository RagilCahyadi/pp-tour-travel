"use client";

import React, { useRef } from "react";
import { 
  X, 
  Printer, 
  MapPin, 
  Calendar, 
  Users, 
  CreditCard, 
  User, 
  Building2, 
  Phone, 
  Mail,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PrintBookingDialogProps {
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
    email?: string;
    total_pembayaran?: string;
    status_bayar?: string;
  } | null;
}

export default function PrintBookingDialog({ isOpen, onClose, booking }: PrintBookingDialogProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden print:p-0 print:bg-white print:overflow-visible">
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Sembunyikan semua elemen body kecuali area print */
          body > *:not(#print-root) {
            display: none !important;
          }
          /* Tampilkan root print */
          #print-root {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: white;
          }
          #print-content {
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {/* Tambahkan id="print-root" untuk scoping saat print */}
      <div id="print-root" className="bg-white w-full max-w-[650px] rounded-[20px] shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:max-w-none print:shadow-none print:rounded-none">
        
        {/* Header - Hidden on Print */}
        <div className="bg-gradient-to-r from-[#00bc7d] to-[#009966] h-[60px] flex items-center justify-between px-5 shrink-0 rounded-t-[20px] relative overflow-hidden print:hidden">
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 rounded-[12px] w-[40px] h-[40px] flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-white text-[18px] font-bold leading-tight">Preview Nota Pesanan</h2>
              <p className="text-[#d0fae5] text-[12px]">Siap untuk dicetak atau disimpan sebagai PDF</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-[12px] w-9 h-9 flex items-center justify-center relative z-10"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Content Container - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#f9fafb] print:p-0 print:overflow-visible print:bg-white">
          
          {/* Print Button - Hidden on Print */}
          <div className="flex justify-end mb-4 print:hidden">
             <Button 
                onClick={handlePrint}
                className="bg-gradient-to-r from-[#00bc7d] to-[#009966] text-white rounded-[12px] h-[40px] px-5 flex items-center gap-2 text-[13px] font-semibold shadow-md hover:opacity-90 transition-all"
             >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF
             </Button>
          </div>

          {/* Invoice Preview - This is what gets printed */}
          <div id="print-content" className="bg-white border border-[#e5e7eb] rounded-[20px] shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
            
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-[#00bc7c] to-[#3f3e2e] h-[100px] relative p-6 flex justify-between items-start print:h-[100px] print:p-8">
               <div className="text-white z-10">
                 <h1 className="text-[24px] font-bold mb-1">PP Tour Travel</h1>
                 <p className="text-[12px] opacity-90">Wujudkan Petualangan Impian Anda</p>
               </div>
               
               <div className="bg-white/20 border border-white/30 rounded-[12px] px-4 py-2 backdrop-blur-sm z-10">
                 <p className="text-[#c6d2ff] text-[10px] mb-0.5">Kode Pesanan</p>
                 <p className="text-white text-[16px] tracking-wider font-medium">{booking.kode_booking}</p>
               </div>
               
               {/* Decorative overlay */}
               <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            </div>

            {/* Invoice Body */}
            <div className="p-6 flex flex-col gap-6 print:p-8 print:gap-8">
              
              {/* Detail Paket Wisata */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#00bc7d] to-[#009966] flex items-center justify-center shadow-sm">
                    <MapPin className="text-white w-4 h-4" />
                  </div>
                  <h3 className="text-[#101828] text-[16px] font-bold">Detail Paket Wisata</h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Row 1: Nama Paket */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      🎒 Nama Paket
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.paket_tour}
                    </div>
                  </div>

                  {/* Row 2: Destinasi */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      📍 Destinasi
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.destination || "Bali"}
                    </div>
                  </div>

                  {/* Row 3: Keberangkatan */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      📅 Keberangkatan
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.tanggal_keberangkatan}
                    </div>
                  </div>

                  {/* Row 4: Jumlah PAX */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      👥 Jumlah PAX
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.jumlah_pax} orang
                    </div>
                  </div>
                </div>

                {/* Total Payment Box */}
                <div className="bg-gradient-to-r from-[#fffbeb] to-[#fef3c6] border-2 border-[#ffb900] rounded-[12px] p-4 shadow-sm flex flex-col gap-0.5 h-[80px] justify-center mt-2">
                  <p className="text-[#973c00] text-[11px] uppercase tracking-wider font-bold">💰 Total Pembayaran</p>
                  <p className="text-[#7b3306] text-[24px] font-extrabold leading-tight">{booking.total_pembayaran || "Rp 55.000.000"}</p>
                </div>

                {/* Status */}
                <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100 mt-1">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      💳 Status
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px] uppercase">
                      {booking.status_bayar || "SUDAH DIBAYAR"}
                    </div>
                  </div>
              </div>

              {/* Informasi Pemesan */}
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#2b7fff] to-[#155dfc] flex items-center justify-center shadow-sm">
                    <User className="text-white w-4 h-4" />
                  </div>
                  <h3 className="text-[#101828] text-[16px] font-bold">Informasi Pemesan</h3>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {/* Nama Lengkap */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      👨 Nama Lengkap
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.nama_pemesan}
                    </div>
                  </div>

                  {/* Instansi */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      🏢 Instansi
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.instansi}
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      📱 WhatsApp
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.kontak}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      📧 Email
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px]">
                      {booking.email || "Sigit@gmail.com"}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Invoice Footer */}
            <div className="bg-gradient-to-r from-[#1e2939] to-[#101828] h-[80px] relative flex flex-col items-center justify-center gap-1 print:h-[80px]">
               <div className="w-[60px] h-[3px] bg-[#00bc7d] rounded-full absolute top-[12px]" />
               <p className="text-[#99a1af] text-[12px] font-semibold mt-3">
                 Dokumen dicetak pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
               </p>
               <p className="text-[#6a7282] text-[10px]">
                 © 2025 Explore Travel Agency. All rights reserved.
               </p>
            </div>

          </div>

        </div>

        {/* Footer - Hidden on Print */}
        <div className="bg-[#f9fafb] border-t border-[#e5e7eb] p-4 flex justify-end rounded-b-[20px] shrink-0 print:hidden">
          <Button 
            onClick={onClose}
            className="h-[40px] rounded-[12px] bg-[#e5e7eb] text-[#364153] hover:bg-[#d1d5db] text-[13px] font-semibold px-6"
          >
            Tutup
          </Button>
        </div>

      </div>
    </div>
  );
}
