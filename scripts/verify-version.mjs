import { readFileSync } from 'node:fs'

const tag = process.argv[2]

if (!tag) {
  console.error('Usage: node scripts/verify-version.mjs <tag>')
  process.exit(1)
}

const tagVersion = tag.startsWith('v') ? tag.slice(1) : tag
const packageVersion = JSON.parse(readFileSync('package.json', 'utf8')).version

if (tagVersion !== packageVersion) {
  console.error(
    `Version mismatch: tag "${tag}" (${tagVersion}) does not match package.json (${packageVersion}).\n` +
      'Run "npm run release:minor" (or patch/major) instead of creating tags manually.'
  )
  process.exit(1)
}

console.log(`Version verified: v${packageVersion}`)
