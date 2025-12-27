'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Send } from 'lucide-react'
import AuthInput from '@/components/auth/AuthInput'

interface FormErrors {
    email?: string
    general?: string
}

export default function ForgotPasswordPage() {
    const { isLoaded, signIn } = useSignIn()
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!email.trim()) {
            newErrors.email = 'Email wajib diisi'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Masukkan Valid Email'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded) return

        if (!validateForm()) return

        setIsLoading(true)
        setErrors({})

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })

            // Store email in sessionStorage for reset password page
            sessionStorage.setItem('resetEmail', email)
            router.push('/reset-password')
        } catch (err: any) {
            const errorCode = err.errors?.[0]?.code

            if (errorCode === 'form_identifier_not_found') {
                setErrors({ email: 'Email tidak terdaftar' })
            } else if (err.status === 429) {
                setErrors({ general: 'Terlalu banyak percobaan. Silakan tunggu beberapa menit.' })
            } else {
                setErrors({ general: err.errors?.[0]?.message || 'Gagal mengirim link. Silakan coba lagi.' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 -z-10">
                <Image
                    src="/background-login.webp"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-8 px-4">
                {/* Logo */}
                <div className="mb-8">
                    <Image
                        src="/Logo_Transparent_Black.png"
                        alt="PP Tour Travel Logo"
                        width={100}
                        height={100}
                        className="object-contain"
                        priority
                    />
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="font-inter font-bold text-4xl md:text-5xl text-gray-900">
                        Lupa Password
                    </h1>
                    <p className="font-inter text-gray-600 mt-3 text-sm">
                        We&apos;ll send you a verification link
                    </p>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-inter">
                                {errors.general}
                            </div>
                        )}

                        {/* Email Field */}
                        <AuthInput
                            label="Email"
                            type="email"
                            icon={Mail}
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={errors.email}
                            disabled={isLoading}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-inter font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            {isLoading ? 'Mengirim...' : 'Send Link'}
                        </button>
                    </form>
                </div>

                {/* Back to Home */}
                <Link
                    href="/"
                    className="mt-8 font-inter text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
                >
                    ← Kembali ke Beranda
                </Link>
            </div>
        </div>
    )
}
