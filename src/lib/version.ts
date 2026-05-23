import packageJson from '../../package.json'

function normalizeVersion(version: string): string {
  return version.startsWith('v') ? version.slice(1) : version
}

export function getAppVersion(): string {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? packageJson.version
  return normalizeVersion(version)
}
