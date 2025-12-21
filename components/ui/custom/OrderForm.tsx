"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Send } from "lucide-react"

interface OrderFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function OrderForm({ className, ...props }: OrderFormProps) {
  return (
    <div 
      className={cn(
        "bg-white border border-muted rounded-3xl shadow-lg p-8 w-full max-w-[592px] flex flex-col gap-6",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-foreground">Atur Pesanan</h2>
        <p className="text-muted-foreground">Lengkapi data diri Anda untuk melakukan pemesanan</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5">
        {/* Nama Pemesan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground flex gap-1">
            Nama Pemesan <span className="text-destructive">*</span>
          </label>
          <Input 
            placeholder="Masukkan nama lengkap" 
            className="h-[50px] rounded-2xl border-input bg-transparent px-4 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Keberangkatan & Jumlah PAX */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground flex gap-1">
              Keberangkatan <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input 
                type="date"
                className="h-[50px] rounded-2xl border-input px-4 py-3 text-sm shadow-sm w-full"
              />
              {/* Custom icon overlay if needed, but native date picker has its own */}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground flex gap-1">
              Jumlah PAX <span className="text-destructive">*</span>
            </label>
            <Input 
              type="number" 
              defaultValue={50}
              className="h-[50px] rounded-2xl border-input bg-muted/50 px-4 py-3 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Instansi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">
            Instansi
          </label>
          <Input 
            placeholder="Nama instansi/perusahaan" 
            className="h-[50px] rounded-2xl border-input px-4 py-3 text-sm shadow-sm"
          />
        </div>

        {/* Email & WhatsApp */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground flex gap-1">
              Email <span className="text-destructive">*</span>
            </label>
            <Input 
              type="email"
              placeholder="email@domain.com" 
              className="h-[50px] rounded-2xl border-input px-4 py-3 text-sm shadow-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-foreground flex gap-1">
              WhatsApp <span className="text-destructive">*</span>
            </label>
            <Input 
              type="tel"
              placeholder="tambahkan nomor WA anda" 
              className="h-[50px] rounded-2xl border-input px-4 py-3 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Catatan Tambahan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground">
            Catatan Tambahan (Opsional)
          </label>
          <textarea 
            className="min-h-[98px] w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Tambahkan catatan khusus (opsional)"
          />
        </div>

        {/* Submit Button */}
        <Button 
          className="h-[60px] rounded-2xl bg-gradient-to-r from-primary to-[#009966] hover:from-primary/90 hover:to-[#009966]/90 text-white text-lg font-normal w-full shadow-none"
        >
          <Send className="mr-2 h-5 w-5" />
          Pesan Sekarang
        </Button>

        <p className="text-center text-muted-foreground text-sm">
          Dengan memesan, Anda menyetujui syarat dan ketentuan yang berlaku
        </p>
      </form>
    </div>
  )
}
