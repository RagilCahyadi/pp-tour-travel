"use client";

import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export default function DeleteBookingDialog({ isOpen, onClose, onConfirm, count }: DeleteBookingDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[500px] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fb2c36] to-[#e7000b] h-[74px] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-[10px] w-10 h-10 flex items-center justify-center">
              <Trash2 className="text-white w-6 h-6" />
            </div>
            <h2 className="text-white text-[24px] font-bold leading-tight">Konfirmasi Hapus</h2>
          </div>
          <button 
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 transition-colors rounded-[10px] w-9 h-9 flex items-center justify-center"
          >
            <X className="text-white w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-[#fef2f2] border-2 border-[#ffc9c9] rounded-[16.4px] p-[18px] flex gap-4">
            <div className="shrink-0">
              <AlertTriangle className="w-5 h-5 text-[#ef4444]" />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[#82181a] text-[16px]">
                Anda akan menghapus <span className="font-bold">{count}</span> pesanan yang dipilih.
              </p>
              <p className="text-[#c10007] text-[16px]">
                Tindakan ini tidak dapat dibatalkan. Data pesanan akan dihapus secara permanen.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#f9fafb] border-t border-[#e5e7eb] p-4 px-6 flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-[40px] rounded-[16.4px] bg-[#e5e7eb] text-[#364153] hover:bg-[#d1d5db] text-[14px] font-semibold px-6"
          >
            Batal
          </Button>
          <Button 
            onClick={onConfirm}
            className="h-[40px] rounded-[16.4px] bg-gradient-to-r from-[#fb2c36] to-[#e7000b] text-white hover:opacity-90 text-[14px] font-semibold px-6"
          >
            Ya, Hapus Pesanan
          </Button>
        </div>

      </div>
    </div>
  );
}
