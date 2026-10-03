import Link from 'next/link'
import { StepTraceMark } from '@/components/StepTraceMark'

const links = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
]

export function MarketingHeader() {
  return (
    <header className="border-b border-[#29443a] bg-[#07130f] px-5 text-[#f1f5eb] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4 sm:flex-nowrap sm:py-3">
        <Link href="/" className="order-0 flex shrink-0 items-center gap-3" aria-label="StepTrace home">
          <StepTraceMark />
          <span className="whitespace-nowrap font-semibold tracking-tight">StepTrace</span>
        </Link>

        <nav className="order-3 flex w-full items-center justify-between gap-3 text-xs sm:order-2 sm:w-auto sm:justify-end sm:gap-5 sm:text-sm" aria-label="Homepage navigation">
          {links.map((link) => <Link key={link.label} href={link.href} className="text-[#a8bdb1] transition hover:text-lime-200">{link.label}</Link>)}
        </nav>

        <Link href="/visualizer" className="order-2 inline-flex min-h-9 shrink-0 items-center justify-center rounded-md bg-lime-300 px-4 text-xs font-semibold text-[#101b12] transition hover:bg-lime-200 sm:order-3 sm:text-sm">
          Get Started
        </Link>
      </div>
    </header>
  )
}