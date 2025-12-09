"use client";

import Image from "next/image";

export default function ServicesSection() {
  const services = [
    { title: "STUDY TOUR", image: "/images/landing/study-tour.jpg" },
    { title: "FAMILY GATHERING", image: "/images/landing/family-gathering.jpg" },
    { title: "OUTBOUND", image: "/images/landing/outbound.jpg" },
    { title: "COMPANY GATHERING", image: "/images/landing/company-gathering.jpg" },
    { title: "EVENT ORGANIZER", image: "/images/landing/event-organizer.jpg" },
    { title: "STUDY CAMPUS", image: "/images/landing/study-campus.jpg" },
    { title: "SEWA ELF, HIACE, BUS MEDIUM, BIGBUS", image: "/images/landing/sewa-bus.jpg" },
    { title: "RESERVASI HOTEL", image: "/images/landing/reservasi-hotel.jpg" }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Kami Menawarkan Layanan Terbaik
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <h3 className="text-white text-xl font-semibold text-center">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
