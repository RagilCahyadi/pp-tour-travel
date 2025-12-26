"use client"

import { TicketCard } from "@/components/ui/custom/TicketCard"
import { OrderForm } from "@/components/ui/custom/OrderForm"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar"
import Footer from "@/components/landing/Footer"
import { formatRupiah } from "@/lib/utils/helpers"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function DetailPage() {
    const params = useParams()
    const packageId = params.id as string
    const [selectedPackage, setSelectedPackage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchPackageDetail() {
            try {
                setLoading(true)
                setError(false)

                const { data, error: fetchError } = await supabase
                    .from('tour_packages')
                    .select(`
            *,
            package_destinations (*),
            package_facilities (*),
            package_gallery (*)
          `)
                    .eq('id', packageId)
                    .eq('is_active', true)
                    .single()

                if (fetchError) throw fetchError

                setSelectedPackage(data)
            } catch (err) {
                console.error('Error fetching package:', err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        if (packageId) {
            fetchPackageDetail()
        }
    }, [packageId])

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error || !selectedPackage) {
        return (
            <div className="min-h-screen bg-white">
                <AuthenticatedNavbar />
                <div className="container mx-auto px-8 pt-32 pb-12 flex flex-col items-center justify-center text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Paket tidak ditemukan</h2>
                    <Link href="/paket-tour" className="text-primary hover:underline">Kembali ke Katalog</Link>
                </div>
                <Footer />
            </div>
        )
    }

    // Map package data to TicketCard props
    const destinations = selectedPackage.package_destinations?.map((d: any) => d.nama_destinasi) || []
    const facilities = selectedPackage.package_facilities?.map((f: any) => ({ name: f.nama_fasilitas, icon: f.icon_name })) || []
    const gallery = selectedPackage.package_gallery?.sort((a: any, b: any) => a.urutan - b.urutan).map((g: any) => g.image_url) || []

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
                            title={selectedPackage.nama_paket}
                            price={formatRupiah(selectedPackage.harga)}
                            minPax={selectedPackage.minimal_penumpang}
                            location={selectedPackage.lokasi || selectedPackage.nama_daerah || 'Indonesia'}
                            duration={selectedPackage.durasi}
                            className="sticky top-24"
                            // Dynamic Props
                            destinations={destinations}
                            facilities={facilities}
                            gallery={gallery}
                            poster={selectedPackage.poster_url}
                            mainImage={selectedPackage.gambar_url}
                        />
                    </div>

                    {/* Right Column: Order Form */}
                    <div className="w-full flex justify-center lg:justify-start">
                        <OrderForm
                            basePrice={selectedPackage.harga}
                            minPax={selectedPackage.minimal_penumpang}
                            packageId={packageId}
                            packageName={selectedPackage.nama_paket}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
