import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FeaturedTourPackage } from '@/lib/types/tour-packages';

// Mapping highlights untuk setiap destinasi
const packageHighlights: { [key: string]: string[] } = {
  'Bali': [
    'Pantai Melasti',
    'GWK',
    'Kecak Dance GWK'
  ],
  'Yogyakarta': [
    'Pantai Parangtritis',
    'Jeep Lava Tour Merapi',
    'Studio Alam Gamplong'
  ],
  'Bandung': [
    'Kawah Putih Ciwidey',
    'Tangkuban Perahu',
    'Asia Afrika'
  ]
};

export function useFeaturedTourPackages() {
  const [packages, setPackages] = useState<FeaturedTourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedPackages() {
      try {
        // Query paket Premium yang aktif dengan booking count
        const { data: packagesData, error: packagesError } = await supabase
          .from('tour_packages')
          .select(`
            *,
            bookings(id)
          `)
          .eq('tipe_paket', 'Premium')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (packagesError) {
          console.warn('Error fetching tour packages:', packagesError);
          throw packagesError;
        }

        if (packagesData && packagesData.length > 0) {
          const featuredPackages: FeaturedTourPackage[] = packagesData.map((pkg: any) => {
            const totalBookings = pkg.bookings?.length || 0;
            
            return {
              ...pkg,
              highlights: packageHighlights[pkg.lokasi] || [],
              isTerlaris: totalBookings > 0, // Tandai sebagai terlaris jika ada booking
              totalBookings
            };
          });

          setPackages(featuredPackages);
        } else {
          // Fallback data jika database kosong
          console.warn('No packages in database, using fallback data');
          setPackages(getFallbackPackages());
        }
      } catch (err) {
        console.warn('Error in useFeaturedTourPackages:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set fallback data pada error
        setPackages(getFallbackPackages());
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedPackages();
  }, []);

  return { packages, loading, error };
}

// Fallback data untuk development/testing
function getFallbackPackages(): FeaturedTourPackage[] {
  return [
    {
      id: '1',
      nama_paket: 'Paket Premium Bali',
      deskripsi: 'Eksplorasi keindahan Bali dengan fasilitas premium',
      lokasi: 'Bali',
      durasi: '4 Hari 2 Malam',
      tipe_paket: 'Premium',
      harga: 1450000,
      minimal_penumpang: 50,
      gambar_url: '/images/landing/paket-bali.jpg',
      brosur_url: null,
      nama_daerah: 'Bali',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      highlights: packageHighlights['Bali'],
      isTerlaris: true,
      totalBookings: 45
    },
    {
      id: '2',
      nama_paket: 'Paket Premium Yogyakarta',
      deskripsi: 'Jelajahi budaya dan alam Yogyakarta',
      lokasi: 'Yogyakarta',
      durasi: '2 Hari 1 Malam',
      tipe_paket: 'Premium',
      harga: 750000,
      minimal_penumpang: 50,
      gambar_url: '/images/landing/paket-yogyakarta.jpg',
      brosur_url: null,
      nama_daerah: 'Yogyakarta',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      highlights: packageHighlights['Yogyakarta'],
      isTerlaris: true,
      totalBookings: 38
    },
    {
      id: '3',
      nama_paket: 'Paket Premium Bandung',
      deskripsi: 'Nikmati kesejukan kota kembang',
      lokasi: 'Bandung',
      durasi: '4 Hari Inap 2 Malam',
      tipe_paket: 'Premium',
      harga: 1490000,
      minimal_penumpang: 50,
      gambar_url: '/images/landing/paket-bandung.jpg',
      brosur_url: null,
      nama_daerah: 'Bandung',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      highlights: packageHighlights['Bandung'],
      isTerlaris: true,
      totalBookings: 32
    }
  ];
}
