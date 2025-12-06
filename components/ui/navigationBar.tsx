'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useUser, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const imgLogo = "/Logo_Transparent_White.png"

export default function NavigationBar() {
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

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

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Logout button clicked!')
    
    try {
      console.log('Calling signOut...')
      await signOut()
      console.log('SignOut complete, redirecting...')
      setIsDropdownOpen(false)
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setIsDropdownOpen(false)
    }
  }

  return (
    <nav className="w-full bg-[rgba(255,255,255,0.02)] py-3 px-7">
      <div className="max-w-[1408px] mx-auto flex items-center justify-between h-[73px]">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="relative w-[53px] h-[73px]">
            <Image
              src={imgLogo}
              alt="PP Tour Travel Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="font-[family-name:var(--font-poppins)] font-extrabold text-[24px] text-white whitespace-nowrap">
            PP TOUR TRAVEL
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-[26.569px]">
          <Link 
            href="/"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal border-b border-white hover:opacity-100 transition-opacity"
          >
            Home
          </Link>
          <Link 
            href="/paket"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Paket
          </Link>
          <Link 
            href="/tentang"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Tentang
          </Link>
          <Link 
            href="/kontak"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Kontak
          </Link>
          
          {/* Auth Section */}
          {!isSignedIn ? (
            <>
              <Link 
                href="/login"
                className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-bold hover:opacity-100 transition-opacity"
              >
                Log In
              </Link>
              <Link 
                href="/sign-up"
                className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-bold hover:opacity-100 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              {/* Profile Picture Button */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-white/30 hover:border-white/60 transition-colors"
              >
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || 'Profile'}
                  width={45}
                  height={45}
                  className="object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-[10px] shadow-2xl overflow-hidden z-[100]">
                  {/* User Info Section */}
                  <div className="px-5 py-4 bg-gradient-to-br from-[#f4a336] to-[#e09530]">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.imageUrl}
                        alt={user.fullName || 'Profile'}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-inter)] font-bold text-[16px] text-white truncate">
                          {user.fullName}
                        </p>
                        <p className="font-[family-name:var(--font-inter)] text-[13px] text-white/90 truncate">
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="px-5 py-3 border-b border-gray-200">
                    <p className="font-[family-name:var(--font-inter)] text-[13px] text-gray-600 mb-2">
                      Informasi Akun
                    </p>
                    <div className="space-y-1 text-[14px]">
                      {user.username && (
                        <p className="font-[family-name:var(--font-inter)] text-gray-800">
                          <span className="font-semibold">Username:</span> {user.username}
                        </p>
                      )}
                      <p className="font-[family-name:var(--font-inter)] text-gray-800">
                        <span className="font-semibold">Status:</span> {isAdmin ? 'Admin' : 'User'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-3 space-y-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block w-full px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center rounded-[8px] font-[family-name:var(--font-inter)] font-semibold text-[14px] hover:from-blue-600 hover:to-blue-700 transition-all"
                      >
                        🛡️ Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        console.log('Mouse down on logout button')
                      }}
                      onClick={(e) => {
                        console.log('CLICK EVENT FIRED!')
                        handleLogout(e)
                      }}
                      className="w-full px-4 py-2.5 bg-red-500 text-white rounded-[8px] font-[family-name:var(--font-inter)] font-semibold text-[14px] hover:bg-red-600 transition-colors cursor-pointer active:scale-95"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
