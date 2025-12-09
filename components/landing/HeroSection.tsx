"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, Users, Star, Plane, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[944px] w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <Image
          src="/images/landing/hero-bg.jpg"
          alt="Travel Adventure"
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/70 to-gray-900/40"></div>
      
      {/* Decorative Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[20%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>



      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <p className="text-white text-sm tracking-wide">
                Berwisata Dengan Nyaman dan Aman
              </p>
            </div>

            {/* Main Title */}
            <h1 
              className={`text-white text-5xl md:text-6xl font-bold leading-tight mb-6 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Travel, nikmati dan{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-blue-400 bg-clip-text text-transparent">
                jelajahi hidup yang baru
              </span>
            </h1>

            {/* Subtitle */}
            <p 
              className={`text-white/80 text-lg mb-8 max-w-xl transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Wujudkan impian liburan Anda bersama kami. Paket lengkap, harga terjangkau, pengalaman tak terlupakan.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`flex flex-wrap gap-4 mb-12 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Link href="#paket-tour">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-[#00bc7d] to-[#009966] hover:from-[#00a870] hover:to-[#007a55] text-white px-8 h-14 text-base rounded-xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Jelajahi Sekarang
                    <Plane className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link href="#about-us">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 h-14 text-base rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>

            {/* Stats Counter */}
            <div 
              className={`flex gap-8 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg blur group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">Pelanggan Puas</div>
                </div>
              </div>
              
              <div className="w-px bg-white/20"></div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/70">Destinasi Wisata</div>
                </div>
              </div>
              
              <div className="w-px bg-white/20"></div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg blur group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-3">
                  <div className="text-3xl font-bold text-white">4.9★</div>
                  <div className="text-sm text-white/70">Rating Tertinggi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <span className="text-white text-xs tracking-wider uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </div>
    </section>
  );
}
