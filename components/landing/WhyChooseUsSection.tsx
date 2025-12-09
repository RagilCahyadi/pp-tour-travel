"use client";

import { DollarSign, Users, Shield, Calendar, Headphones, Award, Building2, User, Heart, Briefcase } from "lucide-react";

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Harga Terbaik",
      description: "Paket tour berkualitas dengan harga kompetitif dan transparan tanpa biaya tersembunyi"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Guide Profesional",
      description: "Tour guide berpengalaman dan ramah yang siap menemani perjalanan Anda"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Aman & Terpercaya",
      description: "Legalitas lengkap dan asuransi perjalanan untuk keamanan maksimal"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Fleksibel",
      description: "Jadwal keberangkatan yang fleksibel dan dapat disesuaikan dengan kebutuhan"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Support 24/7",
      description: "Customer service siap membantu Anda kapan saja sebelum, saat, dan setelah perjalanan"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Berpengalaman",
      description: "10+ tahun melayani ribuan pelanggan dengan kepuasan 98%"
    }
  ];

  const trustedBy = [
    { icon: <Building2 className="w-10 h-10 text-emerald-600" />, label: "Sekolah & Universitas" },
    { icon: <Briefcase className="w-10 h-10 text-emerald-600" />, label: "Perusahaan" },
    { icon: <Heart className="w-10 h-10 text-emerald-600" />, label: "Keluarga" },
    { icon: <Users className="w-10 h-10 text-emerald-600" />, label: "Komunitas" }
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 rounded-full mb-6">
            <span className="text-emerald-700 text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Keunggulan Kami
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih Explore Travel?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kepercayaan ribuan pelanggan adalah bukti komitmen kami untuk memberikan pelayanan terbaik
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trusted By Section */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-xl p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Dipercaya Oleh
            </h3>
            <p className="text-gray-600">
              Berbagai institusi dan perusahaan telah mempercayai layanan kami
            </p>
          </div>

          <div className="grid grid-cols-4 gap-8">
            {trustedBy.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-gray-600 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
