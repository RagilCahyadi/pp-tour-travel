'use client'

import { useSignIn, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { isSignedIn } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
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

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Login failed')
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/login-background.jpg"
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/24" />

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
        <div className="backdrop-blur-md bg-white/30 rounded-[28px] w-[531px] px-12 py-10 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/login-logo.png"
              alt="PP Tour Travel Logo"
              width={96}
              height={132}
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

          {/* Login Title */}
          <h1 className="font-[family-name:var(--font-inter)] font-extrabold text-[56px] text-black text-center mb-8">
            Login
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email or Username Field */}
            <div className="flex flex-col gap-2">
              <label className="font-[family-name:var(--font-inter)] font-semibold text-[18px] text-black">
                Email atau Username
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email atau Username anda"
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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#f4a336] hover:bg-[#e09530] text-black font-[family-name:var(--font-inter)] font-bold text-[17px] py-3.5 rounded-[10px] transition-colors"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="font-[family-name:var(--font-inter)] font-medium text-[15px] text-white inline">
              Belum punya Akun?, silahkan{' '}
            </p>
            <Link 
              href="/sign-up"
              className="font-[family-name:var(--font-inter)] font-semibold italic text-[15px] text-[#00d9ff] hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}