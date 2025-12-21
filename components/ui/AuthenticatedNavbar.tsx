'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import ProfileDropdown from '@/components/ui/ProfileDropdown'

const imgLogo = "/images/landing/logo.png"

export default function AuthenticatedNavbar() {
  const { isSignedIn, user } = useUser()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Check if user is admin from API
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.id) {
        try {
          const response = await fetch(`/api/user/admin-status?userId=${user.id}`)
          
          if (!response.ok) {
            console.error('Admin status check failed:', response.status)
            setIsAdmin(false)
            return
          }
          
          const data = await response.json()
          setIsAdmin(data.is_admin || false)
        } catch (error) {
          console.error('Failed to check admin status:', error)
          setIsAdmin(false)
        }
      }
    }
    
    checkAdminStatus()
  }, [user?.id])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const getUserInitials = () => {
    if (!user) return 'U'
    const fullName = user.fullName || user.firstName || user.username || 'User'
    const names = fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return fullName.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="w-full bg-white shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1440px] mx-auto px-[100px] py-0 h-[64px] flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-[10px] h-[36px]">
          <div className="relative w-[36px] h-[36px] rounded-[10px] overflow-hidden flex items-center justify-center">
            <Image
              src={imgLogo}
              alt="PP Tour Travel Logo"
              width={26}
              height={36}
              className="object-cover"
              priority
            />
          </div>
          <span className="font-['Inter',sans-serif] font-semibold text-[20px] leading-[28px] text-[#101828]">
            PP Tour Travel
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-0 h-[20px]">
          <Link 
            href="/"
            className={`relative font-['Inter',sans-serif] text-[14px] leading-[20px] px-[16px] hover:text-[#00bc7d] transition-colors ${
              pathname === '/'
                ? 'font-semibold text-[#101828] after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[22px] after:h-[4px] after:rounded-full after:bg-[#00bc7d]'
                : 'font-normal text-[#4a5565]'
            }`}
          >
            Beranda
          </Link>
          <Link 
            href="/paket-tour"
            className={`relative font-['Inter',sans-serif] text-[14px] leading-[20px] px-[16px] hover:text-[#00bc7d] transition-colors ${
              pathname.startsWith('/paket-tour')
                ? 'font-semibold text-[#101828] after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[22px] after:h-[4px] after:rounded-full after:bg-[#00bc7d]'
                : 'font-normal text-[#4a5565]'
            }`}
          >
            Paket Tour
          </Link>
          {isSignedIn && (
            <Link 
              href="/riwayat-pesanan"
              className={`relative font-['Inter',sans-serif] text-[14px] leading-[20px] px-[16px] hover:text-[#00bc7d] transition-colors ${
                pathname.startsWith('/riwayat-pesanan')
                  ? 'font-semibold text-[#101828] after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-[22px] after:h-[4px] after:rounded-full after:bg-[#00bc7d]'
                  : 'font-normal text-[#4a5565]'
              }`}
            >
              Riwayat Pesanan
            </Link>
          )}
          {!pathname.startsWith('/paket-tour') && !pathname.startsWith('/riwayat-pesanan') && (
            <button
              type="button"
              className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#4a5565] px-[16px] hover:text-[#00bc7d] transition-colors"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => {
                const el = document.getElementById('about-us');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Tentang Kami
            </button>
          )}
        </div>

        {/* User Actions */}
        <div className="flex items-center h-[48px] relative" ref={dropdownRef}>
          {/* Profile Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-[10px] px-[12px] h-[48px] rounded-[10px] hover:bg-gray-50 transition-colors"
          >
            {/* User Avatar with Image or Initials */}
            {user?.imageUrl ? (
              <div className="w-[32px] h-[32px] rounded-full overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
                <Image
                  src={user.imageUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#00bc7d] to-[#00a06f] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white">
                  {getUserInitials()}
                </span>
              </div>
            )}

            {/* User Name */}
            <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#364153]">
              {user?.fullName || user?.firstName || user?.username || 'User'}
            </span>

            {/* Chevron Icon */}
            <Image
              src="/images/chevron-down-icon.svg"
              alt="Menu"
              width={16}
              height={16}
              className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <ProfileDropdown
              user={user}
              isAdmin={isAdmin}
              onClose={() => setIsDropdownOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  )
}
