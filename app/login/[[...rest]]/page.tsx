'use client'

import { useSignIn, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, Lock, LogIn } from 'lucide-react'
import AuthInput from '@/components/auth/AuthInput'

interface FormErrors {
  identifier?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useUser()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ identifier?: boolean; password?: boolean }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  // Auto-validate on change
  useEffect(() => {
    if (touched.identifier) {
      if (!identifier.trim()) {
        setErrors(prev => ({ ...prev, identifier: 'Email atau username wajib diisi' }))
      } else {
        setErrors(prev => ({ ...prev, identifier: undefined }))
      }
    }
  }, [identifier, touched.identifier])

  useEffect(() => {
    if (touched.password) {
      if (!password) {
        setErrors(prev => ({ ...prev, password: 'Password wajib diisi' }))
      } else {
        setErrors(prev => ({ ...prev, password: undefined }))
      }
    }
  }, [password, touched.password])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!identifier.trim()) newErrors.identifier = 'Email atau username wajib diisi'
    if (!password) newErrors.password = 'Password wajib diisi'
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
      const result = await signIn.create({ identifier, password })
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      }
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code
      const errorMessage = err.errors?.[0]?.message

      if (errorCode === 'form_identifier_not_found') {
        setErrors({ identifier: 'Email atau username tidak terdaftar' })
      } else if (errorCode === 'form_password_incorrect') {
        setErrors({ password: 'Password salah' })
      } else if (errorCode === 'user_locked' || errorMessage?.includes('banned')) {
        setErrors({ general: 'Akun Anda telah diblokir. Hubungi admin.' })
      } else {
        setErrors({ general: errorMessage || 'Login gagal. Silakan coba lagi.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Image src="/background-login.webp" alt="Background" fill className="object-cover" priority />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-6 px-4">
        <div className="mb-4">
          <Image src="/Logo_Transparent_Black.png" alt="PP Tour Travel Logo" width={80} height={80} className="object-contain" priority />
        </div>

        <div className="text-center mb-5">
          <h1 className="font-inter font-bold text-3xl md:text-4xl text-gray-900 italic leading-tight">
            Selamat Datang<br />Kembali
          </h1>
          <p className="font-inter text-gray-600 mt-2 text-xs">Login untuk melanjutkan perjalanan Anda</p>
        </div>

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-inter">
                {errors.general}
              </div>
            )}

            <AuthInput
              label="Email / Username"
              type="text"
              icon={Mail}
              placeholder="Masukkan email atau username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, identifier: true }))}
              error={errors.identifier}
              disabled={isLoading}
            />

            <AuthInput
              label="Password"
              isPassword
              icon={Lock}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              error={errors.password}
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="font-inter text-gray-600">Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="font-inter text-emerald-500 hover:text-emerald-600 transition-colors">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-inter font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              {isLoading ? 'Memproses...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="font-inter text-xs text-gray-600">
              Belum punya akun?{' '}
              <Link href="/sign-up" className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>

        <Link href="/" className="mt-5 font-inter text-xs text-gray-600 hover:text-gray-800 transition-colors">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}