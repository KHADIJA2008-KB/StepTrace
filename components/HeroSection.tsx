import Link from 'next/link'

const concepts = [
  { label: 'O(1)', className: 'hero-float-one left-[8%] top-[12%] text-lime-200/80' },
  { label: 'Stack', className: 'hero-float-two right-[7%] top-[20%] text-cyan-200/80' },
  { label: 'Queue', className: 'hero-float-three bottom-[24%] left-[4%] text-amber-200/80' },
  { label: 'Tree', className: 'hero-float-four bottom-[13%] left-[47%] text-emerald-200/80' },
  { label: 'Graph', className: 'hero-float-five right-[6%] top-[67%] text-sky-200/80 hidden sm:inline-flex' },
  { label: 'HashMap', className: 'hero-float-six bottom-[8%] right-[23%] text-rose-200/80 hidden sm:inline-flex' },
]

function TreePreview() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[440px]" aria-label="Binary search tree visualization">
      <div className="absolute left-1/2 top-2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7e9b8d]">BST / insert 56</div>

      <div className="absolute left-1/2 top-[17%] h-px w-[30%] origin-left rotate-[137deg] bg-[#527065]/80" />
      <div className="absolute left-1/2 top-[17%] h-px w-[30%] origin-left rotate-[43deg] bg-[#527065]/80" />
      <div className="absolute left-[28%] top-[43%] h-px w-[29%] origin-left rotate-[119deg] bg-[#527065]/80" />
      <div className="absolute left-[28%] top-[43%] h-px w-[29%] origin-left rotate-[61deg] bg-[#527065]/80" />
      <div className="absolute left-[72%] top-[43%] h-px w-[29%] origin-left rotate-[61deg] bg-[#527065]/80" />

      <div className="absolute left-1/2 top-[17%] grid size-12 -translate-x-1/2 place-items-center rounded-full border border-lime-300/60 bg-[#10251d] font-mono text-sm font-semibold text-lime-100 shadow-[0_0_28px_rgba(190,242,100,0.08)]">42</div>
      <div className="absolute left-[28%] top-[43%] grid size-11 -translate-x-1/2 place-items-center rounded-full border border-[#4c7463] bg-[#0d201a] font-mono text-xs text-[#c1d7ca]">24</div>
      <div className="absolute left-[72%] top-[43%] grid size-11 -translate-x-1/2 place-items-center rounded-full border border-cyan-300/50 bg-[#10251d] font-mono text-xs text-cyan-100">68</div>
      <div className="absolute left-[14%] top-[75%] grid size-10 -translate-x-1/2 place-items-center rounded-full border border-[#4c7463] bg-[#0d201a] font-mono text-[11px] text-[#c1d7ca]">12</div>
      <div className="absolute left-[42%] top-[75%] grid size-10 -translate-x-1/2 place-items-center rounded-full border border-[#4c7463] bg-[#0d201a] font-mono text-[11px] text-[#c1d7ca]">36</div>
      <div className="absolute left-[86%] top-[75%] grid size-10 -translate-x-1/2 place-items-center rounded-full border border-[#4c7463] bg-[#0d201a] font-mono text-[11px] text-[#c1d7ca]">81</div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-[#69877a]">42 <span className="text-lime-300">→ 68 → 56</span> · compare · branch · insert</div>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-112px)] overflow-hidden bg-[#07130f] text-[#f1f5eb] sm:min-h-[calc(100svh-120px)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#29443a]" />

      {concepts.map((concept) => (
        <span key={concept.label} aria-hidden="true" className={`pointer-events-none absolute z-10 hidden rounded-full border border-white/10 bg-[#102019]/80 px-3 py-1.5 font-mono text-xs tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:inline-flex ${concept.className}`}>
          {concept.label}
        </span>
      ))}
      <span aria-hidden="true" className="hero-float-one pointer-events-none absolute left-[5%] top-[1%] z-10 inline-flex rounded-full border border-white/10 bg-[#102019]/80 px-2.5 py-1 font-mono text-[11px] text-lime-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.16)] sm:hidden">O(1)</span>
      <span aria-hidden="true" className="hero-float-two pointer-events-none absolute right-[5%] top-[8%] z-10 inline-flex rounded-full border border-white/10 bg-[#102019]/80 px-2.5 py-1 font-mono text-[11px] text-cyan-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.16)] sm:hidden">Stack</span>
      <span aria-hidden="true" className="hero-float-three pointer-events-none absolute bottom-[7%] left-[6%] z-10 inline-flex rounded-full border border-white/10 bg-[#102019]/80 px-2.5 py-1 font-mono text-[11px] text-amber-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.16)] sm:hidden">Queue</span>
      <span aria-hidden="true" className="hero-float-four pointer-events-none absolute bottom-[6%] right-[7%] z-10 inline-flex rounded-full border border-white/10 bg-[#102019]/80 px-2.5 py-1 font-mono text-[11px] text-emerald-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.16)] sm:hidden">Tree</span>

      <div className="relative mx-auto grid min-h-[inherit] max-w-7xl items-center gap-8 px-6 py-20 sm:px-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-14">
        <div className="relative z-20 max-w-2xl">
          <Link href="/visualizer/graph" className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-medium tracking-wide text-emerald-100 transition hover:border-emerald-200/40 hover:bg-emerald-200/10">
            <span className="size-1.5 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.7)]" />
            New: Graphs &amp; Trees now live
          </Link>

          <h1 className="mt-7 max-w-[14ch] !text-5xl !font-semibold !leading-[1.04] !tracking-[-0.045em] !text-[#f1f5eb] sm:!text-6xl lg:!text-[4.4rem]">
            Master DSA through interactive visualization.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#a8bdb1] sm:text-lg">
            Build data structures, step through algorithms, and see each operation change the data.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link href="/visualizer" className="inline-flex min-h-12 items-center justify-center rounded-md bg-lime-300 px-6 text-sm font-semibold text-[#101b12] shadow-[0_8px_30px_rgba(190,242,100,0.12)] transition hover:bg-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200">
              Get Started <span aria-hidden="true" className="ml-3 text-lg">→</span>
            </Link>
            <span className="text-xs font-medium text-[#82988c]">No login required</span>
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-5">
            <div>
              <p className="font-mono text-2xl font-semibold text-[#e4ede2]">40+</p>
              <p className="mt-1 text-xs text-[#80968b]">algorithms &amp; operations</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold text-[#e4ede2]">7</p>
              <p className="mt-1 text-xs text-[#80968b]">core modules</p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold text-[#e4ede2]">1</p>
              <p className="mt-1 text-xs text-[#80968b]">step at a time</p>
            </div>
          </div>
        </div>

        <div className="relative z-0 mx-auto w-full max-w-xl lg:mt-5">
          <TreePreview />
        </div>
      </div>
    </section>
  )
}