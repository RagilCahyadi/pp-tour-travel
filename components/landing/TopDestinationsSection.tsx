"use client";

import Image from "next/image";
import { Star, TrendingUp, Users, Package, Heart } from "lucide-react";

export default function TopDestinationsSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-xl mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🏆 Top 3 Destinasi Terfavorit
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Destinasi pilihan wisatawan yang paling banyak dikunjungi dan mendapat rating tertinggi
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Destination Card - Bali (Top 1) */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-80">
              <Image
                src="/images/landing/bali.jpg"
                alt="Bali"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              {/* Top Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <span className="text-2xl">🥇</span>
                <span className="font-bold text-sm">Top 1</span>
              </div>

              {/* Growth Badge */}
              <div className="absolute top-4 right-4 bg-[#00bc7d]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white font-medium text-sm">+28%</span>
              </div>

              {/* Destination Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-semibold text-white mb-2">Bali</h3>
                <p className="text-white/90 text-sm">
                  Pulau Dewata dengan pantai eksotis dan budaya yang memukau
                </p>
              </div>
            </div>

            {/* Destination Details */}
            <div className="p-6 space-y-4">
              {/* Highlights */}
              <div className="border-2 border-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">Highlight Destinasi</h4>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Uluwatu Temple & Sunset
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Pantai Nusa Dua
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Ubud Art Market
                  </li>
                  <li className="flex items-start gap-2 text-sm text-blue-700">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    Tanah Lot Temple
                  </li>
                </ul>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="text-center">
                  <Package className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-xs text-gray-500">Paket Tour</div>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">2.5K+</div>
                  <div className="text-xs text-gray-500">Wisatawan</div>
                </div>
                <div className="text-center">
                  <Star className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Story & Stats */}
          <div className="space-y-8">
            {/* Our Story */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cerita Kami</h3>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  Dengan pengalaman lebih dari 10 tahun, kami telah melayani ribuan pelanggan dari berbagai kalangan. Dari wisata keluarga, study tour sekolah, hingga corporate gathering, kami siap memberikan pengalaman terbaik untuk setiap momen spesial Anda.
                </p>
                <p className="leading-relaxed">
                  Tim profesional kami yang berpengalaman akan memastikan setiap detail perjalanan Anda berjalan sempurna, mulai dari perencanaan hingga Anda kembali dengan senyum dan cerita indah.
                </p>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="border-2 border-emerald-100 rounded-2xl p-6 space-y-4">
              <div className="flex gap-4">
                <div className="w-9 h-9 bg-[#00bc7d] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-900 mb-2">Visi Kami</h4>
                  <p className="text-emerald-700 leading-relaxed">
                    Menjadi travel agency terdepan dan terpercaya di Indonesia yang menghadirkan pengalaman perjalanan berkualitas untuk semua kalangan.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-9 h-9 bg-[#00bc7d] rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-900 mb-2">Misi Kami</h4>
                  <p className="text-emerald-700 leading-relaxed">
                    Memberikan pelayanan terbaik, harga kompetitif, dan pengalaman tak terlupakan untuk setiap perjalanan yang kami kelola.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10+</div>
                    <div className="text-xs text-gray-500">Tahun Berpengalaman</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-xs text-gray-500">Pelanggan Puas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#00bc7d] to-[#009966] rounded-3xl shadow-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-emerald-100 text-sm">Tahun Berpengalaman</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-emerald-100 text-sm">Pelanggan Puas</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-emerald-100 text-sm">Destinasi Tersedia</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-emerald-100 text-sm">Rating Kepuasan</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 text-center mb-12">
            Nilai-Nilai Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Terpercaya</h4>
              <p className="text-gray-600 leading-relaxed">
                Legalitas lengkap dan pengalaman 10+ tahun di industri travel
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Profesional</h4>
              <p className="text-gray-600 leading-relaxed">
                Tim berpengalaman siap membantu mewujudkan liburan impian Anda
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Pelayanan Terbaik</h4>
              <p className="text-gray-600 leading-relaxed">
                Kepuasan pelanggan adalah prioritas utama kami
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Harga Kompetitif</h4>
              <p className="text-gray-600 leading-relaxed">
                Paket tour berkualitas dengan harga yang terjangkau
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
