"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 relative rounded-lg overflow-hidden">
            <Image
              src="/images/landing/logo.png"
              alt="PP Tour Travel Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-xl font-semibold text-gray-900">
            PP Tour Travel
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-900 border-b-2 border-[#00bc7d] pb-1"
          >
            Beranda
          </Link>
          <Link
            href="/paket-tour"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Paket Tour
          </Link>
          <Link
            href="/riwayat-pesanan"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Riwayat Pesanan
          </Link>
          <Link
            href="/tentang-kami"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Tentang Kami
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-[#009966] px-4">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-[#009966] hover:bg-[#007a55] text-white px-5 rounded-lg shadow-md">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
