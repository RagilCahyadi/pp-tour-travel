'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Users, Globe, Heart, Shield, Briefcase, Star, DollarSign } from 'lucide-react';

export default function AboutUsSection() {
  return (
    <section id="about-us" className="relative w-full py-12 pb-6 bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-100 rounded-full">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Tentang Kami</span>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Travel Agency
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-lg">
            Partner terpercaya untuk mewujudkan petualangan impian Anda sejak 2022
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Image Section */}
          <div className="relative">
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/landing/explore-travel.jpg"
                alt="Explore Travel Agency"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Experience Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl">
                    <Award className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3+ Tahun</p>
                    <p className="text-sm text-gray-600">Pengalaman Terbaik</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl" />
          </div>

          {/* Right: Content Section */}
          <div className="flex flex-col justify-center gap-8">
            {/* Our Story */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cerita Kami</h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Dengan pengalaman lebih dari 3 tahun, kami telah melayani ribuan pelanggan dari berbagai kalangan. Dari wisata keluarga, study tour sekolah, hingga corporate gathering, kami siap memberikan pengalaman terbaik untuk setiap momen spesial Anda.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Tim profesional kami yang berpengalaman akan memastikan setiap detail perjalanan Anda berjalan sempurna, mulai dari perencanaan hingga Anda kembali dengan senyum dan cerita indah.
                </p>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="border-2 border-emerald-200 rounded-2xl p-6 space-y-6">
              {/* Vision */}
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-lg shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-900 mb-2">Visi Kami</h4>
                  <p className="text-emerald-700 leading-relaxed">
                    Menjadi travel agency terdepan dan terpercaya di Indonesia yang menghadirkan pengalaman perjalanan berkualitas untuk semua kalangan.
                  </p>
                </div>
              </div>

              {/* Mission */}
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-9 h-9 bg-emerald-500 rounded-lg shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-emerald-900 mb-2">Misi Kami</h4>
                  <p className="text-emerald-700 leading-relaxed">
                    Memberikan pelayanan terbaik, harga kompetitif, dan pengalaman tak terlupakan untuk setiap perjalanan yang kami kelola.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">3+</p>
                    <p className="text-xs text-gray-600">Tahun Berpengalaman</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">500+</p>
                    <p className="text-xs text-gray-600">Pelanggan Puas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl shadow-2xl p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">3+</p>
              <p className="text-sm text-emerald-100">Tahun Berpengalaman</p>
            </div>

            {/* Stat 2 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-sm text-emerald-100">Pelanggan Puas</p>
            </div>

            {/* Stat 3 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">50+</p>
              <p className="text-sm text-emerald-100">Destinasi Tersedia</p>
            </div>

            {/* Stat 4 */}
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">98%</p>
              <p className="text-sm text-emerald-100">Rating Kepuasan</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <h3 className="text-2xl font-semibold text-gray-900 text-center">
            Nilai-Nilai Kami
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Value 1: Terpercaya */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-6">
                <Shield className="w-7 h-7 text-emerald-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Terpercaya</h4>
              <p className="text-gray-600 leading-relaxed">
                Legalitas lengkap dan pengalaman 10+ tahun di industri travel
              </p>
            </div>

            {/* Value 2: Profesional */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-6">
                <Briefcase className="w-7 h-7 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Profesional</h4>
              <p className="text-gray-600 leading-relaxed">
                Tim berpengalaman siap membantu mewujudkan liburan impian Anda
              </p>
            </div>

            {/* Value 3: Pelayanan Terbaik */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-purple-50 rounded-2xl mb-6">
                <Heart className="w-7 h-7 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Pelayanan Terbaik</h4>
              <p className="text-gray-600 leading-relaxed">
                Kepuasan pelanggan adalah prioritas utama kami
              </p>
            </div>

            {/* Value 4: Harga Kompetitif */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-6">
                <DollarSign className="w-7 h-7 text-amber-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Harga Kompetitif</h4>
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
