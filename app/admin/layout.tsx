'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      // If not signed in, redirect to home
      if (isLoaded && !isSignedIn) {
        router.push('/')
        return
      }

      // If signed in, check admin status
      if (isLoaded && isSignedIn && user?.id) {
        try {
          const response = await fetch(`/api/user/admin-status?userId=${user.id}`)
          
          if (!response.ok) {
            console.error('Failed to check admin status:', response.status)
            setIsAdmin(false)
            router.push('/')
            return
          }
          
          const data = await response.json()
          const adminStatus = data.is_admin || false
          
          setIsAdmin(adminStatus)
          
          // If not admin, redirect to home
          if (!adminStatus) {
            router.push('/')
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
          router.push('/')
        } finally {
          setIsChecking(false)
        }
      }
    }

    checkAdminStatus()
  }, [isLoaded, isSignedIn, user?.id, router])

  // Show loading state while checking
  if (!isLoaded || isChecking || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-[#009966] border-r-transparent mb-4"></div>
          <p className="text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    )
  }

  // If not admin, don't render anything (will redirect)
  if (!isAdmin) {
    return null
  }

  // If admin, render the children
  return <>{children}</>
}
