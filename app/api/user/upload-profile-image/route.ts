import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const filename = `profile-${userId}-${timestamp}.${fileExtension}`

    // Save to public/images/profiles directory
    const publicPath = join(process.cwd(), 'public', 'images', 'profiles')
    const filePath = join(publicPath, filename)

    // Create directory if it doesn't exist
    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      console.error('File write error:', error)
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      )
    }

    // Return the public URL
    const imageUrl = `/images/profiles/${filename}`

    // Update user profile in database
    const supabase = createServerSupabaseClient()
    await supabase
      .from('users')
      .update({ profile_image_url: imageUrl })
      .eq('id', userId)

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
