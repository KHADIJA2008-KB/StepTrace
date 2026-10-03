import Link from 'next/link'

const categories = [
  { id: 'array', label: 'Array', description: 'A compact collection of values stored in order.', color: 'bg-cyan-500', href: '#array' },
  { id: 'stack', label: 'Stack', description: 'Last in, first out. Explore push and pop.', color: 'bg-violet-500', href: '/visualizer/stack/array' },
  { id: 'queue', label: 'Queue', description: 'First in, first out. Follow the line.', color: 'bg-amber-500', href: '/visualizer/queue/array' },
  { id: 'linked-list', label: 'Linked List', description: 'Trace connections between changing nodes.', color: 'bg-emerald-500', href: '/visualizer/linked-list/singly' },
  { id: 'tree', label: 'Tree', description: 'See hierarchy branch out from a root.', color: 'bg-rose-500', href: '/visualizer/tree' },
  { id: 'graph', label: 'Graph', description: 'Understand networks through nodes and edges.', color: 'bg-blue-500', href: '/visualizer/graph' },
]

export default function VisualizerPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">The learning lab</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">See the structure behind the code.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">Choose a category to explore how data moves, changes, and connects. Every visualizer is designed to make the invisible feel tangible.</p>
      </div>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Data structure categories">
        {categories.map((category, index) => (
          <Link key={category.id} href={category.href} id={category.id} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-700 dark:hover:shadow-black/20">
            <div className={`h-2 w-12 rounded-full ${category.color}`} />
            <div className="mt-9 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">0{index + 1}</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{category.label}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{category.description}</p>
              </div>
              <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500">→</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-950 p-7 text-white dark:border-slate-800" aria-label="Algorithm collections">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Algorithm collections</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/visualizer/sorting/bubble" className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-teal-400 hover:text-slate-950">Sorting playground</Link>
          <Link href="/visualizer/searching/linear" className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-teal-400 hover:text-slate-950">Searching playground</Link>
          <Link href="/visualizer/quiz" className="rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-teal-400 hover:text-slate-950">Algorithm quizzes</Link>
        </div>
      </section>
    </div>
  )
}
