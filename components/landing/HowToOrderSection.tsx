"use client";

import { Search, FileText, CreditCard, Plane, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function HowToOrderSection() {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-12 h-12" />,
      title: "Pilih Paket Tour",
      description: "Jelajahi berbagai paket tour kami dan pilih destinasi yang sesuai dengan impian Anda",
      badgeColor: "bg-emerald-500",
      iconBg: "bg-emerald-100",
      glowColor: "bg-emerald-200/30"
    },
    {
      number: "02",
      icon: <FileText className="w-12 h-12" />,
      title: "Isi Form Pemesanan",
      description: "Lengkapi data diri dan informasi perjalanan dengan mudah melalui form online kami",
      badgeColor: "bg-blue-500",
      iconBg: "bg-blue-100",
      glowColor: "bg-blue-200/30"
    },
    {
      number: "03",
      icon: <CreditCard className="w-12 h-12" />,
      title: "Lakukan Pembayaran",
      description: "Transfer pembayaran dan upload bukti transfer langsung di website untuk verifikasi cepat",
      badgeColor: "bg-purple-500",
      iconBg: "bg-purple-100",
      glowColor: "bg-purple-200/30"
    },
    {
      number: "04",
      icon: <Plane className="w-12 h-12" />,
      title: "Siap Berangkat!",
      description: "Setelah pembayaran dikonfirmasi, Anda siap untuk memulai petualangan yang tak terlupakan",
      badgeColor: "bg-orange-500",
      iconBg: "bg-orange-100",
      glowColor: "bg-orange-200/30"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-emerald-100 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span className="text-emerald-700 text-sm font-medium">Mudah & Cepat</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Pemesanan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hanya 4 langkah mudah untuk memulai petualangan Anda bersama kami
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative mb-16">
          {/* Progress Line */}
          <div className="hidden md:block absolute top-[98px] left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-blue-200 via-purple-200 to-orange-200 z-0"></div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-gray-200">
                  {/* Step Number Badge */}
                  <div className={`absolute -top-4 -left-4 w-16 h-16 ${step.badgeColor} rounded-2xl shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <span className="text-white font-semibold text-lg">{step.number}</span>
                  </div>

                  {/* Icon with animated blur effects */}
                  <div className="mb-6 mt-4 relative flex justify-center">
                    {/* Outer blur - largest */}
                    <div className={`absolute w-[110px] h-[110px] ${step.glowColor} rounded-3xl blur-xl opacity-30 transition-all duration-500 group-hover:opacity-50`}></div>

                    {/* Middle blur */}
                    <div className={`absolute w-[105px] h-[105px] ${step.glowColor} rounded-3xl blur-md opacity-20 transition-all duration-500 group-hover:opacity-40`}></div>

                    {/* Icon Container */}
                    <div className={`relative w-24 h-24 ${step.iconBg} rounded-3xl shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                      <div className={`absolute inset-0 ${step.iconBg} rounded-3xl opacity-10`}></div>
                      <div className="relative text-gray-700">
                        {step.icon}
                      </div>
                    </div>

                    {/* Decorative dots */}
                    <div className={`absolute top-0 right-6 w-3 h-3 ${step.glowColor} rounded-full opacity-60 transition-all duration-300 group-hover:scale-125`}></div>
                    <div className={`absolute bottom-0 left-6 w-2 h-2 ${step.glowColor} rounded-full opacity-60 transition-all duration-300 group-hover:scale-125`}></div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed text-sm">
                    {step.description}
                  </p>

                  {/* Arrow indicator (except last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute -right-3 top-[180px] z-20 items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#00bc7d] to-[#009966] rounded-3xl shadow-2xl overflow-hidden">
          <div className="relative p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plane className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-3xl font-semibold text-white mb-4">
                Siap Memulai Petualangan?
              </h3>
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                Jangan tunda lagi! Pilih paket tour impian Anda dan buat kenangan tak terlupakan bersama kami
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/paket-tour">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#009966] text-lg rounded-2xl shadow-xl font-medium transition-all duration-300 hover:scale-105">
                    Lihat Paket Tour
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link
                  href="https://wa.me/6285664202185?text=Halo%20mimin%20PP%20Tour%20Travel%2C%20saya%20mau%20konsultasi%20nih"
                  target="_blank">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#007a55] hover:bg-[#006644] border-2 border-emerald-300 text-white text-lg rounded-2xl shadow-xl font-medium transition-all duration-300 hover:scale-105">
                    Hubungi Kami
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
