'use client'

import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  nama: string
  hakAkses: string
  negara: string
  kota: string
  alamat: string
  email: string
  nomorHp: string
  bahasa: string
  zonaWaktu: string
  fotoProfil?: string
}

interface UserData {
  id: string
  email_address: string | null
  username: string | null
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
  created_at: string
  is_admin: boolean
  banned_at: string | null
}

export default function AdminPengaturanPage() {
  const { user, isLoaded } = useUser()
  const [profileData, setProfileData] = useState<ProfileData>({
    nama: '',
    hakAkses: 'Admin-1',
    negara: 'Indonesia',
    kota: '',
    alamat: '',
    email: '',
    nomorHp: '',
    bahasa: 'id',
    zonaWaktu: 'GMT+7'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  // User Management states
  const [users, setUsers] = useState<UserData[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  // Fetch profile data from Supabase users table
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !user?.id) return

      try {
        setLoading(true)

        // Fetch user profile from Supabase users table via API
        const response = await fetch(`/api/admin/profile?userId=${user.id}`)

        if (response.ok) {
          const result = await response.json()
          const userData = result.data

          if (userData) {
            // Split first_name and last_name or combine them
            const fullName = `${userData.first_name || ''} ${userData.last_name || ''}`.trim()

            setProfileData({
              nama: fullName || user.fullName || 'Admin',
              hakAkses: 'Admin-1',
              negara: 'Indonesia',
              kota: '',
              alamat: '',
              email: userData.email_address || user.primaryEmailAddress?.emailAddress || '',
              nomorHp: userData.phone_number || '',
              bahasa: 'id',
              zonaWaktu: 'GMT+7',
              fotoProfil: user.imageUrl
            })
          } else {
            // No user data found, use Clerk defaults
            setProfileData({
              nama: user.fullName || user.firstName || 'Admin',
              hakAkses: 'Admin-1',
              negara: 'Indonesia',
              kota: '',
              alamat: '',
              email: user.primaryEmailAddress?.emailAddress || '',
              nomorHp: '',
              bahasa: 'id',
              zonaWaktu: 'GMT+7',
              fotoProfil: user.imageUrl
            })
          }
        } else {
          // API error, fallback to Clerk data
          console.log('Profile API error, using Clerk data')
          setProfileData({
            nama: user.fullName || user.firstName || 'Admin',
            hakAkses: 'Admin-1',
            negara: 'Indonesia',
            kota: '',
            alamat: '',
            email: user.primaryEmailAddress?.emailAddress || '',
            nomorHp: '',
            bahasa: 'id',
            zonaWaktu: 'GMT+7',
            fotoProfil: user.imageUrl
          })
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, isLoaded])

  // Fetch all users for User Management
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isLoaded || !user?.id) return

      try {
        setLoadingUsers(true)

        // Use API route to bypass RLS since we're using Clerk auth
        const response = await fetch('/api/admin/users')

        if (!response.ok) {
          console.error('Error fetching users:', response.statusText)
          return
        }

        const data = await response.json()

        if (data.users) {
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error)
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [user, isLoaded])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`Apakah Anda yakin ingin ${currentStatus ? 'mencabut' : 'memberikan'} hak admin untuk user ini?`)) {
      return
    }

    try {
      setUpdatingUser(userId)

      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: userId,
          updateData: { is_admin: !currentStatus }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update admin status')
      }

      // Update local state
      setUsers(users.map(u =>
        u.id === userId ? { ...u, is_admin: !currentStatus } : u
      ))
      alert('Status admin berhasil diubah!')
    } catch (error) {
      console.error('Error toggling admin:', error)
      alert('Terjadi kesalahan saat mengubah status admin: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleBanUser = async (userId: string, currentBanStatus: string | null) => {
    const isBanned = currentBanStatus !== null

    if (!confirm(`Apakah Anda yakin ingin ${isBanned ? 'membuka ban' : 'memban'} user ini?`)) {
      return
    }

    try {
      setUpdatingUser(userId)

      const updateData = {
        banned_at: isBanned ? null : new Date().toISOString()
      }

      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserId: userId,
          updateData
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update ban status')
      }

      // Update local state
      setUsers(users.map(u =>
        u.id === userId ? { ...u, banned_at: updateData.banned_at } : u
      ))
      alert(`User berhasil ${isBanned ? 'dibuka ban' : 'diban'}!`)
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Terjadi kesalahan saat mengubah status ban: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleSaveProfile = async () => {
    // Validate required fields
    if (!profileData.nama || !profileData.email || !profileData.nomorHp) {
      alert('Mohon lengkapi nama, email, dan nomor HP!')
      return
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      alert('Format email tidak valid!')
      return
    }

    if (!user?.id) {
      alert('User tidak ditemukan!')
      return
    }

    try {
      setSaving(true)

      // Split nama into first_name and last_name
      const nameParts = profileData.nama.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Update users table via API
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          updateData: {
            first_name: firstName,
            last_name: lastName,
            email_address: profileData.email,
            phone_number: profileData.nomorHp
          }
        })
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error saving profile:', result.error)
        alert('Gagal menyimpan profil: ' + result.error)
      } else {
        alert('Profil berhasil disimpan!')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Terjadi kesalahan saat menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar activePage="pengaturan" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009966]"></div>
            <p className="mt-4 text-[#6a7282]">Memuat data profil...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activePage="pengaturan" />

      {/* Main Content */}
      <div className="ml-64 min-h-screen overflow-auto">
        <div className="p-8 space-y-6" style={{ background: 'linear-gradient(141.98deg, #f9fafb 0%, #f3f4f6 100%)' }}>
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-[#101828] tracking-tight mb-1">Pengaturan</h1>
            <p className="text-[#6a7282] text-base">Kelola profil dan preferensi akun Anda</p>
          </div>

          {/* Profil Admin Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-[#009966] to-[#00bc7d] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-[16.4px] p-2.5">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Profil Admin</h2>
                  <p className="text-[#d0fae5]">Informasi pribadi dan kontak</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-3 gap-6">
              {/* Left Column - Profile Photo & Settings */}
              <div className="space-y-6">
                <div className="border border-gray-100 rounded-[16.4px] p-6">
                  <label className="block text-sm text-[#364153] mb-3">Foto Profil</label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32">
                      <div className="w-32 h-32 rounded-full border-4 border-[#d0fae5] overflow-hidden shadow-md bg-gray-100">
                        {(profileData.fotoProfil || user?.imageUrl) ? (
                          <Image
                            src={profileData.fotoProfil || user?.imageUrl || ''}
                            alt="Profile"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#009966] text-white text-4xl font-bold">
                            {profileData.nama.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                    </div>
                  </div>
                </div>

                {/* Time & Language */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-xl font-semibold text-[#364153] mb-4"></h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2"></label>
                      {/* <select
                        name="bahasa"
                        value={profileData.bahasa}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]">
                        <option value="id">Bahasa Indonesia</option>
                        <option value="en">English</option>
                      </select> */}
                    </div>
                    <div>
                      <label className="block text-xs text-[#6a7282] mb-2"></label>
                      {/* <select
                        name="zonaWaktu"
                        value={profileData.zonaWaktu}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-[#009966]">
                        <option value="GMT+7">GMT +7:00 (Jakarta)</option>
                        <option value="GMT+8">GMT +8:00 (Bali)</option>
                        <option value="GMT+9">GMT +9:00 (Jayapura)</option>
                      </select> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - General Information */}
              <div className="col-span-2 border border-gray-100 rounded-[16.4px] p-6">
                <h3 className="text-xl font-semibold text-[#364153] mb-6">Informasi Umum</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Nama</label>
                    <input
                      type="text"
                      name="nama"
                      value={profileData.nama}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Hak Akses</label>
                    <input
                      type="text"
                      name="hakAkses"
                      value={profileData.hakAkses}
                      disabled
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-[10px] text-[#6a7282]"
                    />
                  </div>
                  {/* <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Negara</label>
                    <input
                      type="text"
                      name="negara"
                      value={profileData.negara}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div> */}
                  {/* <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Kota</label>
                    <input
                      type="text"
                      name="kota"
                      value={profileData.kota}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div> */}

                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6a7282] mb-2">Nomor HP</label>
                    <input
                      type="tel"
                      name="nomorHp"
                      value={profileData.nomorHp}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#009966]"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#009966] to-[#00bc7d] text-white rounded-[16.4px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Management Section */}
          <div className="bg-white border border-gray-100 rounded-[16px] shadow-lg overflow-hidden">
            {/* Header with Orange Gradient */}
            <div className="bg-gradient-to-r from-[#fb923c] to-[#f97316] px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-[16.4px] p-2.5">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">User Management</h2>
                    <p className="text-orange-100">Kelola akun pengguna dan hak akses</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-[10px]">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-white font-semibold">{users.length} Users</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loadingUsers ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb923c]"></div>
                  <p className="mt-4 text-[#6a7282]">Memuat data users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="text-[#6a7282]">Tidak ada user yang ditemukan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#364153]">User</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#364153]">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[#364153]">Username</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-[#364153]">Tanggal Bergabung</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-[#364153]">Status</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-[#364153]">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userData) => {
                        const isBanned = userData.banned_at !== null
                        const isCurrentUser = userData.id === user?.id
                        const isUpdating = updatingUser === userData.id

                        return (
                          <tr key={userData.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                  {userData.profile_image_url ? (
                                    <Image
                                      src={userData.profile_image_url}
                                      alt={userData.first_name || 'User'}
                                      width={40}
                                      height={40}
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#fb923c] text-white font-semibold">
                                      {(userData.first_name || userData.email_address || 'U').charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-[#101828]">
                                    {userData.first_name || userData.last_name
                                      ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim()
                                      : 'No Name'}
                                  </p>
                                  {isCurrentUser && (
                                    <span className="text-xs text-[#fb923c] font-medium">You</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-[#6a7282]">
                              {userData.email_address || '-'}
                            </td>
                            <td className="py-4 px-4 text-sm text-[#6a7282]">
                              {userData.username || '-'}
                            </td>
                            <td className="py-4 px-4 text-center text-sm text-[#6a7282]">
                              {new Date(userData.created_at).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex flex-col items-center gap-1">
                                {userData.is_admin && (
                                  <span className="px-2 py-1 bg-[#d0fae5] text-[#007a55] text-xs font-medium rounded">
                                    Admin
                                  </span>
                                )}
                                {isBanned && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                    Banned
                                  </span>
                                )}
                                {!userData.is_admin && !isBanned && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                    User
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleToggleAdmin(userData.id, userData.is_admin)}
                                  disabled={isCurrentUser || isUpdating}
                                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-[10px] transition-colors ${userData.is_admin
                                    ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                                    : 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title={isCurrentUser ? 'Tidak dapat mengubah status admin sendiri' : ''}
                                >
                                  {isUpdating ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                  )}
                                  {userData.is_admin ? 'Cabut Admin' : 'Jadikan Admin'}
                                </button>
{/* 
                                <button
                                  onClick={() => handleBanUser(userData.id, userData.banned_at)}
                                  disabled={isCurrentUser || isUpdating}
                                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-[10px] transition-colors ${isBanned
                                    ? 'bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100'
                                    : 'bg-red-50 border border-red-200 text-red-700 hover:bg-red-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                  title={isCurrentUser ? 'Tidak dapat memban diri sendiri' : ''}
                                >
                                  {isUpdating ? (
                                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isBanned ? "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
                                    </svg>
                                  )}
                                  {isBanned ? 'Unban' : 'Ban User'}
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
