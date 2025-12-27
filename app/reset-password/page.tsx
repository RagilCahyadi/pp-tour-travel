'use client'

import { useSignIn } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, KeyRound } from 'lucide-react'
import AuthInput from '@/components/auth/AuthInput'

interface FormErrors {
    password?: string
    confirmPassword?: string
    code?: string
    general?: string
}

export default function ResetPasswordPage() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [code, setCode] = useState('')
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const router = useRouter()
    const hasCheckedEmail = useRef(false)

    // Get email from session storage
    useEffect(() => {
        if (hasCheckedEmail.current) return
        hasCheckedEmail.current = true

        const storedEmail = sessionStorage.getItem('resetEmail')
        if (!storedEmail) {
            router.push('/forgot-password')
        } else {
            setEmail(storedEmail)
        }
    }, [router])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!password) {
            newErrors.password = 'Password baru wajib diisi'
        } else if (password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter'
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi'
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Password tidak cocok'
        }

        if (!code.trim()) {
            newErrors.code = 'Kode reset wajib diisi'
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
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })

            if (result.status === 'complete') {
                // Clear stored email
                sessionStorage.removeItem('resetEmail')
                await setActive({ session: result.createdSessionId })
                router.push('/')
            } else if (result.status === 'needs_second_factor') {
                setErrors({ general: 'Akun memerlukan verifikasi 2 faktor.' })
            }
        } catch (err: any) {
            const errorCode = err.errors?.[0]?.code
            const errorMessage = err.errors?.[0]?.message

            if (errorCode === 'form_code_incorrect') {
                setErrors({ code: 'Kode reset salah' })
            } else if (errorCode === 'form_password_pwned') {
                setErrors({ password: 'Password terlalu umum, gunakan password yang lebih kuat' })
            } else if (errorCode === 'form_password_not_strong_enough') {
                setErrors({ password: 'Password tidak cukup kuat' })
            } else if (errorCode === 'verification_expired') {
                setErrors({ general: 'Kode sudah kadaluarsa. Silakan minta kode baru.' })
            } else {
                setErrors({ general: errorMessage || 'Reset password gagal. Silakan coba lagi.' })
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
                        Reset Password
                    </h1>
                    <p className="font-inter text-gray-600 mt-3 text-sm">
                        Masukkan kata sandi baru Anda
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

                        {/* New Password Field */}
                        <AuthInput
                            label="Password Baru"
                            isPassword
                            icon={Lock}
                            placeholder="Silakan masukkan kata sandi baru Anda"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password}
                            disabled={isLoading}
                        />

                        {/* Confirm Password Field */}
                        <AuthInput
                            label="Konfirmasi Password Baru"
                            isPassword
                            icon={Lock}
                            placeholder="Silakan konfirmasi kata sandi baru Anda"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={errors.confirmPassword}
                            disabled={isLoading}
                        />

                        {/* Reset Code Field */}
                        <AuthInput
                            label="Masukkan Reset Code"
                            type="text"
                            icon={KeyRound}
                            placeholder="Silakan masukkan kode yang di peroleh pada email"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            error={errors.code}
                            disabled={isLoading}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-inter font-semibold rounded-xl transition-colors"
                        >
                            {isLoading ? 'Memproses...' : 'Reset Password'}
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
