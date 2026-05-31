/**
 * folder_path in DB must be the session slug only (e.g. "fady-1780056977584").
 * Legacy rows may still have a "sessions/" prefix — strip it before building storage paths.
 */
export function normalizeSessionFolderPath(folderPath: string): string {
  return folderPath.replace(/^sessions\//, '').replace(/^\/+/, '')
}

export function sessionStoragePath(
  folderPath: string,
  ...segments: string[]
): string {
  const base = normalizeSessionFolderPath(folderPath)
  return [base, ...segments].filter(Boolean).join('/')
}
