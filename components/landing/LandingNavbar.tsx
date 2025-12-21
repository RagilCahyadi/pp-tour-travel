"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';
import AuthenticatedNavbar from "@/components/ui/AuthenticatedNavbar";

export default function LandingNavbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  // If user is authenticated, show AuthenticatedNavbar
  if (isSignedIn) {
    return <AuthenticatedNavbar />;
  }

  // Otherwise, show the public navbar
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
            className={`relative text-sm pb-1 transition-colors duration-200
              ${pathname === '/' 
                ? 'font-semibold text-gray-900 after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[4px] after:rounded-full after:bg-[#00bc7d]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/paket-tour"
            className={`relative text-sm pb-1 transition-colors duration-200
              ${pathname.startsWith('/paket-tour')
                ? 'font-semibold text-gray-900 after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[4px] after:rounded-full after:bg-[#00bc7d]'
                : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            Paket Tour
          </Link>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => {
              const el = document.getElementById('about-us');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Tentang Kami
          </button>
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
