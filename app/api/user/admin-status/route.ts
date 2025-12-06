import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ is_admin: false })
    }

    return NextResponse.json({ is_admin: data?.is_admin || false })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ is_admin: false })
  }
}
