import LandingNavbar from "@/components/landing/LandingNavbar";
import PackageCatalog from "@/components/landing/PackageCatalog";
import Footer from "@/components/landing/Footer";

export default function PaketTourPage() {
  return (
    <div className="relative w-full bg-white">
      <LandingNavbar />
      <PackageCatalog />
      <Footer />
    </div>
  );
}
