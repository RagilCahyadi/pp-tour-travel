// =====================================================
// PP TOUR TRAVEL - DATABASE TYPES FOR SUPABASE
// =====================================================
// Auto-generated types for TypeScript integration
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // 1. Users Table
      users: {
        Row: {
          id: string
          email_address: string | null
          username: string | null
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          phone_number: string | null
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
          banned_at: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          email_address?: string | null
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          banned_at?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          email_address?: string | null
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          phone_number?: string | null
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          banned_at?: string | null
          is_admin?: boolean
        }
      }

      // 2. Admin Profiles Table
      admin_profiles: {
        Row: {
          id: string
          user_id: string
          nama: string
          hak_akses: string
          negara: string
          kota: string | null
          alamat: string | null
          email: string | null
          nomor_hp: string | null
          bahasa: string
          zona_waktu: string
          foto_profil_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          nama: string
          hak_akses?: string
          negara?: string
          kota?: string | null
          alamat?: string | null
          email?: string | null
          nomor_hp?: string | null
          bahasa?: string
          zona_waktu?: string
          foto_profil_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          nama?: string
          hak_akses?: string
          negara?: string
          kota?: string | null
          alamat?: string | null
          email?: string | null
          nomor_hp?: string | null
          bahasa?: string
          zona_waktu?: string
          foto_profil_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 3. Company Settings Table
      company_settings: {
        Row: {
          id: string
          nama_perusahaan: string
          alamat_kantor: string | null
          telepon_kantor: string | null
          whatsapp_bisnis: string | null
          email_bisnis: string | null
          logo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_perusahaan?: string
          alamat_kantor?: string | null
          telepon_kantor?: string | null
          whatsapp_bisnis?: string | null
          email_bisnis?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_perusahaan?: string
          alamat_kantor?: string | null
          telepon_kantor?: string | null
          whatsapp_bisnis?: string | null
          email_bisnis?: string | null
          logo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 4. Notification Preferences Table
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          email_enabled: boolean
          booking_baru: boolean
          pembayaran: boolean
          laporan_mingguan: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email_enabled?: boolean
          booking_baru?: boolean
          pembayaran?: boolean
          laporan_mingguan?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email_enabled?: boolean
          booking_baru?: boolean
          pembayaran?: boolean
          laporan_mingguan?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 5. Tour Packages Table
      tour_packages: {
        Row: {
          id: string
          nama_paket: string
          deskripsi: string | null
          lokasi: string
          durasi: string
          tipe_paket: 'Premium' | 'Ekonomis'
          harga: number
          minimal_penumpang: number
          gambar_url: string | null
          brosur_url: string | null
          nama_daerah: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama_paket: string
          deskripsi?: string | null
          lokasi: string
          durasi: string
          tipe_paket: 'Premium' | 'Ekonomis'
          harga: number
          minimal_penumpang?: number
          gambar_url?: string | null
          brosur_url?: string | null
          nama_daerah?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama_paket?: string
          deskripsi?: string | null
          lokasi?: string
          durasi?: string
          tipe_paket?: 'Premium' | 'Ekonomis'
          harga?: number
          minimal_penumpang?: number
          gambar_url?: string | null
          brosur_url?: string | null
          nama_daerah?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }

      // 6. Customers Table
      customers: {
        Row: {
          id: string
          user_id: string | null
          nama_pelanggan: string
          nama_perusahaan: string | null
          email: string | null
          nomor_telepon: string | null
          alamat: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          nama_pelanggan: string
          nama_perusahaan?: string | null
          email?: string | null
          nomor_telepon?: string | null
          alamat?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          nama_pelanggan?: string
          nama_perusahaan?: string | null
          email?: string | null
          nomor_telepon?: string | null
          alamat?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 7. Bookings Table
      bookings: {
        Row: {
          id: string
          kode_booking: string
          customer_id: string
          package_id: string
          jumlah_pax: number
          tanggal_keberangkatan: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          catatan: string | null
          booking_token: string | null
          total_biaya: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode_booking: string
          customer_id: string
          package_id: string
          jumlah_pax?: number
          tanggal_keberangkatan?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          catatan?: string | null
          booking_token?: string | null
          total_biaya?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode_booking?: string
          customer_id?: string
          package_id?: string
          jumlah_pax?: number
          tanggal_keberangkatan?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          catatan?: string | null
          booking_token?: string | null
          total_biaya?: number | null
          created_at?: string
          updated_at?: string
        }
      }

      // 8. Cancellation Requests Table
      cancellation_requests: {
        Row: {
          id: string
          booking_id: string
          status: 'pending' | 'processing' | 'approved' | 'rejected'
          alasan: string | null
          catatan_admin: string | null
          processed_by: string | null
          processed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          status?: 'pending' | 'processing' | 'approved' | 'rejected'
          alasan?: string | null
          catatan_admin?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          status?: 'pending' | 'processing' | 'approved' | 'rejected'
          alasan?: string | null
          catatan_admin?: string | null
          processed_by?: string | null
          processed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 9. Payments Table
      payments: {
        Row: {
          id: string
          booking_id: string
          jumlah_pembayaran: number
          metode_pembayaran: string | null
          status: 'pending' | 'verified' | 'rejected'
          bukti_pembayaran_url: string | null
          catatan_verifikasi: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          jumlah_pembayaran: number
          metode_pembayaran?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          bukti_pembayaran_url?: string | null
          catatan_verifikasi?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          jumlah_pembayaran?: number
          metode_pembayaran?: string | null
          status?: 'pending' | 'verified' | 'rejected'
          bukti_pembayaran_url?: string | null
          catatan_verifikasi?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 10. Schedules Table
      schedules: {
        Row: {
          id: string
          kode_jadwal: string
          booking_id: string | null
          package_id: string
          nama_instansi: string | null
          tanggal_keberangkatan: string
          waktu_keberangkatan: string | null
          status: 'aktif' | 'tidak-aktif' | 'selesai'
          catatan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          kode_jadwal: string
          booking_id?: string | null
          package_id: string
          nama_instansi?: string | null
          tanggal_keberangkatan: string
          waktu_keberangkatan?: string | null
          status?: 'aktif' | 'tidak-aktif' | 'selesai'
          catatan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          kode_jadwal?: string
          booking_id?: string | null
          package_id?: string
          nama_instansi?: string | null
          tanggal_keberangkatan?: string
          waktu_keberangkatan?: string | null
          status?: 'aktif' | 'tidak-aktif' | 'selesai'
          catatan?: string | null
          created_at?: string
          updated_at?: string
        }
      }

      // 11. Active Sessions Table
      active_sessions: {
        Row: {
          id: string
          user_id: string
          device_name: string | null
          device_type: string | null
          browser: string | null
          location: string | null
          ip_address: string | null
          session_token: string | null
          last_active_at: string
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          device_name?: string | null
          device_type?: string | null
          browser?: string | null
          location?: string | null
          ip_address?: string | null
          session_token?: string | null
          last_active_at?: string
          is_current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          device_name?: string | null
          device_type?: string | null
          browser?: string | null
          location?: string | null
          ip_address?: string | null
          session_token?: string | null
          last_active_at?: string
          is_current?: boolean
          created_at?: string
        }
      }

      // 12. Activity Logs Table
      activity_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }

    Views: {
      dashboard_stats: {
        Row: {
          booking_bulan_ini: number
          pendapatan_bulan_ini: number
          menunggu_verifikasi: number
          keberangkatan_minggu_ini: number
        }
      }
      payment_status_summary: {
        Row: {
          sudah_dibayar: number
          menunggu_verifikasi: number
        }
      }
      popular_packages_month: {
        Row: {
          nama_paket: string
          lokasi: string
          total_booking: number
        }
      }
      recent_bookings: {
        Row: {
          id: string
          kode_booking: string
          nama_pelanggan: string
          nama_paket: string
          jumlah_pax: number
          status: string
          created_at: string
        }
      }
      upcoming_departures: {
        Row: {
          id: string
          kode_jadwal: string
          nama_paket: string
          tanggal_keberangkatan: string
          waktu_keberangkatan: string | null
          nama_instansi: string | null
          jumlah_pax: number | null
        }
      }
    }

    Functions: {
      generate_booking_code: {
        Args: Record<string, never>
        Returns: string
      }
      generate_schedule_code: {
        Args: {
          package_name: string
          departure_date: string
        }
        Returns: string
      }
    }

    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      payment_status: 'pending' | 'verified' | 'rejected'
      schedule_status: 'aktif' | 'tidak-aktif' | 'selesai'
      cancellation_status: 'pending' | 'processing' | 'approved' | 'rejected'
      package_type: 'Premium' | 'Ekonomis'
    }
  }
}

// =====================================================
// TYPE ALIASES FOR EASIER USE
// =====================================================

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']
export type AdminProfileInsert = Database['public']['Tables']['admin_profiles']['Insert']
export type AdminProfileUpdate = Database['public']['Tables']['admin_profiles']['Update']

export type CompanySettings = Database['public']['Tables']['company_settings']['Row']
export type CompanySettingsInsert = Database['public']['Tables']['company_settings']['Insert']
export type CompanySettingsUpdate = Database['public']['Tables']['company_settings']['Update']

export type NotificationPreferences = Database['public']['Tables']['notification_preferences']['Row']
export type NotificationPreferencesInsert = Database['public']['Tables']['notification_preferences']['Insert']
export type NotificationPreferencesUpdate = Database['public']['Tables']['notification_preferences']['Update']

export type TourPackage = Database['public']['Tables']['tour_packages']['Row']
export type TourPackageInsert = Database['public']['Tables']['tour_packages']['Insert']
export type TourPackageUpdate = Database['public']['Tables']['tour_packages']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Booking = Database['public']['Tables']['bookings']['Row']
export type BookingInsert = Database['public']['Tables']['bookings']['Insert']
export type BookingUpdate = Database['public']['Tables']['bookings']['Update']

export type CancellationRequest = Database['public']['Tables']['cancellation_requests']['Row']
export type CancellationRequestInsert = Database['public']['Tables']['cancellation_requests']['Insert']
export type CancellationRequestUpdate = Database['public']['Tables']['cancellation_requests']['Update']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export type Schedule = Database['public']['Tables']['schedules']['Row']
export type ScheduleInsert = Database['public']['Tables']['schedules']['Insert']
export type ScheduleUpdate = Database['public']['Tables']['schedules']['Update']

export type ActiveSession = Database['public']['Tables']['active_sessions']['Row']
export type ActiveSessionInsert = Database['public']['Tables']['active_sessions']['Insert']
export type ActiveSessionUpdate = Database['public']['Tables']['active_sessions']['Update']

export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert']
export type ActivityLogUpdate = Database['public']['Tables']['activity_logs']['Update']

// View Types
export type DashboardStats = Database['public']['Views']['dashboard_stats']['Row']
export type PaymentStatusSummary = Database['public']['Views']['payment_status_summary']['Row']
export type PopularPackage = Database['public']['Views']['popular_packages_month']['Row']
export type RecentBooking = Database['public']['Views']['recent_bookings']['Row']
export type UpcomingDeparture = Database['public']['Views']['upcoming_departures']['Row']

// =====================================================
// EXTENDED TYPES WITH RELATIONS
// =====================================================

export interface BookingWithRelations extends Booking {
  customer: Customer
  package: TourPackage
  payments?: Payment[]
  schedule?: Schedule
  cancellation_request?: CancellationRequest
}

export interface PaymentWithRelations extends Payment {
  booking: BookingWithRelations
}

export interface ScheduleWithRelations extends Schedule {
  booking?: Booking
  package: TourPackage
}

export interface CancellationRequestWithRelations extends CancellationRequest {
  booking: BookingWithRelations
}
