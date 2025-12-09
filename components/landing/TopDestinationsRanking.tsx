'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTopDestinations } from '@/lib/hooks/useTopDestinations';
import { TrendingUp, Users, Star, ChevronRight, Award, MapPin, CheckCircle } from 'lucide-react';

export default function TopDestinationsRanking() {
  const { destinations, loading, error } = useTopDestinations();

  if (loading) {
    return (
      <section className="relative w-full py-12 px-8 bg-gradient-to-br from-emerald-50/30 via-white to-yellow-50/30">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg mb-4 animate-pulse">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
              🏆 Top 3 Destinasi Terfavorit
            </h2>
            <p className="text-gray-600 text-base">
              Destinasi pilihan wisatawan yang paling banyak dikunjungi dan mendapat rating tertinggi
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-xl h-96 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || destinations.length === 0) {
    return null;
  }

  const [mainDestination, ...otherDestinations] = destinations;

  return (
    <section className="relative w-full py-12 px-8 overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-yellow-50/30">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-3xl" />

      <div className="relative max-w-[1280px] mx-auto">
        {/* Header with decorative elements */}
        <div className="text-center mb-10 relative">
          {/* Decorative stars */}
          <div className="absolute -top-4 left-1/4 text-yellow-400 text-2xl animate-bounce">⭐</div>
          <div className="absolute -top-2 right-1/4 text-yellow-400 text-xl animate-bounce delay-150">✨</div>
          
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg mb-4 animate-pulse">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-2">
            🏆 Top 3 Destinasi Terfavorit
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto mb-4">
            Destinasi pilihan wisatawan yang paling banyak dikunjungi dan mendapat rating tertinggi
          </p>
          
          {/* Stats badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-emerald-100">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-gray-700">3000+ Wisatawan</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-yellow-100">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-700">Rating 4.8+</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-blue-100">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">Trending 2025</span>
            </div>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Main Destination (Rank 1) - Large Card */}
          {mainDestination && (
            <div className="lg:row-span-2">
              <DestinationCard destination={mainDestination} isMain />
            </div>
          )}

          {/* Other Destinations (Rank 2 & 3) - Smaller Cards */}
          {otherDestinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-8 relative">
          {/* Background card */}
          <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">
                  🌏 Lebih Dari 50+ Destinasi Menunggu Anda!
                </h3>
                <p className="text-white/90 text-sm">
                  Jelajahi destinasi wisata lainnya di seluruh Indonesia dengan paket tour terbaik dan harga kompetitif
                </p>
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group font-semibold"
              >
                <span>Jelajahi Semua Destinasi</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-3 -right-3 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface DestinationCardProps {
  destination: any;
  isMain?: boolean;
}

function DestinationCard({ destination, isMain = false }: DestinationCardProps) {
  const imageHeight = isMain ? 'h-64' : 'h-48';
  const cardHeight = isMain ? 'h-full' : 'h-auto';

  return (
    <div className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ${cardHeight} group`}>
      {/* Image Section */}
      <div className={`relative ${imageHeight} overflow-hidden`}>
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Animated sparkles for main destination */}
        {isMain && (
          <>
            <div className="absolute top-8 left-20 text-yellow-400 text-lg animate-pulse">✨</div>
            <div className="absolute top-16 right-24 text-yellow-400 text-sm animate-bounce">⭐</div>
          </>
        )}

        {/* Rank Badge with animation */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg hover:scale-110 transition-transform">
          <span className="text-2xl animate-bounce">{destination.rankEmoji}</span>
          <span className="text-sm font-bold text-gray-900">{destination.rankLabel}</span>
        </div>

        {/* Growth Badge with pulse effect */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg animate-pulse">
          <TrendingUp className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">+{destination.growthPercentage}%</span>
        </div>

        {/* Destination Name & Description */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-semibold text-white mb-1">{destination.name}</h3>
          <p className="text-white/90 text-sm">{destination.description}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Highlights - Always show for main destination (Bali) */}
        {isMain && (
          <div className="border-2 border-[#bedbff] rounded-2xl p-4 bg-[#eef6ff]">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#1c398e]" />
              <span className="text-[#1c398e] font-medium">Highlight Destinasi</span>
            </div>
            <div className="space-y-2">
              {destination.highlights && destination.highlights.length > 0 ? (
                destination.highlights.slice(0, 4).map((highlight: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#193cb8] shrink-0" />
                    <span className="text-sm text-[#193cb8]">{highlight}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#193cb8] shrink-0" />
                    <span className="text-sm text-[#193cb8]">Uluwatu Temple & Sunset</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#193cb8] shrink-0" />
                    <span className="text-sm text-[#193cb8]">Pantai Nusa Dua</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#193cb8] shrink-0" />
                    <span className="text-sm text-[#193cb8]">Ubud Rice Terrace</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#193cb8] shrink-0" />
                    <span className="text-sm text-[#193cb8]">Tanah Lot Temple</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Highlights for other destinations */}
        {!isMain && destination.highlights && destination.highlights.length > 0 && (
          <div className="border-2 border-blue-100 rounded-xl p-3 bg-blue-50/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900 font-medium text-sm">Highlight Destinasi</span>
            </div>
            <div className="space-y-1.5">
              {destination.highlights.slice(0, 3).map((highlight: string, index: number) => (
                <div key={index} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="text-xs text-blue-900">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Badge (only for rank 1) */}
        {destination.isTrending && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-lg">
            <span className="text-white text-sm font-medium">🔥 Trending #1</span>
            <span className="text-white text-sm">🔥</span>
          </div>
        )}
        
        {/* Popular Choice Badge for rank 2 & 3 */}
        {!destination.isTrending && destination.rank === 2 && (
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-lg">
            <span className="text-white text-sm font-medium">⚡ Pilihan Populer</span>
          </div>
        )}
        
        {!destination.isTrending && destination.rank === 3 && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-2.5 flex items-center justify-center gap-2 shadow-lg">
            <span className="text-white text-sm font-medium">🌟 Best Value</span>
          </div>
        )}

        {/* Stats - Enhanced with background */}
        <div className="grid grid-cols-2 gap-3">
          {/* Visitors */}
          <div className="flex items-center gap-2 pl-2 pr-2 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold text-emerald-700">
                {destination.totalVisitors.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600">Wisatawan</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 pl-2 pr-2 py-2 bg-orange-50 rounded-xl border border-orange-100">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <p className="text-xl font-semibold text-orange-700">{destination.rating}</p>
              <p className="text-xs text-orange-600">Rating</p>
            </div>
          </div>
        </div>
        
        {/* Additional info for main destination */}
        {isMain && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-3 border border-amber-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600 font-medium">💰 Mulai dari</span>
                <span className="text-amber-700 font-bold">Rp 2.5jt</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-600 font-medium">⏱️</span>
                <span className="text-amber-700 font-semibold">3H 2M</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link
          href={`/paket-tour?lokasi=${encodeURIComponent(destination.name)}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
        >
          <span>Lihat Paket {destination.name}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
