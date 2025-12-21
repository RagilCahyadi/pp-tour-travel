"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  MapPin, 
  Clock, 
  Tag, 
  Bus, 
  Ship, 
  Utensils, 
  Hotel, 
  Coffee, 
  Camera, 
  User, 
  Users, 
  Ticket, 
  Wallet, 
  Flag, 
  Gift, 
  Star,
  Phone,
  MessageCircle,
  Instagram,
  FileText,
  Download
} from "lucide-react"
import Image from "next/image"

interface TicketCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  price?: string
  minPax?: number
  location?: string
  duration?: string
  images?: string[]
}

export function TicketCard({
  className,
  title = "Paket Ekonomis Bali",
  price = "Rp 1.100.000",
  minPax = 50,
  location = "Bali",
  duration = "3 Hari 1 Malam",
  images = [],
  ...props
}: TicketCardProps) {
  return (
    <div 
      className={cn(
        "bg-white border border-muted rounded-3xl shadow-lg overflow-hidden w-full max-w-[592px] h-[815px] flex flex-col",
        className
      )}
      {...props}
    >
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col pb-8">
          {/* Header Image Section */}
          <div className="relative h-[288px] w-full shrink-0">
            <div className="absolute inset-0 bg-gray-200">
               {/* Placeholder for main image */}
               <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                 Main Image
               </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Badge */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-secondary to-[#fe9a00] px-6 py-2 rounded-full flex items-center gap-2 shadow-md">
              <Tag className="w-4 h-4 text-white" />
              <span className="text-sm text-white font-medium">PAKET EKONOMIS</span>
            </div>

            {/* Title & Info */}
            <div className="absolute bottom-6 left-6 flex flex-col gap-2">
              <h1 className="text-4xl font-bold text-white">{title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
                <div className="flex items-center gap-1 text-white/90">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{duration}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pt-8 flex flex-col gap-6">
            {/* Destinasi Wisata */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold text-foreground">Destinasi Wisata</h3>
              <div className="grid grid-cols-2 gap-3">
                {["Barong Dance", "Pantai Melasti", "Lovina Dolphin", "Bedugul", "Joger Bali", "Krisna Blangsinga"].map((item, i) => (
                  <div key={i} className="bg-accent rounded-lg p-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-3 gap-3 h-24">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden bg-gray-100 h-full">
                   <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                     Gallery {i}
                   </div>
                </div>
              ))}
            </div>

            {/* Fasilitas */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-semibold text-foreground">Fasilitas Didapat</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: Bus, text: "Transportasi Big Bus Pariwisata Terbaru" },
                  { icon: Ship, text: "Kapal Ferry (Ketapang - Gilimanuk PP)" },
                  { icon: Utensils, text: "Makan Prasmanan 5x" },
                  { icon: Hotel, text: "Hotel Bintang 3 ***" },
                  { icon: Coffee, text: "Snack Box 1x & Air Mineral" },
                  { icon: Camera, text: "Dokumentasi Premium" },
                  { icon: User, text: "Tour Leader" },
                  { icon: Users, text: "Tour Guide HPI Bali" },
                  { icon: Ticket, text: "Tiket Wisata & Retribusi" },
                  { icon: Wallet, text: "Biaya Tol, Parkir & Tips Crew" },
                  { icon: Flag, text: "Banner Kegiatan" },
                  { icon: Gift, text: "Doorprize Menarik" },
                  { icon: Star, text: "Bonus Spesial untuk Panitia" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary to-[#009966] rounded-2xl p-6 flex flex-col items-center justify-center text-white">
              <div className="flex items-baseline gap-1">
                <span className="text-lg">Harga: {price}</span>
                <span className="text-lg opacity-90">/ Pax (Min. {minPax} Pax)</span>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-muted/50 rounded-2xl p-6 flex flex-col gap-3">
              <h4 className="text-xl font-semibold text-foreground">Kontak & Alamat</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                  <span className="text-sm text-muted-foreground">Perumahan Citra Sari Regency SunFlowers Cluster F4 No. 3, Cerme, Gresik, Jawa Timur</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">0856-6420-2185</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">WhatsApp: 0856-6420-2185</span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">Instagram: @tourtravel.pp</span>
                </div>
              </div>
            </div>

            {/* Poster Download */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-foreground">Detail Paket Lengkap</h4>
                <div className="bg-white px-3 py-1 rounded-full shadow-sm flex items-center gap-2">
                  <FileText className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Poster Info</span>
                </div>
              </div>
              <p className="text-muted-foreground">Lihat informasi lengkap mengenai fasilitas, destinasi, harga dalam bentuk poster</p>
              
              <div className="relative h-[676px] w-full rounded-2xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gray-200">
                   {/* Placeholder for poster image */}
                   <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                     Poster Image
                   </div>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Download className="w-10 h-10 mb-4" />
                  <span className="text-lg font-medium">Klik tombol di bawah untuk download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
