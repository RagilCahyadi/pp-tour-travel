"use client";

import { Search, FileText, CreditCard, Plane, CheckCircle2, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowToOrderSection() {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-12 h-12" />,
      title: "Pilih Paket Tour",
      description: "Jelajahi berbagai paket tour kami dan pilih destinasi yang sesuai dengan impian Anda"
    },
    {
      number: "02",
      icon: <FileText className="w-12 h-12" />,
      title: "Isi Form Pemesanan",
      description: "Lengkapi data diri dan informasi perjalanan dengan mudah melalui form online kami"
    },
    {
      number: "03",
      icon: <CreditCard className="w-12 h-12" />,
      title: "Lakukan Pembayaran",
      description: "Transfer pembayaran dan upload bukti transfer langsung di website untuk verifikasi cepat"
    },
    {
      number: "04",
      icon: <Plane className="w-12 h-12" />,
      title: "Siap Berangkat!",
      description: "Setelah pembayaran dikonfirmasi, Anda siap untuk memulai petualangan yang tak terlupakan"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-emerald-50 px-4 py-2 rounded-full mb-6">
            <span className="text-emerald-700 text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Mudah & Cepat
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Cara Pemesanan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hanya 4 langkah mudah untuk memulai petualangan Anda bersama kami
          </p>
        </div>

        {/* Progress Line */}
        <div className="relative mb-16">
          <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-purple-200 to-yellow-200"></div>
          
          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-6 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-lg p-8 h-full">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-r from-[#00bc7d] to-[#009966] rounded-2xl shadow-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">{step.number}</span>
                  </div>

                  {/* Icon with decorative elements */}
                  <div className="mb-6 mt-4 relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-emerald-100/30 to-emerald-50/30 rounded-3xl blur-md"></div>
                    <div className="relative w-24 h-24 mx-auto bg-white rounded-3xl shadow-xl flex items-center justify-center text-emerald-600">
                      {step.icon}
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute -top-2 -right-2 w-3 h-3 bg-emerald-400/60 rounded-full"></div>
                    <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-300/60 rounded-full"></div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow indicator (except last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
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

              <div className="flex items-center justify-center gap-4">
                <Link href="/paket-tour">
                  <Button
                    size="lg"
                    className="bg-white hover:bg-gray-50 text-[#009966] px-8 h-16 text-lg rounded-2xl shadow-xl font-medium"
                  >
                    Lihat Paket Tour
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-[#007a55] hover:bg-[#006644] border-2 border-emerald-300 text-white px-8 h-16 text-lg rounded-2xl shadow-xl font-medium"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
