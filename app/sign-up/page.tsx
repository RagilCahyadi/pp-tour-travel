'use client'

import { SignUp } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
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

      {/* Sign Up Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen py-12">
        <div className="backdrop-blur-md bg-white/30 rounded-[28px] w-[531px] p-12 shadow-2xl">
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
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-poppins)] font-extrabold text-[24px] text-black leading-[1.5]">
              Selamat datang Pelanggan<br />
              PP TOUR TRAVEL
            </h2>
          </div>

          {/* Sign Up Title */}
          <h1 className="font-[family-name:var(--font-inter)] font-extrabold text-[56px] text-black text-center mb-12">
            Sign Up
          </h1>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-white/50 hover:bg-white/70 border border-gray-300",
                  formButtonPrimary: "bg-[#f4a336] hover:bg-[#e09530] text-black font-bold",
                  formFieldInput: "bg-[#b1b1b1] text-white placeholder:text-white/70 rounded-[10px] border-none",
                  formFieldLabel: "text-black font-semibold text-[18px] font-[family-name:var(--font-inter)]",
                  footerActionLink: "text-[#00d9ff] font-semibold italic",
                  footerActionText: "text-white font-medium",
                }
              }}
              redirectUrl="/"
              signInUrl="/login"
            />
          </div>

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
