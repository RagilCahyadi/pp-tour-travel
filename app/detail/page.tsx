import { TicketCard } from "@/components/ui/custom/TicketCard"
import { OrderForm } from "@/components/ui/custom/OrderForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar"

// Mock data
const PACKAGE_DATA = {
  title: "Paket Ekonomis Bali",
  price: "Rp 1.100.000",
  minPax: 50,
  location: "Bali",
  duration: "3 Hari 1 Malam",
  images: ["/images/bali-1.jpg", "/images/bali-2.jpg", "/images/bali-3.jpg"]
}

export default function DetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <AuthenticatedNavbar />
      
      <main className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/paket-tour" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Kembali ke Katalog</span>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center lg:justify-items-stretch">
          {/* Left Column: Ticket Card */}
          <div className="w-full flex justify-center lg:justify-end">
            <TicketCard 
              title={PACKAGE_DATA.title}
              price={PACKAGE_DATA.price}
              minPax={PACKAGE_DATA.minPax}
              location={PACKAGE_DATA.location}
              duration={PACKAGE_DATA.duration}
              className="sticky top-24"
            />
          </div>

          {/* Right Column: Order Form */}
          <div className="w-full flex justify-center lg:justify-start">
            <OrderForm />
          </div>
        </div>
      </main>
    </div>
  )
}
