'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const imgLogo = "/Logo_Transparent_White.png"

interface AdminSidebarProps {
  activePage: 'dashboard' | 'paket' | 'pemesanan' | 'pembayaran' | 'penjadwalan' | 'pengaturan'
}

export default function AdminSidebar({ activePage }: AdminSidebarProps) {
  const router = useRouter()
  const { signOut } = useClerk()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const navItems = [
    {
      id: 'dashboard',
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    },
    {
      id: 'paket',
      href: '/admin/paket',
      label: 'Paket',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      )
    },
    {
      id: 'pemesanan',
      href: '/admin/pemesanan',
      label: 'Pemesanan',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'pembayaran',
      href: '/admin/pembayaran',
      label: 'Pembayaran',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'penjadwalan',
      href: '/admin/penjadwalan',
      label: 'Penjadwalan',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'pengaturan',
      href: '/admin/pengaturan',
      label: 'Pengaturan',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="border-b border-[rgba(0,188,125,0.3)] p-4 lg:p-6 flex-shrink-0">
        <div className="bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] rounded-2xl p-3 lg:p-4">
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-16 h-16 lg:w-24 lg:h-24">
              <Image
                src={imgLogo}
                alt="PP Tour Travel Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <p className="text-white font-bold text-lg lg:text-xl text-center tracking-tight">
            PP TOUR TRAVEL
          </p>
          <p className="text-[#a4f4cf] text-center text-sm lg:text-base mt-1 lg:mt-2">
            Admin Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl transition-colors ${activePage === item.id
              ? 'bg-white text-[#007a55] shadow-lg font-semibold'
              : 'text-emerald-50 hover:bg-[rgba(255,255,255,0.1)]'
              }`}
          >
            {item.icon}
            <span className="text-sm lg:text-base">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-[rgba(0,188,125,0.3)] p-3 lg:p-4 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 text-emerald-50 rounded-xl lg:rounded-2xl hover:bg-[rgba(255,255,255,0.1)] transition-colors w-full text-sm lg:text-base"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header with Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#009966] to-[#007a55] shadow-lg h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src={imgLogo} alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-white font-bold text-sm">PP Tour Travel</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed top-14 left-0 w-64 h-[calc(100vh-56px)] z-50 bg-gradient-to-b from-[#009966] via-[#007a55] to-[#006045] shadow-2xl flex flex-col transform transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-[#009966] via-[#007a55] to-[#006045] shadow-2xl flex-col fixed top-0 left-0 h-screen overflow-y-auto">
        {sidebarContent}
      </div>
    </>
  )
}

