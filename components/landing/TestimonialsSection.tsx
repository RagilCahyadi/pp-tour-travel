"use client";

import Image from "next/image";
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Andi Pratama",
      role: "Ketua RT 05",
      date: "Juni 2024",
      rating: 5,
      package: "Paket Semarang Premium",
      content: "Wisata warga RT sangat meriah! Semua peserta puas dengan pelayanan dan destinasi yang ditawarkan. Terima kasih sudah membuat acara kami berkesan!",
      image: "/images/landing/andi-pratama.jpg"
    },
    {
      name: "Siti Nurhaliza",
      role: "Guru SD Negeri 1 Jakarta",
      date: "November 2024",
      rating: 5,
      package: "Paket Bali Premium",
      content: "Pengalaman yang luar biasa! Study tour untuk siswa-siswi kami berjalan sangat lancar. Tour guide sangat profesional dan ramah. Pasti akan booking lagi tahun depan!",
      image: "/images/landing/siti-nurhaliza.jpg",
      featured: true
    },
    {
      name: "Budi Santoso",
      role: "HR Manager PT Maju Jaya",
      date: "Oktober 2024",
      rating: 5,
      package: "Paket Bandung Premium",
      content: "Company gathering kami sangat sukses berkat Explore Travel. Semua detail diurus dengan sempurna, dari akomodasi hingga aktivitas. Highly recommended!",
      image: "/images/landing/budi-santoso.jpg"
    }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-full mb-6">
            <span className="text-emerald-700 text-sm font-medium flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Testimoni
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kata Mereka Tentang Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah kebanggaan kami. Lihat apa kata mereka yang sudah merasakan pengalaman bersama Explore Travel
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white border-2 border-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all ${
                  testimonial.featured ? "md:scale-105 border-emerald-200" : ""
                }`}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#00bc7d] to-[#009966] rounded-2xl shadow-lg flex items-center justify-center">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                <div className="p-8">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 italic leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>

                  {/* Package Badge */}
                  <div className="inline-block bg-emerald-50 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3" />
                      {testimonial.package}
                    </span>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="relative w-14 h-14 rounded-full border-2 border-emerald-200 overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-400">{testimonial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-8 h-2 rounded-full bg-[#009966]"></div>
          </div>

          {/* Navigation Buttons */}
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-13 h-13 bg-white border-2 border-emerald-200 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
            <ChevronLeft className="w-6 h-6 text-emerald-600" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-13 h-13 bg-white border-2 border-emerald-200 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-emerald-600" />
          </button>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-[#00bc7d] to-[#009966] rounded-3xl shadow-2xl p-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">4.9</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-white text-white" />
                ))}
              </div>
              <div className="text-emerald-100 text-sm">Rating Keseluruhan</div>
            </div>

            <div className="border-l border-r border-emerald-400/30">
              <div className="text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-emerald-100 text-sm">Pelanggan Puas</div>
            </div>

            <div>
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-emerald-100 text-sm">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
