'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { complexityData, type ComplexityEntry } from '@/lib/data/complexityData'

type SortKey = keyof ComplexityEntry
type SortDirection = 'asc' | 'desc'

const categories: ComplexityEntry['category'][] = [
  'Sorting',
  'Searching',
  'Stack',
  'Queue',
  'Linked List',
  'Tree',
  'Graph',
]

const columns: Array<{ key: SortKey; label: string }> = [
  { key: 'category', label: 'Category' },
  { key: 'name', label: 'Algorithm / Structure' },
  { key: 'timeBest', label: 'Best' },
  { key: 'timeAverage', label: 'Average' },
  { key: 'timeWorst', label: 'Worst' },
  { key: 'space', label: 'Space' },
  { key: 'notes', label: 'Notes' },
]

const growthSeries = [
  { label: 'O(1)', values: [0, 0, 0, 0], color: '#0f766e' },
  { label: 'O(log n)', values: [0, 1, 1.58, 2], color: '#2563eb' },
  { label: 'O(n)', values: [1, 2, 3, 4], color: '#c2410c' },
  { label: 'O(n log n)', values: [1, 3, 4.58, 6], color: '#7c3aed' },
  { label: 'O(n^2)', values: [2, 4, 6, 8], color: '#be123c' },
  { label: 'O(2^n)', values: [2, 4, 8, 16], color: '#4d7c0f' },
]

function BigOGrowthChart() {
  const xPositions = [145, 345, 545, 745]
  const yPosition = (value: number) => 260 - value * 12
  const ticks = [0, 4, 8, 12, 16]

  return (
    <section className="mt-10 border-y border-slate-200 py-6 dark:border-slate-800" aria-labelledby="growth-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">Reference chart</p>
          <h2 id="growth-heading" className="mt-1 text-xl font-bold text-slate-900 dark:text-white">Big-O growth</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Input sizes n = 2, 4, 8, 16; vertical axis is log2 operations.</p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <svg viewBox="0 0 880 310" role="img" aria-labelledby="growth-chart-title growth-chart-description" className="block w-full min-w-[620px]">
          <title id="growth-chart-title">Comparative Big-O growth chart</title>
          <desc id="growth-chart-description">A line chart comparing constant, logarithmic, linear, linearithmic, quadratic, and exponential growth as input size increases.</desc>
          {ticks.map((tick) => {
            const y = yPosition(tick)
            return (
              <g key={tick}>
                <line x1="120" y1={y} x2="770" y2={y} stroke="#cbd5e1" strokeDasharray="3 5" />
                <text x="108" y={y + 4} textAnchor="end" className="fill-slate-500 text-[11px]">{tick}</text>
              </g>
            )
          })}
          <line x1="120" y1="68" x2="120" y2="260" stroke="#64748b" />
          <line x1="120" y1="260" x2="770" y2="260" stroke="#64748b" />
          {xPositions.map((x, index) => (
            <g key={x}>
              <line x1={x} y1="260" x2={x} y2="265" stroke="#64748b" />
              <text x={x} y="282" textAnchor="middle" className="fill-slate-600 text-xs">{2 ** (index + 1)}</text>
            </g>
          ))}
          <text x="445" y="302" textAnchor="middle" className="fill-slate-500 text-[11px]">Input size n</text>
          <text x="24" y="164" textAnchor="middle" transform="rotate(-90 24 164)" className="fill-slate-500 text-[11px]">log2 operations</text>
          {growthSeries.map((series) => (
            <polyline
              key={series.label}
              points={series.values.map((value, index) => `${xPositions[index]},${yPosition(value)}`).join(' ')}
              fill="none"
              stroke={series.color}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {growthSeries.flatMap((series) => series.values.map((value, index) => (
            <circle key={`${series.label}-${index}`} cx={xPositions[index]} cy={yPosition(value)} r="3.5" fill={series.color} />
          )))}
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
        {growthSeries.map((series) => (
          <div key={series.label} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="h-0.5 w-5 shrink-0" style={{ backgroundColor: series.color }} />
            {series.label}
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ComplexityPage() {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('category')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const visibleEntries = useMemo(() => {
    const filtered = complexityData.filter((entry) => categoryFilter === 'all' || entry.category === categoryFilter)
    return filtered.sort((left, right) => {
      const leftValue = String(left[sortKey] ?? '')
      const rightValue = String(right[sortKey] ?? '')
      const compared = leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: 'base' })
      return sortDirection === 'asc' ? compared : -compared
    })
  }, [categoryFilter, sortDirection, sortKey])

  function updateSort(key: SortKey) {
    if (key === sortKey) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')
    else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">Reference</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Algorithm complexity.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Compare time and space costs across the algorithms and data structures in the learning lab.</p>
      </header>

      <BigOGrowthChart />

      <section className="mt-8" aria-label="Complexity table">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Complexity reference</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{visibleEntries.length} of {complexityData.length} entries</p>
          </div>
          <label className="grid gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-w-44 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              <option value="all">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                {columns.map((column) => (
                  <th key={column.key} scope="col" aria-sort={sortKey === column.key ? sortDirection === 'asc' ? 'ascending' : 'descending' : 'none'} className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300">
                    <button type="button" onClick={() => updateSort(column.key)} aria-label={`Sort by ${column.label}`} className="inline-flex items-center gap-1 whitespace-nowrap hover:text-teal-700 dark:hover:text-teal-300">
                      {column.label}
                      <span aria-hidden="true" className="text-teal-600 dark:text-teal-400">{sortKey === column.key ? sortDirection === 'asc' ? '↑' : '↓' : '↕'}</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleEntries.map((entry) => (
                <tr key={`${entry.category}-${entry.name}`} className="border-b border-slate-100 align-top hover:bg-teal-50/50 dark:border-slate-900 dark:hover:bg-slate-900/50">
                  <td className="px-3 py-3 font-medium text-slate-500 dark:text-slate-400">{entry.category}</td>
                  <th scope="row" className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{entry.name}</th>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{entry.timeBest ?? '—'}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{entry.timeAverage}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{entry.timeWorst}</td>
                  <td className="px-3 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">{entry.space}</td>
                  <td className="max-w-sm px-3 py-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{entry.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}