'use client'

import { useSignUp, useUser } from '@clerk/nextjs'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import AuthInput from '@/components/auth/AuthInput'

interface FormErrors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  general?: string
}

interface Touched {
  firstName?: boolean
  lastName?: boolean
  username?: boolean
  email?: boolean
  phone?: boolean
  password?: boolean
  confirmPassword?: boolean
}

interface OTPErrors {
  code?: string
  general?: string
}

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Touched>({})
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [otpErrors, setOtpErrors] = useState<OTPErrors>({})
  const [isVerifying, setIsVerifying] = useState(false)
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) router.push('/')
  }, [isSignedIn, router])

  // Auto-validate
  useEffect(() => {
    if (touched.firstName && !firstName.trim()) {
      setErrors(prev => ({ ...prev, firstName: 'Nama depan wajib diisi' }))
    } else if (touched.firstName) {
      setErrors(prev => ({ ...prev, firstName: undefined }))
    }
  }, [firstName, touched.firstName])

  useEffect(() => {
    if (touched.lastName && !lastName.trim()) {
      setErrors(prev => ({ ...prev, lastName: 'Nama belakang wajib diisi' }))
    } else if (touched.lastName) {
      setErrors(prev => ({ ...prev, lastName: undefined }))
    }
  }, [lastName, touched.lastName])

  useEffect(() => {
    if (touched.email) {
      if (!email.trim()) {
        setErrors(prev => ({ ...prev, email: 'Email wajib diisi' }))
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }))
      } else {
        setErrors(prev => ({ ...prev, email: undefined }))
      }
    }
  }, [email, touched.email])

  useEffect(() => {
    if (touched.phone) {
      if (!phone.trim()) {
        setErrors(prev => ({ ...prev, phone: 'Nomor telepon wajib diisi' }))
      } else if (!/^[0-9]{10,15}$/.test(phone.replace(/\D/g, ''))) {
        setErrors(prev => ({ ...prev, phone: 'Nomor telepon tidak valid' }))
      } else {
        setErrors(prev => ({ ...prev, phone: undefined }))
      }
    }
  }, [phone, touched.phone])

  useEffect(() => {
    if (touched.password) {
      if (!password) {
        setErrors(prev => ({ ...prev, password: 'Password wajib diisi' }))
      } else if (password.length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password minimal 6 karakter' }))
      } else {
        setErrors(prev => ({ ...prev, password: undefined }))
      }
    }
  }, [password, touched.password])

  useEffect(() => {
    if (touched.confirmPassword) {
      if (!confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Konfirmasi password wajib diisi' }))
      } else if (password !== confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Password tidak cocok' }))
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }))
      }
    }
  }, [confirmPassword, password, touched.confirmPassword])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!firstName.trim()) newErrors.firstName = 'Nama depan wajib diisi'
    if (!lastName.trim()) newErrors.lastName = 'Nama belakang wajib diisi'
    if (!email.trim()) newErrors.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Format email tidak valid'
    if (!phone.trim()) newErrors.phone = 'Nomor telepon wajib diisi'
    else if (!/^[0-9]{10,15}$/.test(phone.replace(/\D/g, ''))) newErrors.phone = 'Nomor telepon tidak valid'
    if (!password) newErrors.password = 'Password wajib diisi'
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter'
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi password wajib diisi'
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Password tidak cocok'
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
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        username,
        unsafeMetadata: { phone_number: phone },
      })

      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
      }
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code
      const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message

      if (errorCode === 'form_identifier_exists') {
        setErrors({ email: 'Email sudah terdaftar' })
      } else if (errorCode === 'form_password_pwned') {
        setErrors({ password: 'Password terlalu umum' })
      } else if (err.status === 429) {
        setErrors({ general: 'Terlalu banyak percobaan. Tunggu beberapa menit.' })
      } else {
        setErrors({ general: errorMessage || 'Pendaftaran gagal.' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otpCode]
    newOtp[index] = value.slice(-1)
    setOtpCode(newOtp)
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData) {
      const newOtp = [...otpCode]
      for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i]
      setOtpCode(newOtp)
      if (pastedData.length === 6) otpInputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signUp) return

    const code = otpCode.join('')
    if (code.length !== 6) {
      setOtpErrors({ code: 'Masukkan kode 6 digit' })
      return
    }

    setIsVerifying(true)
    setOtpErrors({})

    try {
      // Attempt email verification with the code
      const result = await signUp.attemptEmailAddressVerification({ code })

      // Detailed logging to understand the state
      console.log('=== VERIFICATION RESULT ===')
      console.log('Result object:', result)
      console.log('Result status:', result?.status)
      console.log('Result createdSessionId:', result?.createdSessionId)
      console.log('signUp.status:', signUp.status)
      console.log('signUp.createdSessionId:', signUp.createdSessionId)
      console.log('signUp.verifications:', signUp.verifications)
      console.log('signUp.missingFields:', signUp.missingFields)
      console.log('signUp.unverifiedFields:', signUp.unverifiedFields)
      console.log('=== END VERIFICATION RESULT ===')

      // Check if verification returned complete status
      if (result?.status === 'complete') {
        if (result.createdSessionId) {
          await setActive({ session: result.createdSessionId })
          try {
            await fetch('/api/user/sync', { method: 'POST' })
          } catch (syncErr) {
            console.error('Sync error:', syncErr)
          }
        }
        router.push('/')
        return
      }

      // Fallback: check signUp object directly
      if (signUp.status === 'complete') {
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId })
          try {
            await fetch('/api/user/sync', { method: 'POST' })
          } catch (syncErr) {
            console.error('Sync error:', syncErr)
          }
        }
        router.push('/')
        return
      }

      // If email is verified but status is still missing_requirements
      // This means there might be other requirements (CAPTCHA, phone, etc.)
      const emailVerification = signUp.verifications?.emailAddress
      if (emailVerification?.status === 'verified') {
        console.log('Email is verified but sign-up not complete. Missing fields:', signUp.missingFields)
        // Try to force complete by setting session if available
        if (signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId })
          router.push('/')
          return
        }
      }

      // If not complete, show error with details
      console.log('Sign-up not complete, status:', signUp.status)
      console.log('Missing fields:', signUp.missingFields)
      setOtpErrors({ general: 'Verifikasi belum selesai. Silakan coba lagi.' })

    } catch (err: any) {
      console.error('Verification error:', err)
      const errorCode = err.errors?.[0]?.code
      const errorMessage = err.errors?.[0]?.message || ''

      // Handle "already verified" - the user exists, redirect to login
      if (errorCode === 'verification_already_verified') {
        // Check if we have a session to set
        if (signUp.status === 'complete' && signUp.createdSessionId) {
          await setActive({ session: signUp.createdSessionId })
          try {
            await fetch('/api/user/sync', { method: 'POST' })
          } catch (syncErr) {
            console.error('Sync error:', syncErr)
          }
          router.push('/')
        } else {
          // No session available, redirect to login
          router.push('/login')
        }
        return
      }

      if (errorCode === 'form_code_incorrect') {
        setOtpErrors({ code: 'Kode verifikasi salah' })
      } else if (errorCode === 'verification_expired') {
        setOtpErrors({ general: 'Kode sudah kadaluarsa. Silakan kirim ulang.' })
      } else {
        setOtpErrors({ general: errorMessage || 'Verifikasi gagal' })
      }
    }
    setIsVerifying(false)
  }

  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setOtpErrors({})
      setOtpCode(['', '', '', '', '', ''])
      otpInputRefs.current[0]?.focus()
    } catch {
      setOtpErrors({ general: 'Gagal mengirim ulang kode.' })
    }
  }

  // OTP Verification Screen
  if (pendingVerification) {
    return (
      <div className="relative w-full min-h-screen">
        {/* Background Image */}
        <Image
          src="/background-login.webp"
          alt="Background"
          fill
          className="object-cover -z-10"
          priority
        />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-6 px-4">
          <div className="mb-4">
            <Image src="/Logo_Transparent_Black.png" alt="Logo" width={70} height={70} className="object-contain" priority />
          </div>

          <div className="text-center mb-5">
            <h1 className="font-inter font-bold text-2xl md:text-3xl text-gray-900 italic">Verifikasi Email</h1>
            <p className="font-inter text-gray-600 mt-2 text-xs">
              Masukkan kode 6 digit yang dikirim ke<br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>

          <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              {otpErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-inter">
                  {otpErrors.general}
                </div>
              )}

              <div className="flex flex-col items-center gap-2">
                <label className="font-inter font-medium text-xs text-gray-700 uppercase tracking-wide">Kode Verifikasi</label>
                <div className="flex gap-1.5">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { otpInputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className={`w-10 h-11 text-center text-lg font-bold font-inter border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${otpErrors.code ? 'border-red-500' : 'border-gray-200'}`}
                      disabled={isVerifying}
                    />
                  ))}
                </div>
                {otpErrors.code && <p className="text-red-500 text-xs font-inter">{otpErrors.code}</p>}
              </div>

              <button type="submit" disabled={isVerifying} className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-inter font-semibold text-sm rounded-xl transition-colors">
                {isVerifying ? 'Memverifikasi...' : 'Verifikasi'}
              </button>

              <div className="text-center">
                <p className="font-inter text-xs text-gray-600">
                  Tidak menerima kode?{' '}
                  <button type="button" onClick={handleResendCode} className="text-emerald-500 hover:text-emerald-600 font-semibold">
                    Kirim ulang
                  </button>
                </p>
              </div>
            </form>
          </div>

          <Link href="/" className="mt-5 font-inter text-xs text-gray-600 hover:text-gray-800 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  // Registration Form
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Image src="/background-login.webp" alt="Background" fill className="object-cover" priority />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-6 px-4">
        <div className="mb-3">
          <Image src="/Logo_Transparent_Black.png" alt="Logo" width={70} height={70} className="object-contain" priority />
        </div>

        <div className="text-center mb-4">
          <h1 className="font-inter font-bold text-2xl md:text-3xl text-gray-900">Daftar Akun Baru</h1>
          <p className="font-inter text-gray-600 mt-1 text-xs">Mulai petualangan Anda bersama kami</p>
        </div>

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-inter">
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                label="Nama Depan"
                type="text"
                icon={User}
                placeholder="Nama depan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, firstName: true }))}
                error={errors.firstName}
                disabled={isLoading}
              />
              <AuthInput
                label="Nama Belakang"
                type="text"
                icon={User}
                placeholder="Nama belakang"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, lastName: true }))}
                error={errors.lastName}
                disabled={isLoading}
              />
            </div>

            <AuthInput
              label="Username"
              type="text"
              icon={User}
              placeholder="username_anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
              error={errors.username}
              disabled={isLoading}
            />

            <AuthInput
              label="Email"
              type="email"
              icon={Mail}
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
              error={errors.email}
              disabled={isLoading}
            />

            <AuthInput
              label="Nomor Telepon"
              type="tel"
              icon={Phone}
              placeholder="08123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
              error={errors.phone}
              disabled={isLoading}
            />

            <AuthInput
              label="Password"
              isPassword
              icon={Lock}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
              error={errors.password}
              disabled={isLoading}
            />

            <AuthInput
              label="Konfirmasi Password"
              isPassword
              icon={Lock}
              placeholder="Ketik ulang password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-inter font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="font-inter text-xs text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors">
                Login di sini
              </Link>
            </p>
          </div>
        </div>

        <Link href="/" className="mt-4 font-inter text-xs text-gray-600 hover:text-gray-800 transition-colors">
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}
