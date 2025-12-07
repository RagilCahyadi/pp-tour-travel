# Supabase Integration Documentation

## Setup

### 1. Environment Variables

Add the following to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup

Run the SQL schema in Supabase SQL Editor:
```bash
# Copy contents from database/schema.sql and paste in Supabase SQL Editor
```

## Available Hooks

### useDashboard
Fetch dashboard statistics, recent bookings, and upcoming departures.

```tsx
import { useDashboard } from '@/lib/hooks/useDashboard'

function DashboardPage() {
  const { stats, recentBookings, upcomingDepartures, loading, error, refetch } = useDashboard()
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h1>Booking Bulan Ini: {stats?.booking_bulan_ini}</h1>
      {/* ... */}
    </div>
  )
}
```

### useTourPackages
CRUD operations for tour packages.

```tsx
import { useTourPackages } from '@/lib/hooks/useTourPackages'

function PackagesPage() {
  const { 
    packages, 
    loading, 
    error, 
    createPackage, 
    updatePackage, 
    deletePackage,
    toggleActiveStatus 
  } = useTourPackages()
  
  const handleCreate = async () => {
    const { data, error } = await createPackage({
      nama_paket: 'Paket Bali',
      lokasi: 'Bali, Indonesia',
      durasi: '3 Hari 2 Malam',
      tipe_paket: 'Premium',
      harga: 1500000,
      minimal_penumpang: 30
    })
    
    if (error) console.error(error)
    else console.log('Package created:', data)
  }
  
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>{pkg.nama_paket}</div>
      ))}
    </div>
  )
}
```

### useBookings
CRUD operations for bookings with customer and package details.

```tsx
import { useBookings } from '@/lib/hooks/useBookings'

function BookingsPage() {
  const { 
    bookings, 
    loading, 
    createBooking, 
    updateBookingStatus 
  } = useBookings('confirmed') // Filter by status
  
  const handleConfirm = async (id: string) => {
    const { error } = await updateBookingStatus(id, 'confirmed')
    if (error) console.error(error)
  }
  
  return (
    <div>
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.kode_booking} - {booking.customers.nama_pelanggan}
        </div>
      ))}
    </div>
  )
}
```

### usePayments
Payment verification and management.

```tsx
import { usePayments } from '@/lib/hooks/usePayments'

function PaymentsPage() {
  const { 
    payments, 
    loading, 
    verifyPayment, 
    rejectPayment 
  } = usePayments('pending')
  
  const handleVerify = async (id: string, userId: string) => {
    const { error } = await verifyPayment(id, userId, 'Pembayaran valid')
    if (error) console.error(error)
  }
  
  return (
    <div>
      {payments.map(payment => (
        <div key={payment.id}>
          {payment.bookings.kode_booking} - Rp {payment.jumlah_pembayaran}
        </div>
      ))}
    </div>
  )
}
```

### useSchedules
Schedule management with package and booking details.

```tsx
import { useSchedules } from '@/lib/hooks/useSchedules'

function SchedulesPage() {
  const { 
    schedules, 
    loading, 
    createSchedule, 
    updateScheduleStatus 
  } = useSchedules('aktif')
  
  return (
    <div>
      {schedules.map(schedule => (
        <div key={schedule.id}>
          {schedule.kode_jadwal} - {schedule.tour_packages.nama_paket}
        </div>
      ))}
    </div>
  )
}
```

### useCustomers
Customer management.

```tsx
import { useCustomers } from '@/lib/hooks/useCustomers'

function CustomersPage() {
  const { customers, loading, createCustomer } = useCustomers()
  
  const handleCreate = async () => {
    const { data, error } = await createCustomer({
      nama_pelanggan: 'John Doe',
      nama_perusahaan: 'ABC Corp',
      email: 'john@abc.com',
      nomor_telepon: '081234567890'
    })
  }
  
  return <div>{/* ... */}</div>
}
```

## Utility Functions

### Format Helpers

```tsx
import { 
  formatRupiah, 
  formatDate, 
  formatTime,
  getStatusColor,
  getStatusLabel 
} from '@/lib/utils/helpers'

// Format currency
formatRupiah(1500000) // "Rp 1.500.000"

// Format date
formatDate('2025-01-15') // "15 Januari 2025"

// Get status color for badges
getStatusColor('confirmed') // "bg-green-100 text-green-800"

// Get Indonesian status label
getStatusLabel('confirmed') // "Terkonfirmasi"
```

### Code Generators

```tsx
import { generateBookingCode, generateScheduleCode } from '@/lib/utils/helpers'

// Generate booking code
const code = generateBookingCode() // "ABCD123"

// Generate schedule code
const schedCode = generateScheduleCode('Paket Bali', new Date()) // "PAK15A"
```

### Validation

```tsx
import { isValidEmail, isValidPhone } from '@/lib/utils/helpers'

isValidEmail('test@example.com') // true
isValidPhone('081234567890') // true
```

## Error Handling

All hooks return errors in a consistent format:

```tsx
const { data, error } = await createPackage(packageData)

if (error) {
  // Show error to user
  alert(error)
  return
}

// Success - data contains the created record
console.log(data)
```

## Loading States

All hooks provide loading states:

```tsx
const { bookings, loading } = useBookings()

if (loading) {
  return <div>Loading...</div>
}

return <div>{/* Render bookings */}</div>
```

## Refetching Data

All hooks provide a refetch function:

```tsx
const { packages, refetch } = useTourPackages()

// Manually refetch data
const handleRefresh = () => {
  refetch()
}
```

## Real-time Updates (Optional)

To enable real-time updates, you can use Supabase subscriptions:

```tsx
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function BookingsPage() {
  const { bookings, refetch } = useBookings()
  
  useEffect(() => {
    // Subscribe to changes
    const subscription = supabase
      .channel('bookings-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, () => {
        // Refetch data when changes occur
        refetch()
      })
      .subscribe()
    
    // Cleanup
    return () => {
      subscription.unsubscribe()
    }
  }, [refetch])
  
  return <div>{/* ... */}</div>
}
```

## Example: Complete Page Implementation

```tsx
'use client'

import { useTourPackages } from '@/lib/hooks/useTourPackages'
import { formatRupiah, getStatusColor } from '@/lib/utils/helpers'
import { useState } from 'react'

export default function PackagesPage() {
  const { packages, loading, error, createPackage, deletePackage } = useTourPackages()
  const [showModal, setShowModal] = useState(false)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Tour Packages</h1>
      
      <button 
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Package
      </button>
      
      <div className="grid gap-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="border p-4 rounded">
            <h2 className="font-bold">{pkg.nama_paket}</h2>
            <p>{pkg.lokasi} - {pkg.durasi}</p>
            <p className="text-lg font-semibold">{formatRupiah(pkg.harga)}</p>
            <span className={`px-2 py-1 rounded text-sm ${getStatusColor(pkg.tipe_paket)}`}>
              {pkg.tipe_paket}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Notes

- All hooks automatically refetch data after mutations
- TypeScript types are fully supported
- Error handling is consistent across all hooks
- All monetary values are in Rupiah (IDR)
- Dates are formatted in Indonesian locale
