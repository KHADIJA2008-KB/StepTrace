import Link from 'next/link'

const sections = [
  {
    title: 'Core',
    description: 'Explore tree walks, search operations, and balancing strategies.',
    cards: [
      { title: 'Traversals', description: 'Animate preorder, inorder, postorder, level-order, and Morris inorder.', href: '/visualizer/tree/traversal', accent: 'bg-rose-500' },
      { title: 'Binary Search Tree', description: 'Insert, search, and delete while values branch by comparison.', href: '/visualizer/tree/bst', accent: 'bg-cyan-500' },
      { title: 'AVL Tree', description: 'Watch strict height balancing restore shape with rotations.', href: '/visualizer/tree/avl', accent: 'bg-teal-500' },
      { title: 'Red-Black Tree', description: 'Follow recolors and rotations that preserve color rules.', href: '/visualizer/tree/red-black', accent: 'bg-red-600' },
    ],
  },
  {
    title: 'Advanced Structures',
    description: 'Build prefix indexes and range-query structures.',
    cards: [
      { title: 'Trie', description: 'Trace words character by character through shared prefixes.', href: '/visualizer/tree/trie', accent: 'bg-amber-500' },
      { title: 'Segment Tree', description: 'Query sums over ranges and watch updates flow to ancestors.', href: '/visualizer/tree/segment-tree', accent: 'bg-emerald-500' },
      { title: 'Fenwick Tree', description: 'Follow binary-indexed jumps for updates and prefix sums.', href: '/visualizer/tree/fenwick-tree', accent: 'bg-blue-500' },
    ],
  },
  {
    title: 'Algorithms & Applications',
    description: 'Explore tree relationships, representations, and tree-based algorithms.',
    cards: [
      { title: 'Lowest Common Ancestor', description: 'Find where two root-to-node paths last share an ancestor.', href: '/visualizer/tree/lca', accent: 'bg-fuchsia-500' },
      { title: 'Tree Diameter', description: 'Calculate subtree heights and highlight the longest route.', href: '/visualizer/tree/diameter', accent: 'bg-orange-500' },
      { title: 'Isomorphism', description: 'Compare tree structure independently of node values.', href: '/visualizer/tree/isomorphism', accent: 'bg-lime-600' },
      { title: 'Serialize / Deserialize', description: 'Turn a tree into preorder tokens and rebuild it step by step.', href: '/visualizer/tree/serialize', accent: 'bg-indigo-500' },
      { title: 'Heap Sort', description: 'Build a max-heap, extract maxima, and track the sorted tail.', href: '/visualizer/tree/heap-sort', accent: 'bg-sky-500' },
      { title: 'Huffman Coding', description: 'Merge the lowest frequencies into a prefix-code tree.', href: '/visualizer/tree/huffman', accent: 'bg-pink-500' },
    ],
  },
]

export default function TreeIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree laboratory</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Choose a tree to explore.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">From traversals and balancing to compression and range queries, follow how each tree organizes information.</p>
      </header>

      <div className="mt-12 space-y-12">
        {sections.map((section, sectionIndex) => (
          <section key={section.title} aria-labelledby={`tree-section-${sectionIndex}`}>
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
              <h2 id={`tree-section-${sectionIndex}`} className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
              <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{section.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.cards.map((card, cardIndex) => (
                <Link key={card.href} href={card.href} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-700 dark:hover:shadow-black/20">
                  <div className={`h-1.5 w-10 rounded-full ${card.accent}`} />
                  <div className="mt-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{String(cardIndex + 1).padStart(2, '0')}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{card.description}</p>
                    </div>
                    <span aria-hidden="true" className="mt-4 text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}