import Image from "next/image";
import Link from "next/link";
import NavigationBar from "@/components/ui/navigationBar";

export default function Home() {
  return (
    <div className="relative w-full bg-white">
      {/* Hero Section */}
      <section className="relative h-[983px] w-full overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bali.jpg"
            alt="Destinasi Wisata Bali"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/44" />
        
        {/* Navigation Bar */}
        <div className="relative z-10">
          <NavigationBar />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-[165px] pt-[235px]">
          <p className="font-[family-name:var(--font-poppins)] text-white text-[20px] font-bold uppercase mb-[43px]">
            Destinasi Terbaik di Seluruh Indonesia
          </p>
          <h1 className="font-[family-name:var(--font-volkhov)] text-white text-[84px] font-bold leading-[89px] tracking-[-3.36px] mb-[50px]">
            Travel, nikmati<br />
            dan jalani hidup<br />
            yang baru
          </h1>
          <Link 
            href="/explore"
            className="inline-flex items-center justify-center bg-white rounded-full px-10 py-5 hover:bg-gray-100 transition-all duration-300 shadow-2xl border-4 border-white"
          >
            <span className="font-[family-name:var(--font-poppins)] text-[#14183e] text-[22px] font-extrabold uppercase tracking-wider">
              Jelajahi Sekarang
            </span>
          </Link>
        </div>
        
        {/* Traveller Image */}
        <div className="absolute right-[37px] top-[125px] w-[679px] h-[764px]">
          <Image
            src="/traveller.png"
            alt="Traveller"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-[212px] bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Services Section */}
      <section className="py-[56px] px-[49px]">
        <h2 className="font-[family-name:var(--font-volkhov)] text-[#14183e] text-[50px] font-bold text-center mb-[111px] capitalize">
          Kami Menawarkan Layanan Terbaik
        </h2>
        
        <div className="grid grid-cols-4 gap-[54px] mb-[55px]">
          {/* Study Tour */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/study-tour.jpg"
              alt="Study Tour"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Study Tour
            </p>
          </div>

          {/* Family Gathering */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/family-gathering.jpg"
              alt="Family Gathering"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Family Gathering
            </p>
          </div>

          {/* Outbound */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/outbound.jpg"
              alt="Outbound"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Outbound
            </p>
          </div>

          {/* Company Gathering */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/company-gathering.jpg"
              alt="Company Gathering"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Company Gathering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[54px]">
          {/* Event Organizer */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/event-organizer.jpg"
              alt="Event Organizer"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Event Organizer
            </p>
          </div>

          {/* Study Campus */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/study-campus.jpg"
              alt="Study Campus"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Study Campus
            </p>
          </div>

          {/* Sewa Kendaraan */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/vehicle-rental.jpg"
              alt="Sewa ELF, HIACE, BUS"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase leading-[1.2]">
              Sewa ELF, HIACE,<br />Bus Medium, BigBus
            </p>
          </div>

          {/* Reservasi Hotel */}
          <div className="relative h-[285px] rounded-[30px] overflow-hidden group cursor-pointer">
            <Image
              src="/hotel.jpg"
              alt="Reservasi Hotel"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/50" />
            <p className="font-[family-name:var(--font-poppins)] absolute bottom-[30px] left-0 right-0 text-center text-white text-[20px] font-bold uppercase">
              Reservasi Hotel
            </p>
          </div>
        </div>
      </section>

      {/* Top Destination Section */}
      <section className="py-[93px] px-[88px]">
        <h2 className="font-[family-name:var(--font-volkhov)] text-[#14183e] text-[50px] font-bold text-center mb-[143px] capitalize">
          Top Destinasi
        </h2>
        
        <div className="flex gap-[14px] items-start">
          {/* Left Card - Featured */}
          <div className="flex-1 bg-[rgba(217,217,217,0.48)] rounded-[20px] shadow-lg p-[40px] min-h-[484px]">
            <h3 className="font-[family-name:var(--font-volkhov)] text-black text-[64px] font-bold leading-[89px] tracking-[-2.56px] mb-[46px]">
              Jelajahi beragam destinasi<br />
              menakjubkan di seluruh<br />
              indonesia
            </h3>
            <Link 
              href="/destinations"
              className="inline-flex items-center justify-center bg-[#14183e] hover:bg-[#1a1f4d] border-2 border-[#14183e] rounded-full px-8 py-4 transition-all duration-300 shadow-lg"
            >
              <span className="font-[family-name:var(--font-poppins)] text-white text-[20px] font-bold uppercase tracking-wide">
                Jelajahi Sekarang
              </span>
            </Link>
          </div>
          
          {/* Right placeholder for image/content */}
          <div className="w-[552px]">
            {/* Additional content can be added here */}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-[93px] px-[41px]">
        <h2 className="font-[family-name:var(--font-volkhov)] text-[#14183e] text-[50px] font-bold text-center mb-[129px] capitalize">
          Momen-momen yang diabadikan oleh peserta kami
        </h2>
        
        <div className="grid grid-cols-4 gap-[16px]">
          <div className="h-[262px] rounded-[20px] border border-black overflow-hidden">
            <Image
              src="/gallery-1.jpg"
              alt="Gallery 1"
              width={388}
              height={262}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="h-[262px] rounded-[20px] bg-[rgba(217,217,217,0.48)]" />
          <div className="h-[262px] rounded-[20px] bg-[rgba(217,217,217,0.48)]" />
          <div className="h-[262px] rounded-[20px] bg-[rgba(217,217,217,0.48)]" />
        </div>
      </section>
    </div>
  );
}
