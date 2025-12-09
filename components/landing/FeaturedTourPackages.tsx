'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, MapPin, Sparkles, ChevronRight, TrendingUp } from 'lucide-react';
import { useFeaturedTourPackages } from '@/lib/hooks/useFeaturedTourPackages';
import { FeaturedTourPackage } from '@/lib/types/tour-packages';

export default function FeaturedTourPackages() {
  const { packages, loading } = useFeaturedTourPackages();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <section className="relative w-full py-12 overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl top-0 left-1/4" />
        <div className="absolute w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl bottom-0 right-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-gradient-to-r from-emerald-100 to-yellow-100 rounded-full">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Paket Terpopuler</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ✨ Paket Tour Unggulan
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg">
            Pilihan favorit wisatawan dengan destinasi terbaik dan fasilitas premium
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/paket"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span className="text-lg">Lihat Semua Paket Tour</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface PackageCardProps {
  package: FeaturedTourPackage;
}

function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] group">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={pkg.gambar_url || '/images/landing/paket-bali.jpg'}
          alt={pkg.nama_paket}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {pkg.isTerlaris && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg shadow-lg">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-xs font-medium text-white uppercase">Terlaris</span>
            </div>
          )}
          <div className="px-3 py-1.5 bg-orange-500 rounded-lg shadow-lg">
            <span className="text-xs font-medium text-white uppercase">Premium</span>
          </div>
        </div>

        {/* Location Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-2xl">
          <MapPin className="w-4 h-4 text-gray-900" />
          <span className="font-medium text-gray-900">{pkg.lokasi}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          {pkg.nama_paket}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{pkg.durasi}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>Min {pkg.minimal_penumpang} PAX</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-6 space-y-2">
          {pkg.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-sm text-gray-600">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="pt-6 border-t border-gray-100">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Mulai dari</p>
            <p className="text-2xl font-bold text-emerald-600">
              Rp {pkg.harga.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-gray-500">per orang</p>
          </div>

          <Link
            href={`/paket/${pkg.id}`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-2xl hover:shadow-lg transition-all duration-300 group"
          >
            <span>Lihat Detail</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <section className="relative w-full py-12">
      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="inline-block h-8 w-40 bg-gradient-to-r from-emerald-100 to-yellow-100 rounded-full mb-6 animate-pulse" />
          <div className="h-10 w-96 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-[600px] bg-gray-100 rounded-lg mx-auto animate-pulse" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 shadow-lg">
              <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex gap-4">
                  <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-full bg-gray-100 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="pt-6">
                  <div className="h-16 bg-gray-200 rounded-lg mb-4 animate-pulse" />
                  <div className="h-12 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-2xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="flex justify-center">
          <div className="h-14 w-64 bg-gradient-to-r from-emerald-200 to-emerald-300 rounded-2xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}
