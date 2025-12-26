"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, Send } from "lucide-react"

interface OrderFormProps extends React.HTMLAttributes<HTMLDivElement> {
  basePrice?: number
  minPax?: number
}

export function OrderForm({
  className,
  basePrice = 1100000,
  minPax = 50,
  ...props
}: OrderFormProps) {
  const [pax, setPax] = React.useState(minPax)
  const [formData, setFormData] = React.useState({
    name: "",
    date: "",
    email: "",
    whatsapp: ""
  })

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handlePaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val)) {
      setPax(val)
    } else {
      setPax(0)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }



  const totalPrice = pax * basePrice
  // Calculate min date (today + 3 days)
  const today = new Date()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 3)
  const minDateStr = minDate.toISOString().split('T')[0]

  // Check if all required fields are filled
  const isFormValid = formData.name && formData.date && formData.email && formData.whatsapp && pax >= minPax

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
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={minDateStr}
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
              value={pax || ''}
              onChange={handlePaxChange}
              className={cn(
                "h-[50px] rounded-2xl border-input bg-muted/50 px-4 py-3 text-sm shadow-sm",
                pax < minPax && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {pax < minPax && (
              <span className="text-xs text-destructive">
                Minimal pemesanan {minPax} pax
              </span>
            )}
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
              name="email"
              value={formData.email}
              onChange={handleInputChange}
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
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
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

        {/* Total Price Display */}
        <div className="flex flex-col gap-2 p-4 bg-muted/30 rounded-2xl border border-muted">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Total Estimasi</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
          </div>
          <p className="text-xs text-muted-foreground text-right italic">
            *Harga dapat berubah sewaktu-waktu
          </p>
        </div>

        {/* Submit Button */}
        <Button
          disabled={!isFormValid}
          className="h-[60px] rounded-2xl bg-gradient-to-r from-primary to-[#009966] hover:from-primary/90 hover:to-[#009966]/90 text-white text-lg font-normal w-full shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
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
