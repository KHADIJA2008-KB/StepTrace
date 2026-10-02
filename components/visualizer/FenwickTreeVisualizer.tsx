'use client'

import { useId } from 'react'

type FenwickTreeVisualizerProps = {
  values: number[]
  tree: number[]
  activeInternalIndex?: number | null
  previousInternalIndex?: number | null
  visitedInternalIndices?: number[]
  queryRange?: [number, number] | null
  updatedArrayIndex?: number | null
  runningSum?: number | null
  isQuerying?: boolean
}

const CELL_WIDTH = 64
const CELL_GAP = 8

export function FenwickTreeVisualizer({
  values,
  tree,
  activeInternalIndex,
  previousInternalIndex,
  visitedInternalIndices = [],
  queryRange,
  updatedArrayIndex,
  runningSum,
  isQuerying = false,
}: FenwickTreeVisualizerProps) {
  const markerId = useId().replace(/:/g, '')
  const internalLength = Math.max(values.length, tree.length - 1)
  const rowWidth = internalLength * (CELL_WIDTH + CELL_GAP) - CELL_GAP
  const visited = new Set(visitedInternalIndices)
  const canDrawJump = previousInternalIndex !== null
    && previousInternalIndex !== undefined
    && activeInternalIndex !== null
    && activeInternalIndex !== undefined
    && previousInternalIndex !== activeInternalIndex
  const arrowStart = canDrawJump ? (previousInternalIndex - 1) * (CELL_WIDTH + CELL_GAP) + CELL_WIDTH / 2 : 0
  const arrowEnd = canDrawJump ? (activeInternalIndex - 1) * (CELL_WIDTH + CELL_GAP) + CELL_WIDTH / 2 : 0
  const arrowMid = (arrowStart + arrowEnd) / 2
  const arcHeight = Math.max(18, Math.min(38, Math.abs(arrowEnd - arrowStart) * 0.22))

  return (
    <div className="space-y-7">
      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Array · user-facing indices are 0-based</h2>
          {updatedArrayIndex !== null && updatedArrayIndex !== undefined && <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Updating array index {updatedArrayIndex}</span>}
          {queryRange && <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Query range [{queryRange[0]}, {queryRange[1]}]</span>}
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {values.length > 0 ? values.map((value, index) => {
              const inRange = queryRange && index >= queryRange[0] && index <= queryRange[1]
              const updated = updatedArrayIndex === index
              return (
                <div key={index} className={`grid h-16 w-16 shrink-0 grid-rows-[1fr_auto] place-items-center rounded-lg border transition-all duration-300 ${updated ? 'scale-105 border-amber-400 bg-amber-100 text-amber-950 ring-2 ring-amber-300 dark:bg-amber-950 dark:text-amber-100' : inRange ? 'border-emerald-400 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}>
                  <span className="self-end font-mono text-lg font-bold">{value}</span>
                  <span className="self-center font-mono text-[10px] text-slate-400">{index}</span>
                </div>
              )
            }) : <p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700">Build a Fenwick tree to show the array.</p>}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Internal structure · 1-indexed</h2>
          {isQuerying && runningSum !== null && runningSum !== undefined && <span className="rounded-full bg-teal-50 px-3 py-1 font-mono text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">Running total: {runningSum}</span>}
        </div>
        {internalLength > 0 ? (
          <div className="overflow-x-auto pb-2">
            <div className="relative min-w-max pt-9" style={{ width: rowWidth }}>
              {canDrawJump && (
                <svg className="pointer-events-none absolute left-0 top-0 h-9 overflow-visible" width={rowWidth} height="36" aria-hidden="true">
                  <defs>
                    <marker id={`fenwick-arrow-${markerId}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto" viewBox="0 0 7 7">
                      <path d="M 0 0 L 7 3.5 L 0 7 z" fill="#0f766e" />
                    </marker>
                  </defs>
                  <path
                    key={`${previousInternalIndex}-${activeInternalIndex}`}
                    d={`M ${arrowStart} 28 Q ${arrowMid} ${28 - arcHeight} ${arrowEnd} 28`}
                    fill="none"
                    stroke="#0f766e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    markerEnd={`url(#fenwick-arrow-${markerId})`}
                    pathLength="1"
                    className="animate-fenwick-jump"
                  />
                </svg>
              )}
              <div className="flex gap-2">
                {Array.from({ length: internalLength }, (_, offset) => {
                  const index = offset + 1
                  const isActive = activeInternalIndex === index
                  const isVisited = visited.has(index)
                  return (
                    <div key={index} className={`grid h-16 w-16 shrink-0 grid-rows-[1fr_auto] place-items-center rounded-lg border transition-all duration-300 ${isActive ? 'scale-105 border-teal-500 bg-teal-100 text-teal-950 ring-2 ring-teal-300 dark:bg-teal-950 dark:text-teal-100' : isVisited ? 'border-teal-300 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/60 dark:text-teal-200' : 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}>
                      <span className="self-end font-mono text-lg font-bold">{tree[index] ?? 0}</span>
                      <span className="self-center font-mono text-[10px] text-slate-400">i={index}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : <p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-sm text-slate-500 dark:border-slate-700">Internal positions will appear here after build.</p>}
      </div>
    </div>
  )
}