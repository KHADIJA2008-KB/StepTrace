import Link from 'next/link'

const repositoryUrl = 'https://github.com/KHADIJA2008-KB/DSA-VISUALIZER'
const profileUrl = 'https://github.com/KHADIJA2008-KB'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#203b30] bg-[#06100d] px-6 text-[#e8efe7] sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-16 lg:py-14">
        <div className="max-w-sm">
          <Link href="/" className="font-semibold tracking-tight text-[#f1f5eb] hover:text-lime-200">StepTrace</Link>
          <p className="mt-3 text-sm leading-6 text-[#91a99b]">Learn data structures by seeing each algorithm step unfold.</p>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#91a99b]">Navigation</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="text-[#c0cec3] transition hover:text-lime-200">Home</Link></li>
            <li><Link href="/#features" className="text-[#c0cec3] transition hover:text-lime-200">Features</Link></li>
            <li><Link href="/visualizer" className="text-[#c0cec3] transition hover:text-lime-200">Visualizer</Link></li>
            <li><a href={profileUrl} target="_blank" rel="noreferrer" className="text-[#c0cec3] transition hover:text-lime-200">GitHub</a></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#91a99b]">Connect</h2>
          <a href={repositoryUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-[#c0cec3] transition hover:text-lime-200">
            View the GitHub repository <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/[0.08] py-4 text-xs text-[#788f82] sm:flex-row sm:items-center sm:justify-between">
        <p>Made by Khadija</p>
        <p>© {year} StepTrace</p>
      </div>
    </footer>
  )
}