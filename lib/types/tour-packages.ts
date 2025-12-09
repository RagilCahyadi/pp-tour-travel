export interface TourPackage {
  id: string;
  nama_paket: string;
  deskripsi: string | null;
  lokasi: string;
  durasi: string;
  tipe_paket: 'Premium' | 'Ekonomis';
  harga: number;
  minimal_penumpang: number;
  gambar_url: string | null;
  brosur_url: string | null;
  nama_daerah: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedTourPackage extends TourPackage {
  highlights: string[];
  isTerlaris: boolean;
  totalBookings?: number;
}
