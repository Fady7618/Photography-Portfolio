import { Facebook, Instagram, Youtube } from 'lucide-react'
import packageJson from '../../package.json'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Youtube },
] as const

const CURRENT_YEAR = new Date().getFullYear()

interface FooterProps {}

function Footer(_props: FooterProps = {}) {
  return (
    <footer className="w-full border-t-2 border-zinc-900 bg-orange-800 text-orange-100">
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-xs text-orange-200 sm:text-sm">
            &copy; {CURRENT_YEAR} FUJIFILM. All rights reserved.
          </p>
          <span className="rounded-full border border-orange-200/40 bg-orange-900/50 px-2.5 py-0.5 text-xs font-medium text-orange-100">
            v{packageJson.version}
          </span>
        </div>

        <p className="text-xl font-bold tracking-wider plasterFont sm:text-2xl">
          FUJIFILM
        </p>

        <nav
          className="flex items-center gap-3"
          aria-label="Social media links"
        >
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200/30 bg-orange-900/40 text-orange-100 transition-colors hover:bg-orange-100 hover:text-orange-800"
            >
              <Icon className="h-5 w-5" aria-hidden />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
