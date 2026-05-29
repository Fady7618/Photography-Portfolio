import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { sessionStoragePath } from '@/lib/session-storage'
import { AuthService } from '@/services/auth.service'
import { AppError } from '@/lib/api-helpers'

const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/tiff',
]

export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const { folderPath, fileName, fileType } = (await req.json()) as {
      folderPath?: string
      fileName?: string
      fileType?: string
    }

    if (!folderPath || !fileName) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!fileType || !IMAGE_TYPES.includes(fileType)) {
      return NextResponse.json({ skipped: true, reason: 'Not an image' })
    }

    const supabase = createServiceRoleClient()
    const originalPath = sessionStoragePath(folderPath, 'originals', fileName)
    const thumbnailPath = sessionStoragePath(folderPath, 'thumbnails', fileName)
    const compressedPath = sessionStoragePath(folderPath, 'compressed', fileName)

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('sessions')
      .download(originalPath)

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: downloadError?.message || 'Download failed' },
        { status: 500 }
      )
    }

    const buffer = Buffer.from(await fileData.arrayBuffer())

    // Resize to both sizes in parallel — both operate on the same in-memory buffer
    const [thumbnailBuffer, compressedBuffer] = await Promise.all([
      sharp(buffer)
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer(),
      sharp(buffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer(),
    ])

    // Upload both variants in parallel
    const [thumbResult, compressedResult] = await Promise.all([
      supabase.storage.from('sessions').upload(thumbnailPath, thumbnailBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      }),
      supabase.storage.from('sessions').upload(compressedPath, compressedBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      }),
    ])

    if (thumbResult.error) {
      return NextResponse.json({ error: thumbResult.error.message }, { status: 500 })
    }

    if (compressedResult.error) {
      return NextResponse.json({ error: compressedResult.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, thumbnailPath, compressedPath })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode })
    }
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
