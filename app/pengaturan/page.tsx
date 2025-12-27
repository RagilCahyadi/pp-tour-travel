'use client'

import { useState, useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, Save, X, Eye, EyeOff, Shield, LogOut, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserProfile {
    first_name: string | null
    last_name: string | null
    profile_image_url: string | null
    phone_number: string | null
}

export default function PengaturanPage() {
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingPassword, setSavingPassword] = useState(false)
    const [profile, setProfile] = useState<UserProfile>({
        first_name: '',
        last_name: '',
        profile_image_url: '',
        phone_number: ''
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Password states
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordError, setPasswordError] = useState('')

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

                    try {
                        await user.setProfileImage({ file: imageFile })
                    } catch (clerkError) {
                        console.error('Failed to update Clerk profile image:', clerkError)
                    }
                } else {
                    alert('Gagal mengupload foto')
                    setSaving(false)
                    return
                }
            }

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

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('Semua field harus diisi')
            return
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Password baru dan konfirmasi tidak cocok')
            return
        }

        if (newPassword.length < 8) {
            setPasswordError('Password minimal 8 karakter')
            return
        }

        setSavingPassword(true)

        try {
            await user?.updatePassword({
                currentPassword,
                newPassword
            })

            alert('Password berhasil diubah!')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            console.error('Error changing password:', error)
            if (error.errors?.[0]?.code === 'form_password_incorrect') {
                setPasswordError('Password saat ini salah')
            } else {
                setPasswordError(error.errors?.[0]?.message || 'Gagal mengubah password')
            }
        } finally {
            setSavingPassword(false)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut()
            window.location.href = '/'
        } catch (error) {
            console.error('Logout error:', error)
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
                    <p className="text-gray-600">Memuat pengaturan...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-6 pb-12">
            <div className="max-w-3xl mx-auto px-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
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
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
                    <p className="text-gray-600">Kelola profil dan keamanan akun Anda</p>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
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

                        {/* Profile Form */}
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

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" />
                                            Simpan Profil
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Account Security Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 px-8 py-5 border-b border-red-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Keamanan Akun</h2>
                                <p className="text-sm text-gray-600">Amankan akun Anda</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Password Change Form */}
                        <div className="border border-red-200 rounded-xl p-6 bg-red-50/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-5 h-5 text-gray-700" />
                                <h3 className="text-lg font-semibold text-gray-900">Ubah Password</h3>
                            </div>

                            {passwordError && (
                                <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
                                    {passwordError}
                                </div>
                            )}

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {/* Current Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password Saat Ini
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Masukkan password saat ini"
                                            className="w-full pr-10 border-red-200 focus:border-red-400 focus:ring-red-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password Baru
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Masukkan password baru"
                                            className="w-full pr-10 border-red-200 focus:border-red-400 focus:ring-red-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konfirmasi Password Baru
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Konfirmasi password baru"
                                            className="w-full pr-10 border-red-200 focus:border-red-400 focus:ring-red-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={savingPassword}
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all"
                                >
                                    {savingPassword ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Mengubah...
                                        </>
                                    ) : (
                                        'Ubah Password'
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Logout Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout dari Akun
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
