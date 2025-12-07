import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Customer {
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

export interface CreateCustomerData {
  nama_pelanggan: string
  nama_perusahaan?: string
  email?: string
  nomor_telepon?: string
  alamat?: string
  user_id?: string
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCustomers(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCustomer = async (customerData: CreateCustomerData) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData as any])
        .select()
        .single()

      if (error) throw error
      await fetchCustomers()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error creating customer:', err)
      return { data: null, error: err.message }
    }
  }

  const updateCustomer = async (id: string, customerData: Partial<CreateCustomerData>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customerData as any)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchCustomers()
      return { data, error: null }
    } catch (err: any) {
      console.error('Error updating customer:', err)
      return { data: null, error: err.message }
    }
  }

  const deleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchCustomers()
      return { error: null }
    } catch (err: any) {
      console.error('Error deleting customer:', err)
      return { error: err.message }
    }
  }

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}
