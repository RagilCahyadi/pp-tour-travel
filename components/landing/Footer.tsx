"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 relative rounded-lg overflow-hidden">
                <Image
                  src="/images/landing/logo.png"
                  alt="Explore Travel Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-base font-medium">Explore Travel</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Wujudkan liburan impian Anda bersama kami. Kami menyediakan paket tour terbaik dengan harga terjangkau.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/paket-tour" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Paket Tour
                </Link>
              </li>
              <li>
                <Link href="/riwayat-pesanan" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Riwayat Pesanan
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Destinasi Populer</h3>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">Bali</li>
              <li className="text-gray-400 text-sm">Yogyakarta</li>
              <li className="text-gray-400 text-sm">Bandung</li>
              <li className="text-gray-400 text-sm">Lombok</li>
              <li className="text-gray-400 text-sm">Raja Ampat</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-400 text-sm">
                  <div>Jl. Gatot Subroto No. 123</div>
                  <div>Jakarta Selatan, 12950</div>
                </div>
              </li>
              <li>
                <a href="tel:+6281234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  +62 812-3456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@exploretravel.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  info@exploretravel.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 Explore Travel. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
