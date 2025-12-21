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
                  src="/images/landing/Logo_Transparent_White.png"
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
                href="https://www.instagram.com/tourtravel.pp/"
                target="_blank"
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
                <Link href="/#about-us" className="text-gray-400 hover:text-white transition-colors text-sm">
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
                  <div>Perumahan Citra Sari Regency SunFlowers Cluster F4 No. 3, Cerme, Gresik, Jawa Timur</div>
                </div>
              </li>
              <li>
                <a href="https://wa.me/6285664202185?text=Halo%20mimin%20PP%20Tour%20Travel%2C%20saya%20mau%20konsultasi%20nih" 
                target="_blank" 
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                  <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  +62 856-6420-2185
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
        </div>
      </div>
    </footer>
  );
}
