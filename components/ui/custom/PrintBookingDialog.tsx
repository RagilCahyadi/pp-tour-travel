"use client";

import React, { useRef, useState } from "react";
import {
  X,
  Printer,
  MapPin,
  User,
  FileText,
  Loader2,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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
  paymentId?: string | null;
  onInvoiceSaved?: () => void;
}

export default function PrintBookingDialog({
  isOpen,
  onClose,
  booking,
  paymentId,
  onInvoiceSaved
}: PrintBookingDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    // Get the invoice content
    const invoiceContent = printRef.current;
    if (!invoiceContent) {
      alert('Tidak dapat mencetak invoice. Silakan coba lagi.');
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      alert('Pop-up diblokir. Silakan izinkan pop-up untuk mencetak.');
      return;
    }

    // Write the content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Print Invoice - ${booking.kode_booking}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          ${invoiceContent.innerHTML}
          <script>
            // Wait for Tailwind to load, then print
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Save invoice as image to Supabase storage
  const handleSaveInvoice = async () => {
    if (!printRef.current || !paymentId) {
      alert('Tidak dapat menyimpan invoice. Pastikan pembayaran sudah terverifikasi.');
      console.error('Missing printRef or paymentId:', { printRef: !!printRef.current, paymentId });
      return;
    }

    setIsSaving(true);
    console.log('Starting invoice save process...');

    try {
      // Dynamically import html2canvas for image capture
      console.log('Step 1: Importing html2canvas...');
      const html2canvas = (await import('html2canvas')).default;

      // Capture the invoice content as an image
      console.log('Step 2: Capturing canvas...');
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
      });
      console.log('Step 2 complete: Canvas created', { width: canvas.width, height: canvas.height });

      // Convert canvas to blob
      console.log('Step 3: Converting to blob...');
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        }, 'image/png', 0.95);
      });
      console.log('Step 3 complete: Blob created', { size: blob.size });

      // Generate unique filename
      const fileName = `invoices/${booking.kode_booking}-${Date.now()}.png`;
      console.log('Step 4: Uploading to Supabase storage...', { fileName, bucket: 'bukti-pembayaran' });

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('bukti-pembayaran')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Step 4 FAILED - Upload error:', uploadError);
        throw new Error(`Gagal mengupload invoice: ${uploadError.message}`);
      }
      console.log('Step 4 complete: Upload success', uploadData);

      // Get public URL
      console.log('Step 5: Getting public URL...');
      const { data: urlData } = supabase.storage
        .from('bukti-pembayaran')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      console.log('Step 5 complete: Public URL', publicUrl);

      // Update payment record with invoice URL
      console.log('Step 6: Updating payment record...', { paymentId, publicUrl });
      const { error: updateError } = await supabase
        .from('payments')
        .update({ bukti_pembayaran_url: publicUrl })
        .eq('id', paymentId);

      if (updateError) {
        console.error('Step 6 FAILED - Update error:', updateError);
        throw new Error(`Gagal menyimpan URL invoice: ${updateError.message}`);
      }
      console.log('Step 6 complete: Payment record updated');

      alert('Invoice berhasil disimpan!');
      onInvoiceSaved?.();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert(error instanceof Error ? error.message : 'Gagal menyimpan invoice');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          /* Force color printing */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide everything except the invoice */
          body > * {
            display: none !important;
          }
          
          /* Show only the print dialog overlay */
          body > .print-dialog-overlay {
            display: block !important;
            position: static !important;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: auto !important;
          }
          
          /* Hide elements with print-hide class */
          .print-hide {
            display: none !important;
          }
          
          /* Make the invoice content visible and full width */
          #invoice-content {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Ensure the container shows */
          .print-dialog-overlay > div {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
          }
          
          .print-dialog-overlay > div > div {
            display: block !important;
            padding: 0 !important;
            background: white !important;
          }
          
          /* Ensure gradients print correctly */
          .bg-gradient-to-r,
          .bg-gradient-to-br {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="print-dialog-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden">
        <div className="bg-white w-full max-w-[650px] rounded-[20px] shadow-2xl flex flex-col max-h-[90vh]">

          {/* Header - Hidden on Print */}
          <div className="print-hide bg-gradient-to-r from-[#00bc7d] to-[#009966] h-[60px] flex items-center justify-between px-5 shrink-0 rounded-t-[20px] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 rounded-[12px] w-[40px] h-[40px] flex items-center justify-center">
                <FileText className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white text-[18px] font-bold leading-tight">Preview Nota Pesanan</h2>
                <p className="text-[#d0fae5] text-[12px]">Siap untuk dicetak atau disimpan</p>
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
          <div className="flex-1 overflow-y-auto p-5 bg-[#f9fafb]">

            {/* Action Buttons - Hidden on Print */}
            <div className="print-hide flex justify-end gap-2 mb-4">
              {paymentId && (
                <Button
                  onClick={handleSaveInvoice}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-[#ad46ff] to-[#9333ea] text-white rounded-[12px] h-[40px] px-5 flex items-center gap-2 text-[13px] font-semibold shadow-md hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Simpan Invoice
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handlePrint}
                className="bg-gradient-to-r from-[#00bc7d] to-[#009966] text-white rounded-[12px] h-[40px] px-5 flex items-center gap-2 text-[13px] font-semibold shadow-md hover:opacity-90 transition-all"
              >
                <Printer className="w-4 h-4" />
                Cetak / Simpan PDF
              </Button>
            </div>

            {/* Invoice Preview - This is what gets printed and captured */}
            <div ref={printRef} id="invoice-content" className="bg-white border border-[#e5e7eb] rounded-[20px] shadow-sm overflow-hidden">

              {/* Invoice Header */}
              <div className="bg-gradient-to-r from-[#00bc7c] to-[#3f3e2e] h-[100px] relative p-6 flex justify-between items-start">
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
              <div className="p-6 flex flex-col gap-6">

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
                        {booking.destination || "Indonesia"}
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
                    <p className="text-[#7b3306] text-[24px] font-extrabold leading-tight">{booking.total_pembayaran || "Rp 0"}</p>
                  </div>

                  {/* Status */}
                  <div className="flex items-center h-[36px] rounded-[10px] overflow-hidden shadow-sm border border-gray-100 mt-1">
                    <div className="w-[160px] bg-gray-50 h-full flex items-center px-4 text-[#364153] text-[12px] font-medium">
                      💳 Status Bayar
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] h-full flex items-center px-4 text-white font-bold text-[12px] uppercase">
                      {booking.status_bayar || "MENUNGGU PEMBAYARAN"}
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
                        {booking.email || "-"}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Invoice Footer */}
              <div className="bg-gradient-to-r from-[#1e2939] to-[#101828] h-[80px] relative flex flex-col items-center justify-center gap-1">
                <div className="w-[60px] h-[3px] bg-[#00bc7d] rounded-full absolute top-[12px]" />
                <p className="text-[#99a1af] text-[12px] font-semibold mt-3">
                  Dokumen dicetak pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[#6a7282] text-[10px]">
                  © 2025 PP Tour Travel. All rights reserved.
                </p>
              </div>

            </div>

          </div>

          {/* Footer - Hidden on Print */}
          <div className="print-hide bg-[#f9fafb] border-t border-[#e5e7eb] p-4 flex justify-end rounded-b-[20px] shrink-0">
            <Button
              onClick={onClose}
              className="h-[40px] rounded-[12px] bg-[#e5e7eb] text-[#364153] hover:bg-[#d1d5db] text-[13px] font-semibold px-6"
            >
              Tutup
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
