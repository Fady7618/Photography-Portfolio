// NOTE: Vercel free tier has a 60-second function timeout.
// Sessions with 100+ large files may exceed this limit.
// Upgrade to Vercel Pro (300s timeout) for large session support.
// Alternative: implement zip-by-folder for very large sessions.
export const runtime = 'nodejs'

import { NextRequest } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { sessionStoragePath } from '@/lib/session-storage'
import { AppError, handleApiError } from '@/lib/api-helpers'
import { ZipArchive } from 'archiver'
import { PassThrough } from 'stream'

const CONCURRENCY = 5

async function fetchFileBuffer(
  supabase: ReturnType<typeof createServiceRoleClient>,
  filePath: string,
  fileName: string
): Promise<{ name: string; buffer: Buffer } | null> {
  try {
    const { data, error } = await supabase.storage.from('sessions').download(filePath)
    if (error || !data) {
      console.warn(`[download-zip] skipping ${fileName}:`, error?.message)
      return null
    }
    return { name: fileName, buffer: Buffer.from(await data.arrayBuffer()) }
  } catch (err) {
    console.warn(`[download-zip] error fetching ${fileName}:`, err)
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) throw new AppError('Token required', 400)

    const supabase = createServiceRoleClient()

    const { data: session, error: sessionError } = await supabase
      .from('client_sessions')
      .select('folder_path, client_name, token_expires_at')
      .eq('access_token', token)
      .single()

    if (sessionError || !session) throw new AppError('Invalid token', 401)

    if (session.token_expires_at && new Date(session.token_expires_at) < new Date()) {
      throw new AppError('Link expired', 401)
    }

    const originalsFolder = sessionStoragePath(session.folder_path, 'originals')

    const { data: fileList, error: listError } = await supabase.storage
      .from('sessions')
      .list(originalsFolder, { limit: 1000, sortBy: { column: 'name', order: 'asc' } })

    const entries = (fileList || []).filter(
      (f) => f.name && f.id !== null && !f.name.startsWith('.')
    )

    if (listError || !entries.length) {
      throw new AppError('No files found in this session', 404)
    }

    // Download all files in parallel with a concurrency limit
    const results: Array<{ name: string; buffer: Buffer }> = []
    for (let i = 0; i < entries.length; i += CONCURRENCY) {
      const batch = entries.slice(i, i + CONCURRENCY)
      const fetched = await Promise.all(
        batch.map((f) =>
          fetchFileBuffer(
            supabase,
            sessionStoragePath(session.folder_path, 'originals', f.name),
            f.name
          )
        )
      )
      for (const r of fetched) {
        if (r) results.push(r)
      }
    }

    if (!results.length) {
      throw new AppError('Could not fetch any files from this session', 500)
    }

    const zipName = `${session.client_name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-photos.zip`

    // Register listeners BEFORE finalize() to avoid a race where 'end' fires
    // before the Promise listener is attached (archiver can resolve synchronously).
    const pass = new PassThrough()
    const archive = new ZipArchive({ zlib: { level: 1 } })
    archive.pipe(pass)

    const chunks: Buffer[] = []
    const done = new Promise<void>((resolve, reject) => {
      pass.on('data', (chunk: Buffer) => chunks.push(chunk))
      pass.on('end', resolve)
      pass.on('error', reject)
      archive.on('error', reject)
    })

    for (const { name, buffer } of results) {
      archive.append(buffer, { name })
    }
    archive.finalize()

    // Collect the full zip buffer before sending (required for Vercel serverless)
    await done

    const zipBuffer = Buffer.concat(chunks)

    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${zipName}"`,
        'Content-Length': String(zipBuffer.byteLength),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
