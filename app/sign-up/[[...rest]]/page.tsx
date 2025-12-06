'use client'

import { useSignUp, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const router = useRouter()

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn) {
      router.push('/')
    }
  }, [isSignedIn, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return
    setError('') // Clear previous errors

    try {
      // Create the sign up
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        ...(username && { username }), // Only include username if provided and enabled in Clerk
      })

      console.log('Sign up created:', result)

      // Only prepare verification if sign up was successful
      if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
        setPendingVerification(true)
      } else {
        // Handle other statuses
        setError('Unexpected sign up status: ' + result.status)
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      const errorMessage = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Sign up failed'
      
      // Handle rate limit specifically
      if (err.status === 429 || errorMessage.includes('rate limit')) {
        setError('Terlalu banyak percobaan. Silakan tunggu beberapa menit dan coba lagi.')
      } else if (err.status === 403) {
        setError('Akses ditolak. Silakan gunakan email yang berbeda atau tunggu beberapa saat.')
      } else {
        setError(errorMessage)
      }
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded) return

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed')
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/login-background.jpg"
          alt="Sign Up Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/24" />

      {/* Clerk CAPTCHA Element - Must be outside form container */}
      <div id="clerk-captcha" className="hidden"></div>

      {/* Sign Up Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
        <div className="backdrop-blur-md bg-white/30 rounded-[28px] w-[531px] px-12 py-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/login-logo.png"
              alt="PP Tour Travel Logo"
              width={96}
              height={132}
              style={{ width: 'auto', height: 'auto' }}
              className="object-contain"
            />
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className="font-[family-name:var(--font-poppins)] font-extrabold text-[24px] text-black leading-[1.5]">
              Selamat datang Pelanggan<br />
              PP TOUR TRAVEL
            </h2>
          </div>

          {/* Sign Up Title */}
          <h1 className="font-[family-name:var(--font-inter)] font-extrabold text-[56px] text-black text-center mb-8">
            {pendingVerification ? 'Verify' : 'Sign Up'}
          </h1>

          {!pendingVerification ? (
            /* Sign Up Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name Field */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Masukkan nama depan anda"
                  className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none"
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Masukkan nama belakang anda"
                  className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none"
                  required
                />
              </div>

              {/* Username Field */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username anda"
                  className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat E-mail anda"
                  className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password anda"
                    className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-[#f4a336] hover:bg-[#e09530] text-black font-[family-name:var(--font-inter)] font-bold text-[17px] py-3.5 rounded-[10px] transition-colors"
              >
                Sign Up
              </button>
            </form>
          ) : (
            /* Verification Form */
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Masukkan kode verifikasi"
                  className="bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] px-5 py-3.5 text-[15px] border-none outline-none"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-[#f4a336] hover:bg-[#e09530] text-black font-[family-name:var(--font-inter)] font-bold text-[17px] py-3.5 rounded-[10px] transition-colors"
              >
                Verify Email
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="font-[family-name:var(--font-inter)] font-medium text-[15px] text-white inline">
              Sudah punya akun?{' '}
            </p>
            <Link 
              href="/login"
              className="font-[family-name:var(--font-inter)] font-semibold italic text-[15px] text-[#00d9ff] hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
