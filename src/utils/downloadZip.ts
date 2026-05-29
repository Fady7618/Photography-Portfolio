import { triggerFileDownload } from '@/utils/triggerFileDownload'

export function downloadSessionZip(token: string, _clientName: string): void {
  triggerFileDownload(`/api/gallery/download-zip?token=${encodeURIComponent(token)}`)
}
