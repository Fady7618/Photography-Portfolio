/**
 * Starts a file download without navigating the current page away.
 * Uses a hidden iframe so same-origin URLs with Content-Disposition: attachment
 * trigger the browser download UI reliably (unlike window.location.href).
 */
export function triggerFileDownload(url: string): void {
  const iframe = document.createElement('iframe')
  iframe.style.cssText =
    'position:fixed;width:0;height:0;border:0;visibility:hidden;pointer-events:none'
  iframe.src = url
  document.body.appendChild(iframe)
  window.setTimeout(() => {
    iframe.remove()
  }, 120_000)
}
