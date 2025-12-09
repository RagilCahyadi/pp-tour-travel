"use client";

import Image from "next/image";

export default function MomentsSection() {
  const moments = [
    { image: "/images/landing/moment-1.jpg", alt: "Moment 1" },
    { image: "/images/landing/moment-2.jpg", alt: "Moment 2" },
    { image: "/images/landing/moment-3.jpg", alt: "Moment 3" },
    { image: "/images/landing/moment-4.jpg", alt: "Moment 4" }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Momen-Momen Yang Diabadikan Oleh Peserta Kami
          </h2>
        </div>

        {/* Moments Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {moments.map((moment, index) => (
            <div
              key={index}
              className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <Image
                src={moment.image}
                alt={moment.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
