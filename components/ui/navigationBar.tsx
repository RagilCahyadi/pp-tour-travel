import Link from 'next/link'
import Image from 'next/image'

const imgLogo = "/Logo_Transparent_White.png"

export default function NavigationBar() {
  return (
    <nav className="w-full bg-[rgba(255,255,255,0.02)] py-3 px-7">
      <div className="max-w-[1408px] mx-auto flex items-center justify-between h-[73px]">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="relative w-[53px] h-[73px]">
            <Image
              src={imgLogo}
              alt="PP Tour Travel Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <p className="font-[family-name:var(--font-poppins)] font-extrabold text-[24px] text-white whitespace-nowrap">
            PP TOUR TRAVEL
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-[26.569px]">
          <Link 
            href="/"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal border-b border-white hover:opacity-100 transition-opacity"
          >
            Home
          </Link>
          <Link 
            href="/paket"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Paket
          </Link>
          <Link 
            href="/tentang"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Tentang
          </Link>
          <Link 
            href="/kontak"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-normal hover:opacity-100 transition-opacity"
          >
            Kontak
          </Link>
          <Link 
            href="/login"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-bold hover:opacity-100 transition-opacity"
          >
            Log In
          </Link>
          <Link 
            href="/sign-up"
            className="font-[family-name:var(--font-inter)] px-[8.856px] py-[8.856px] text-white opacity-70 text-[17.712px] font-bold hover:opacity-100 transition-opacity"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )
}
