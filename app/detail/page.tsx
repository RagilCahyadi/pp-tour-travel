import { TicketCard } from "@/components/ui/custom/TicketCard"
import { OrderForm } from "@/components/ui/custom/OrderForm"
import { ArrowLeft, ChevronLeft } from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar"
import Footer from "@/components/landing/Footer"

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

      <main className="container mx-auto px-8 pt-16 pb-8 md:px-8 md:pt-22 md:pb-12">
        {/* Back Button */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 justify-items-center lg:justify-items-stretch">
          <div className="w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[592px]">
              <Link href="/paket-tour" className="flex items-center gap-2 text-[#4a5565] hover:text-[#00bc7d] mb-6 w-fit group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[16px] font-['Inter']">Kembali ke katalog</span>
              </Link>
            </div>
          </div>
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
      <Footer />
    </div>
  )
}
