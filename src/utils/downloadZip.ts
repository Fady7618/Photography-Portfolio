export async function downloadSessionZip(token: string, clientName: string): Promise<void> {
  const res = await fetch(`/api/gallery/download-zip?token=${encodeURIComponent(token)}`)

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(data.error ?? 'Failed to prepare download')
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${clientName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-photos.zip`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
