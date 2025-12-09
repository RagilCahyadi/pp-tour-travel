import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import TopDestinationsSection from "@/components/landing/TopDestinationsSection";
import WhyChooseUsSection from "@/components/landing/WhyChooseUsSection";
import HowToOrderSection from "@/components/landing/HowToOrderSection";
import ServicesSection from "@/components/landing/ServicesSection";
import MomentsSection from "@/components/landing/MomentsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="relative w-full bg-white">
      {/* Navigation Bar */}
      <LandingNavbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Top Destinations Section */}
      <TopDestinationsSection />

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* How To Order Section */}
      <HowToOrderSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Moments Section */}
      <MomentsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
