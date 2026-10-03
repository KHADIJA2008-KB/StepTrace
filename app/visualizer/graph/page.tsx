import Link from 'next/link'

const cards = [
  { title: 'Graph Builder', description: 'Create nodes and edges while comparing adjacency matrix and list representations.', href: '/visualizer/graph/builder', accent: 'bg-cyan-500' },
  { title: 'BFS/DFS Traversal', description: 'Trace breadth-first queues and depth-first stacks as nodes are visited.', href: '/visualizer/graph/traversal', accent: 'bg-teal-500' },
  { title: "Dijkstra's Algorithm", description: 'Find shortest paths while distances are relaxed and finalized.', href: '/visualizer/graph/dijkstra', accent: 'bg-blue-500' },
  { title: "Prim's & Kruskal's MST", description: 'Build a minimum spanning tree by growing a frontier or sorting edges.', href: '/visualizer/graph/mst', accent: 'bg-orange-500' },
  { title: 'Topological Sort', description: 'Order directed dependencies and detect cycles with in-degree tracking.', href: '/visualizer/graph/topological-sort', accent: 'bg-rose-500' },
]

export default function GraphIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Graph laboratory</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Choose a graph to explore.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Build networks, trace graph algorithms, and see how nodes and edges organize information.</p>
      </header>

      <div className="mt-12 space-y-12">
        <section aria-labelledby="graph-section">
          <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
            <h2 id="graph-section" className="text-2xl font-bold text-slate-900 dark:text-white">Algorithms & Applications</h2>
            <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Explore graph construction, traversal, shortest paths, spanning trees, and dependency ordering.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <Link key={card.href} href={card.href} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-700 dark:hover:shadow-black/20">
                <div className={`h-1.5 w-10 rounded-full ${card.accent}`} />
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{String(index + 1).padStart(2, '0')}</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{card.description}</p>
                  </div>
                  <span aria-hidden="true" className="mt-4 text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}