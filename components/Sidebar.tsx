'use client'

import Link from 'next/link'
import { StepTraceMark } from '@/components/StepTraceMark'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState, type KeyboardEvent } from 'react'

type NavLink = { label: string; href: string; topics?: string }
type NavSection = { label: string; links: NavLink[] }
type NavGroup = { label: string; sections: NavSection[] }

const navigationGroups: NavGroup[] = [
  {
    label: 'Array',
    sections: [
      { label: 'Sorting', links: [
        { label: 'Bubble Sort', href: '/visualizer/sorting/bubble', topics: 'adjacent swap stable quadratic' },
        { label: 'Selection Sort', href: '/visualizer/sorting/selection', topics: 'minimum select quadratic' },
        { label: 'Insertion Sort', href: '/visualizer/sorting/insertion', topics: 'shift stable nearly sorted' },
        { label: 'Merge Sort', href: '/visualizer/sorting/merge', topics: 'divide conquer stable' },
        { label: 'Quick Sort', href: '/visualizer/sorting/quick', topics: 'partition pivot' },
      ] },
      { label: 'Searching', links: [
        { label: 'Linear Search', href: '/visualizer/searching/linear', topics: 'sequential scan' },
        { label: 'Binary Search', href: '/visualizer/searching/binary', topics: 'sorted half interval' },
      ] },
      { label: 'Overview', links: [
        { label: 'Array Concepts', href: '/visualizer#array', topics: 'index contiguous collection' },
      ] },
    ],
  },
  {
    label: 'Stack',
    sections: [{ label: 'Stack Operations', links: [
      { label: 'Array Stack', href: '/visualizer/stack/array', topics: 'push pop peek' },
      { label: 'Linked-List Stack', href: '/visualizer/stack/linked-list', topics: 'push pop lifo' },
      { label: 'Postfix Evaluator', href: '/visualizer/stack/postfix', topics: 'reverse polish notation expression' },
      { label: 'Prefix Evaluator', href: '/visualizer/stack/prefix', topics: 'polish notation expression' },
    ] }],
  },
  {
    label: 'Queue',
    sections: [{ label: 'Queue Operations', links: [
      { label: 'Array Queue', href: '/visualizer/queue/array', topics: 'enqueue dequeue fifo' },
      { label: 'Linked-List Queue', href: '/visualizer/queue/linked-list', topics: 'head tail enqueue dequeue' },
      { label: 'Circular Queue', href: '/visualizer/queue/circular', topics: 'ring buffer wraparound' },
      { label: 'Deque', href: '/visualizer/queue/deque', topics: 'double ended front back' },
      { label: 'Priority Queue', href: '/visualizer/queue/priority', topics: 'priority enqueue dequeue' },
    ] }],
  },
  {
    label: 'Linked List',
    sections: [
      { label: 'List Structures', links: [
        { label: 'Singly Linked List', href: '/visualizer/linked-list/singly', topics: 'next pointer' },
        { label: 'Doubly Linked List', href: '/visualizer/linked-list/doubly', topics: 'previous next pointers' },
        { label: 'Circular Linked List', href: '/visualizer/linked-list/circular', topics: 'circular singly doubly' },
        { label: 'Linked-List Operations', href: '/visualizer/linked-list/operations', topics: 'insert delete search' },
      ] },
      { label: 'Algorithms', links: [
        { label: 'Reverse a List', href: '/visualizer/linked-list/reverse', topics: 'pointer reversal' },
        { label: 'Merge Sorted Lists', href: '/visualizer/linked-list/merge', topics: 'merge order' },
        { label: 'Compare Lists', href: '/visualizer/linked-list/compare', topics: 'equality matching' },
      ] },
    ],
  },
  {
    label: 'Tree',
    sections: [
      { label: 'Core Trees', links: [
        { label: 'Tree Overview', href: '/visualizer/tree', topics: 'tree laboratory' },
        { label: 'Traversals', href: '/visualizer/tree/traversal', topics: 'preorder inorder postorder level order morris' },
        { label: 'Binary Search Tree', href: '/visualizer/tree/bst', topics: 'BST insert delete search' },
        { label: 'AVL Tree', href: '/visualizer/tree/avl', topics: 'balanced rotations' },
        { label: 'Red-Black Tree', href: '/visualizer/tree/red-black', topics: 'color rotations balanced' },
        { label: 'Tree Comparison', href: '/visualizer/tree/compare', topics: 'BST AVL compare' },
      ] },
      { label: 'Tree Algorithms', links: [
        { label: 'Tree Diameter', href: '/visualizer/tree/diameter', topics: 'longest path height' },
        { label: 'Lowest Common Ancestor', href: '/visualizer/tree/lca', topics: 'LCA shared ancestor' },
        { label: 'Tree Isomorphism', href: '/visualizer/tree/isomorphism', topics: 'matching structure' },
        { label: 'Serialize / Deserialize', href: '/visualizer/tree/serialize', topics: 'encoding parsing' },
        { label: 'Heap Sort', href: '/visualizer/tree/heap-sort', topics: 'max heap extract' },
        { label: 'Huffman Coding', href: '/visualizer/tree/huffman', topics: 'compression prefix code' },
      ] },
      { label: 'Specialized Trees', links: [
        { label: 'Segment Tree', href: '/visualizer/tree/segment-tree', topics: 'range sum query update' },
        { label: 'Fenwick Tree', href: '/visualizer/tree/fenwick-tree', topics: 'binary indexed prefix sum' },
        { label: 'Trie', href: '/visualizer/tree/trie', topics: 'prefix words insert search' },
      ] },
    ],
  },
  {
    label: 'Graph',
    sections: [
      { label: 'Build & Traverse', links: [
        { label: 'Graph Overview', href: '/visualizer/graph', topics: 'networks nodes edges' },
        { label: 'Graph Builder', href: '/visualizer/graph/builder', topics: 'adjacency matrix list' },
        { label: 'BFS / DFS Traversal', href: '/visualizer/graph/traversal', topics: 'breadth depth queue stack' },
      ] },
      { label: 'Graph Algorithms', links: [
        { label: "Dijkstra's Algorithm", href: '/visualizer/graph/dijkstra', topics: 'shortest path weighted distance' },
        { label: "Prim's & Kruskal's MST", href: '/visualizer/graph/mst', topics: 'minimum spanning tree union find' },
        { label: 'Topological Sort', href: '/visualizer/graph/topological-sort', topics: 'Kahn in degree cycle DAG' },
      ] },
    ],
  },
  {
    label: 'Quizzes',
    sections: [
      { label: 'Quiz Index', links: [{ label: 'All Quizzes', href: '/visualizer/quiz', topics: 'quiz practice knowledge check' }] },
      { label: 'By Topic', links: [
        { label: 'Sorting Quiz', href: '/visualizer/quiz/sorting' },
        { label: 'Searching Quiz', href: '/visualizer/quiz/searching' },
        { label: 'Stack Quiz', href: '/visualizer/quiz/stack' },
        { label: 'Queue Quiz', href: '/visualizer/quiz/queue' },
        { label: 'Linked List Quiz', href: '/visualizer/quiz/linked-list' },
        { label: 'Tree Quiz', href: '/visualizer/quiz/tree' },
        { label: 'Graph Quiz', href: '/visualizer/quiz/graph' },
      ] },
    ],
  },
]

const overviewLink: NavLink = { label: 'Overview', href: '/visualizer', topics: 'home all visualizers' }
const complexityLink: NavLink = { label: 'Complexity Cheat Sheet', href: '/visualizer/complexity', topics: 'Big O time space growth' }
const searchEntries = [overviewLink, complexityLink, ...navigationGroups.flatMap((group) => group.sections.flatMap((section) => section.links))]

function scoreWord(query: string, word: string) {
  const exactIndex = word.indexOf(query)
  if (exactIndex >= 0) return 120 + (exactIndex === 0 ? 30 : 0) - exactIndex

  let queryIndex = 0
  let firstMatch = -1
  let previousMatch = -2
  let currentRun = 0
  let longestRun = 0
  for (let index = 0; index < word.length && queryIndex < query.length; index += 1) {
    if (word[index] !== query[queryIndex]) continue
    if (firstMatch < 0) firstMatch = index
    currentRun = index === previousMatch + 1 ? currentRun + 1 : 1
    longestRun = Math.max(longestRun, currentRun)
    previousMatch = index
    queryIndex += 1
  }
  if (queryIndex !== query.length) return -1
  return 35 + longestRun * 5 - (previousMatch - firstMatch - query.length + 1)
}

function matchScore(query: string, entry: NavLink) {
  const queryWords = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const words = `${entry.label} ${entry.topics ?? ''}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
  let total = 0

  for (const queryWord of queryWords) {
    const wordScore = Math.max(...words.map((word) => scoreWord(queryWord, word)))
    if (wordScore < 0) return -1
    total += wordScore
  }
  return total
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [desktopGroup, setDesktopGroup] = useState<string | null>(null)
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [activeResult, setActiveResult] = useState(0)

  const searchResults = useMemo(() => {
    const query = searchQuery.trim()
    if (!query) return []
    return searchEntries
      .map((entry) => ({ entry, score: matchScore(query, entry) }))
      .filter((result) => result.score >= 0)
      .sort((left, right) => right.score - left.score || left.entry.label.localeCompare(right.entry.label))
      .slice(0, 8)
      .map((result) => result.entry)
  }, [searchQuery])

  const showSearchResults = searchFocused && searchQuery.trim().length > 0
  const activeSearchGroup = navigationGroups.find((group) => group.label === desktopGroup)

  function isActive(href: string) {
    const route = href.split('#')[0]
    return route === pathname || (route !== '/visualizer' && pathname.startsWith(`${route}/`))
  }

  function groupIsActive(group: NavGroup) {
    return group.sections.some((section) => section.links.some((entry) => isActive(entry.href)))
  }

  function selectSearchResult(entry: NavLink) {
    router.push(entry.href)
    setSearchQuery('')
    setSearchFocused(false)
    setActiveResult(0)
    setDesktopGroup(null)
    setMobileOpen(false)
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setSearchFocused(false)
      setActiveResult(0)
      return
    }
    if (!showSearchResults || searchResults.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveResult((current) => (current + 1) % searchResults.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveResult((current) => (current - 1 + searchResults.length) % searchResults.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      selectSearchResult(searchResults[activeResult] ?? searchResults[0])
    }
  }

  function renderSectionLinks(section: NavSection, onSelect?: () => void) {
    return (
      <section key={section.label} aria-label={section.label}>
        <h3 className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">{section.label}</h3>
        <ul className="space-y-0.5">
          {section.links.map((entry) => (
            <li key={entry.href}>
              <Link href={entry.href} onClick={onSelect} className={`block rounded-md px-3 py-2 text-sm transition ${isActive(entry.href) ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}>
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="relative mx-auto max-w-7xl px-5 py-3 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <Link href="/visualizer" className="order-0 flex shrink-0 items-center gap-3">
            <StepTraceMark />
            <span className="whitespace-nowrap font-semibold tracking-tight text-slate-900 dark:text-white">StepTrace</span>
          </Link>

          <button type="button" onClick={() => setMobileOpen((value) => !value)} className="order-1 ml-auto rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200 sm:hidden" aria-expanded={mobileOpen} aria-label="Toggle navigation menu">
            {mobileOpen ? 'Close' : 'Menu'}
          </button>

          <div className="relative order-2 w-full sm:ml-auto sm:w-[min(42vw,24rem)]">
            <label htmlFor="site-search" className="sr-only">Search algorithms and topics</label>
            <input
              id="site-search"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showSearchResults && searchResults.length > 0}
              aria-controls="site-search-results"
              aria-activedescendant={showSearchResults && searchResults.length > 0 ? `site-search-option-${activeResult}` : undefined}
              value={searchQuery}
              onChange={(event) => { setSearchQuery(event.target.value); setActiveResult(0) }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search algorithms and topics"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            {showSearchResults && (
              <div className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-300/30 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30">
                {searchResults.length > 0 ? (
                  <ul id="site-search-results" role="listbox" aria-label="Search suggestions" className="max-h-[min(60vh,24rem)] overflow-y-auto p-1.5">
                    {searchResults.map((entry, index) => (
                      <li key={entry.href}>
                        <button
                          id={`site-search-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={index === activeResult}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selectSearchResult(entry)}
                          className={`w-full rounded-md px-3 py-2 text-left text-sm ${index === activeResult ? 'bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-100' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                        >
                          <span className="block font-medium">{entry.label}</span>
                          <span className="mt-0.5 block truncate text-xs text-slate-400">{entry.href}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p id="site-search-results" role="status" className="px-3 py-3 text-sm text-slate-500">No matching topics.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="mt-3 hidden items-center gap-1 overflow-x-auto border-t border-slate-100 pt-2 sm:flex dark:border-slate-800" aria-label="Main navigation">
          <Link href={overviewLink.href} className={`shrink-0 rounded-md px-3 py-2 text-sm transition ${isActive(overviewLink.href) ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{overviewLink.label}</Link>
          {navigationGroups.map((group) => {
            const expanded = desktopGroup === group.label
            return (
              <button key={group.label} type="button" aria-expanded={expanded} onClick={() => setDesktopGroup(expanded ? null : group.label)} className={`flex shrink-0 items-center gap-1 rounded-md px-3 py-2 text-sm transition ${groupIsActive(group) ? 'font-semibold text-teal-800 dark:text-teal-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'} ${expanded ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
                {group.label}<span aria-hidden="true" className="text-[10px]">{expanded ? '▲' : '▼'}</span>
              </button>
            )
          })}
          <Link href={complexityLink.href} className={`shrink-0 rounded-md px-3 py-2 text-sm transition ${isActive(complexityLink.href) ? 'bg-teal-50 font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{complexityLink.label}</Link>
        </nav>

        {activeSearchGroup && (
          <div className="absolute left-4 right-4 top-full z-[90] mt-2 max-h-[min(70vh,34rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-300/30 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/30 sm:left-8 sm:right-8">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {activeSearchGroup.sections.map((section) => renderSectionLinks(section, () => setDesktopGroup(null)))}
            </div>
          </div>
        )}

        {mobileOpen && (
          <nav className="mt-3 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2 sm:hidden dark:border-slate-800 dark:bg-slate-900" aria-label="Mobile navigation">
            <Link href={overviewLink.href} onClick={() => setMobileOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800">Overview</Link>
            {navigationGroups.map((group) => {
              const expanded = mobileGroup === group.label
              return (
                <section key={group.label} className="border-t border-slate-200 dark:border-slate-800">
                  <button type="button" aria-expanded={expanded} onClick={() => setMobileGroup(expanded ? null : group.label)} className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-white dark:text-slate-100 dark:hover:bg-slate-800">
                    {group.label}<span aria-hidden="true" className="text-[10px]">{expanded ? '▲' : '▼'}</span>
                  </button>
                  {expanded && <div className="grid gap-4 px-1 pb-3">{group.sections.map((section) => renderSectionLinks(section, () => setMobileOpen(false)))}</div>}
                </section>
              )
            })}
            <Link href={complexityLink.href} onClick={() => setMobileOpen(false)} className="block border-t border-slate-200 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800">{complexityLink.label}</Link>
          </nav>
        )}
      </div>
    </header>
  )
}
