type FeatureKind = 'visualization' | 'coverage' | 'quiz'

type Feature = {
  kind: FeatureKind
  title: string
  description: string
  points: string[]
  accent: string
}

const features: Feature[] = [
  {
    kind: 'visualization',
    title: 'Interactive Visualizations',
    description: 'See what each algorithm does as it works through real data.',
    points: ['Step-by-step animations', 'Adjustable playback speed', 'Click-through controls'],
    accent: 'text-lime-200',
  },
  {
    kind: 'coverage',
    title: 'Comprehensive Coverage',
    description: 'Build from foundational structures to advanced graph algorithms.',
    points: ['Sorting · Searching · Stack · Queue', 'Linked List · Tree · Graph'],
    accent: 'text-cyan-200',
  },
  {
    kind: 'quiz',
    title: 'Test Your Knowledge',
    description: 'Turn each topic into a quick check of what you have learned.',
    points: ['Built-in quizzes for every topic', 'Instant answers and explanations', 'Score summary and retry'],
    accent: 'text-amber-200',
  },
]

function FeatureIcon({ kind }: { kind: FeatureKind }) {
  if (kind === 'visualization') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="size-6 stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h8M19 8h8M9 8v8m14-8v8M9 16h14M9 16v8m14-8v8M5 24h8m6 0h8" />
        <circle cx="5" cy="8" r="2" /><circle cx="27" cy="8" r="2" /><circle cx="9" cy="16" r="2" /><circle cx="23" cy="16" r="2" /><circle cx="5" cy="24" r="2" /><circle cx="27" cy="24" r="2" />
      </svg>
    )
  }

  if (kind === 'coverage') {
    return (
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="size-6 stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 6v7M16 13 8 21m8-8 8 8M8 21v5m16-5v5" />
        <circle cx="16" cy="5" r="2.5" /><circle cx="16" cy="13" r="2.5" /><circle cx="8" cy="21" r="2.5" /><circle cx="24" cy="21" r="2.5" /><circle cx="8" cy="27" r="2" /><circle cx="24" cy="27" r="2" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="size-6 stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 5.5h16a2.5 2.5 0 0 1 2.5 2.5v16a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 5.5 24V8A2.5 2.5 0 0 1 8 5.5Z" />
      <path d="M12.5 12a3.6 3.6 0 1 1 5.8 2.9c-1.1.8-2.3 1.4-2.3 3.1M16 22v.1" />
    </svg>
  )
}

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-[#29443a] bg-[#07130f] px-6 py-16 text-[#f1f5eb] sm:px-10 sm:py-20" aria-labelledby="features-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9bb99b]">Inside the lab</p>
            <h2 id="features-heading" className="mt-2 !text-2xl !font-semibold !tracking-tight !text-[#f1f5eb] sm:!text-3xl">A clearer way to learn algorithms.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#91a99b]">Explore the idea, watch it unfold, then check what stuck.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.kind} className="group rounded-xl border border-[#203b30] bg-[#0a1914] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#7a9b70]/70 hover:shadow-[0_16px_36px_rgba(0,0,0,0.18)] sm:p-6">
              <div className={`grid size-11 place-items-center rounded-lg border border-white/10 bg-[#10251d] ${feature.accent}`}>
                <FeatureIcon kind={feature.kind} />
              </div>
              <h3 className="mt-5 !text-lg !font-semibold !text-[#edf4e9]">{feature.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-[#9bb0a3]">{feature.description}</p>
              <ul className="mt-4 space-y-2 border-t border-white/[0.07] pt-4">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-xs leading-5 text-[#b5c5b9]">
                    <span aria-hidden="true" className={`mt-[7px] size-1 shrink-0 rounded-full ${feature.kind === 'visualization' ? 'bg-lime-300' : feature.kind === 'coverage' ? 'bg-cyan-300' : 'bg-amber-300'}`} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}