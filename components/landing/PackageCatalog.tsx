"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Clock, ArrowRight, ChevronDown, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

// Image Constants from Figma
const imgImagePaketPremiumBali = "https://www.figma.com/api/mcp/asset/2c1ac9c2-23d7-4a0e-96ca-09458a25f8ef";
const imgImagePaketEkonomisBali = "https://www.figma.com/api/mcp/asset/f9da0e00-4754-48f1-8ac1-3f22b59151ce";
const imgImagePaketPremiumYogyakarta = "https://www.figma.com/api/mcp/asset/ef1b1bfc-3db2-4473-af02-172b9fbe1634";
const imgImagePaketEkonomisYogyakarta = "https://www.figma.com/api/mcp/asset/42e929e0-ac1d-4869-9845-cf90d0a8c629";
const imgImagePaketPremiumMalangBatu = "https://www.figma.com/api/mcp/asset/3e5f4e0d-7a0c-4bd2-a122-e7292a71f74c";
const imgImagePaketEkonomisMalangBatu = "https://www.figma.com/api/mcp/asset/92d98b52-7dd8-4789-b7ae-8539fd10ced0";
const imgImagePaketPremiumSemarang = "https://www.figma.com/api/mcp/asset/6fb254f5-fb87-4dfb-a105-2811bc848f2b";
const imgImagePaketEkonomisSemarang = "https://www.figma.com/api/mcp/asset/6a87aefc-a213-4975-97f3-527686b66c06";
const imgImagePaketPremiumBandung = "https://www.figma.com/api/mcp/asset/bc5d623e-ff04-4c68-8203-0f292247a83b";
const imgImagePaketEkonomisBandung = "https://www.figma.com/api/mcp/asset/e2eb8239-7ebf-4c49-b687-e1cf5b3e5b24";

interface TourPackage {
  id: string;
  nama_paket: string;
  lokasi: string;
  durasi: string;
  tipe_paket: "Premium" | "Ekonomis";
  harga: number;
  gambar_url: string | null;
  nama_daerah: string | null;
  deskripsi: string | null;
  is_active: boolean;
}

const ITEMS_PER_PAGE = 9;

export default function PackageCatalog() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch packages from Supabase
  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tour_packages')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPackages(data || []);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = [...packages];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((pkg) =>
        pkg.nama_paket.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pkg.nama_daerah && pkg.nama_daerah.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Destination filter
    if (selectedDestination) {
      filtered = filtered.filter((pkg) =>
        pkg.lokasi.toLowerCase().includes(selectedDestination.toLowerCase())
      );
    }

    // Duration filter
    if (selectedDuration) {
      filtered = filtered.filter((pkg) =>
        pkg.durasi.includes(selectedDuration)
      );
    }

    // Price sorting
    if (selectedPrice === "low") {
      filtered.sort((a, b) => a.harga - b.harga);
    } else if (selectedPrice === "high") {
      filtered.sort((a, b) => b.harga - a.harga);
    }

    return filtered;
  }, [packages, searchQuery, selectedDestination, selectedDuration, selectedPrice]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDestination, selectedDuration, selectedPrice]);

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      {/* Hero Section */}
      <div 
        className="w-full h-[216px] pt-[75px] px-4 md:px-[193.5px] flex flex-col items-start justify-center relative"
        style={{ 
          backgroundImage: "linear-gradient(171.87deg, #009966 0%, #007A55 100%)" 
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-white text-[40px] font-bold leading-[48px] mb-4">
            Katalog Paket Tour
          </h1>
          <p className="text-[#d0fae5] text-[16px] leading-[25.6px]">
            Temukan paket tour impian Anda dari berbagai destinasi menarik di Indonesia
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-8 mt-8 relative z-10">
        <div className="bg-white rounded-[16px] shadow-sm p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-[457px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <Input 
                placeholder="Cari paket atau destinasi..." 
                className="pl-10 h-[50px] border-[#d1d5dc] rounded-[10px] text-[16px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dropdowns */}
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="relative min-w-[200px]">
                <select 
                  className="w-full h-[50px] px-4 border border-[#d1d5dc] rounded-[10px] appearance-none bg-white text-[#4a5565] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009966]"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">Semua Destinasi</option>
                  <option value="bali">Bali</option>
                  <option value="yogyakarta">Yogyakarta</option>
                  <option value="malang">Malang</option>
                  <option value="semarang">Semarang</option>
                  <option value="bandung">Bandung</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative min-w-[200px]">
                <select 
                  className="w-full h-[50px] px-4 border border-[#d1d5dc] rounded-[10px] appearance-none bg-white text-[#4a5565] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009966]"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="">Semua Durasi</option>
                  <option value="1">1 Hari</option>
                  <option value="2">2 Hari</option>
                  <option value="3">3 Hari</option>
                  <option value="4">4 Hari</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative min-w-[200px]">
                <select 
                  className="w-full h-[50px] px-4 border border-[#d1d5dc] rounded-[10px] appearance-none bg-white text-[#4a5565] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009966]"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                >
                  <option value="">Semua Harga</option>
                  <option value="low">Termurah</option>
                  <option value="high">Termahal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-2 text-[#4a5565] text-sm">
            <Filter className="w-4 h-4" />
            <span>Menampilkan {filteredPackages.length} dari {packages.length} paket</span>
          </div>
        </div>
      </div>

      {/* Package Grid */}
      <div className="max-w-7xl mx-auto px-8 mt-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009966]"></div>
              <p className="mt-4 text-gray-600">Memuat paket tour...</p>
            </div>
          </div>
        ) : currentPackages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">Tidak ada paket tour yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPackages.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden rounded-[16px] border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full">
                {/* Image Section */}
                <div className="relative h-[256px] w-full shrink-0">
                  <Image
                    src={pkg.gambar_url || imgImagePaketPremiumBali}
                    alt={pkg.nama_paket}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border backdrop-blur-sm ${
                    pkg.tipe_paket === 'Premium' 
                      ? 'bg-[#fe9a00]/20 border-[#ffb900]/30 text-[#fef3c6]' 
                      : 'bg-[#00bc7d]/20 border-[#00d492]/30 text-[#d0fae5]'
                  }`}>
                    <span className="text-xs font-normal">{pkg.tipe_paket}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-[24px] font-semibold text-[#101828] mb-4 leading-tight">
                    {pkg.nama_paket}
                  </h3>

                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex items-center gap-2 text-[#4a5565]">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{pkg.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#4a5565]">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="text-sm">{pkg.durasi}</span>
                    </div>
                  </div>

                  {/* Description snippet if available */}
                  {pkg.deskripsi && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pkg.deskripsi}</p>
                  )}

                  {/* Footer: Price and Button */}
                  <div className="mt-auto pt-4 border-t border-[#e5e7eb] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[#6a7282] text-xs">Mulai dari</span>
                      <span className="text-[#009966] text-[16px] font-medium">
                        Rp {pkg.harga.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Link href={`/paket-tour/${pkg.id}`}>
                      <Button 
                        className="bg-gradient-to-r from-[#00bc7d] to-[#009966] hover:from-[#00a870] hover:to-[#008a5c] text-white rounded-[10px] px-4 py-2 h-[40px] flex items-center gap-2"
                      >
                        Lihat Detail
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredPackages.length > ITEMS_PER_PAGE && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 w-10 ${
                    currentPage === page 
                      ? 'bg-gradient-to-r from-[#00bc7d] to-[#009966] text-white hover:from-[#00a870] hover:to-[#008a5c]' 
                      : ''
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
