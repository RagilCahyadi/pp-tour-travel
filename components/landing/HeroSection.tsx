"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative h-[944px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/landing/hero-bg.jpg"
          alt="Travel Adventure"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-white text-base tracking-wider uppercase mb-4">
              Berwisata Dengan Nyaman dan Keamanan
            </p>
            <h1 className="text-white text-5xl font-bold leading-tight mb-8">
              Travel, nikmati dan jelajahi hidup yang baru
            </h1>
            <Link href="#paket-tour">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#00bc7d] to-[#009966] hover:from-[#00a870] hover:to-[#007a55] text-white px-8 h-14 text-base rounded-lg shadow-xl"
              >
                Jelajahi sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
