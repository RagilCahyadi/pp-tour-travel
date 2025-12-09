'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserProfile {
  first_name: string | null
  last_name: string | null
  profile_image_url: string | null
  phone_number: string | null
}

export default function ProfilPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    profile_image_url: '',
    phone_number: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoaded) return
    if (!user) {
      router.push('/login')
      return
    }

    fetchProfile()
  }, [user, isLoaded, router])

  const fetchProfile = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/user/profile?userId=${user.id}`)
      
      if (!response.ok) {
        console.error('Failed to fetch profile:', response.status)
        return
      }

      const data = await response.json()
      
      // Prioritize Clerk image over database image
      const profileImageUrl = user.imageUrl || data.profile_image_url || ''
      
      setProfile({
        first_name: data.first_name || user.firstName || '',
        last_name: data.last_name || user.lastName || '',
        profile_image_url: profileImageUrl,
        phone_number: data.phone_number || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setSaving(true)

    try {
      let imageUrl = profile.profile_image_url

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('userId', user.id)

        const uploadResponse = await fetch('/api/user/upload-profile-image', {
          method: 'POST',
          body: formData
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
          
          // Update Clerk profile picture
          try {
            await user.setProfileImage({ file: imageFile })
          } catch (clerkError) {
            console.error('Failed to update Clerk profile image:', clerkError)
            // Continue anyway, database is updated
          }
        } else {
          alert('Gagal mengupload foto')
          setSaving(false)
          return
        }
      }

      // Update profile in database
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          profile_image_url: imageUrl,
          phone_number: profile.phone_number
        })
      })

      if (response.ok) {
        // Update Clerk user metadata (first_name, last_name)
        try {
          await user.update({
            firstName: profile.first_name || undefined,
            lastName: profile.last_name || undefined,
          })
        } catch (clerkError) {
          console.error('Failed to update Clerk metadata:', clerkError)
        }

        alert('Profil berhasil diperbarui!')
        setImageFile(null)
        setImagePreview(null)
        
        // Reload user data from Clerk
        await user.reload()
        fetchProfile()
      } else {
        alert('Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  const getUserInitials = () => {
    const firstName = profile.first_name || user?.firstName || 'U'
    const lastName = profile.last_name || user?.lastName || ''
    if (lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    return firstName.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Saya</h1>
          <p className="text-gray-600">Kelola informasi profil Anda</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

          <div className="px-8 pb-8">
            {/* Profile Image Section */}
            <div className="relative -mt-16 mb-6">
              <div className="relative w-32 h-32 mx-auto">
                {imagePreview || profile.profile_image_url ? (
                  <Image
                    src={imagePreview || profile.profile_image_url || ''}
                    alt="Profile"
                    fill
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-semibold">
                      {getUserInitials()}
                    </span>
                  </div>
                )}

                {/* Upload Button */}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-2 border-emerald-500"
                >
                  <Camera className="w-5 h-5 text-emerald-600" />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Clear Preview Button */}
                {imagePreview && (
                  <button
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-0 right-0 w-8 h-8 bg-red-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Email Display */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Depan
                  </label>
                  <Input
                    type="text"
                    value={profile.first_name || ''}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    placeholder="Masukkan nama depan"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Belakang
                  </label>
                  <Input
                    type="text"
                    value={profile.last_name || ''}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    placeholder="Masukkan nama belakang"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  placeholder="Contoh: +62812345678"
                  className="w-full"
                />
              </div>


              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="px-8 py-3 rounded-xl font-semibold"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Tips:</strong> Pastikan nomor telepon Anda aktif untuk memudahkan komunikasi terkait pemesanan tour.
          </p>
        </div>
      </div>
    </div>
  )
}
