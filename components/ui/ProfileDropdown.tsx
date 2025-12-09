'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useClerk } from '@clerk/nextjs'
import type { UserResource } from '@clerk/types'

interface ProfileDropdownProps {
  user: UserResource | null | undefined
  isAdmin: boolean
  onClose: () => void
}

export default function ProfileDropdown({ user, isAdmin, onClose }: ProfileDropdownProps) {
  const { signOut } = useClerk()

  const handleLogout = async () => {
    try {
      await signOut()
      onClose()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      onClose()
    }
  }

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
    <div className="absolute left-1/2 -translate-x-1/2 top-[56px] w-[224px] bg-white border border-gray-100 rounded-[10px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] z-50">
      {/* User Info Section */}
      <div className="border-b border-gray-100 px-[16px] pt-[12px] pb-[1px]">
        {/* User Avatar and Name */}
        <div className="flex items-center gap-[12px] mb-[8px]">
          {user?.imageUrl ? (
            <div className="w-[32px] h-[32px] rounded-full overflow-hidden shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0">
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-[#00bc7d] to-[#00a06f] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center shrink-0">
              <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-white text-center">
                {getUserInitials()}
              </span>
            </div>
          )}
        </div>

        {/* User Name */}
        <div className="mb-[2px]">
          <p className="font-['Inter',sans-serif] font-medium text-[16px] leading-[25.6px] text-[#101828] truncate">
            {user?.fullName || user?.firstName || user?.username || 'User'}
          </p>
        </div>

        {/* Email */}
        <div className="mb-[1px]">
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[25.6px] text-[#6a7282] truncate">
            {user?.primaryEmailAddress?.emailAddress || 'No email'}
          </p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="pt-[4px]">
        {/* Profil Saya */}
        <Link
          href="/profil"
          onClick={onClose}
          className="flex items-center gap-[12px] h-[36px] px-[16px] hover:bg-gray-50 transition-colors"
        >
          <Image
            src="/images/user-icon.svg"
            alt="Profile"
            width={16}
            height={16}
          />
          <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#364153]">
            Profil Saya
          </span>
        </Link>


        {/* Admin Dashboard (Only for Admin) */}
        {isAdmin && (
          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center gap-[12px] h-[36px] px-[16px] bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-colors border-t border-b border-blue-200"
          >
            <span className="text-[16px]">🛡️</span>
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] leading-[20px] text-blue-700">
              Admin Dashboard
            </span>
          </Link>
        )}

        {/* Keluar */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-[12px] h-[36px] px-[16px] hover:bg-red-50 transition-colors"
        >
          <Image
            src="/images/logout-icon.svg"
            alt="Logout"
            width={16}
            height={16}
          />
          <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-[20px] text-[#e7000b]">
            Keluar
          </span>
        </button>
      </div>
    </div>
  )
}
