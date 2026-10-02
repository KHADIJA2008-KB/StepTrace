'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { computeHierarchyLayout, type TreeLayoutPosition } from '@/lib/algorithms/tree/treeLayout'
import type { SegNode } from '@/lib/algorithms/tree/segmentTree'

type SegmentTreeVisualizerProps = {
  values: number[]
  nodes: SegNode[]
  rootId: string
  queryRange?: [number, number] | null
  updatedIndex?: number | null
  highlightedNodeId?: string | null
  nodeStates?: Map<string, 'in-range' | 'partial' | 'out-of-range'>
}

const NODE_RADIUS = 31
const MIN_HORIZONTAL_GAP = 82
const MAX_HORIZONTAL_GAP = 132
const PADDING_X = 44
const PADDING_Y = 38

function positionFor(position: TreeLayoutPosition, horizontalGap: number) {
  return { x: PADDING_X + position.x * horizontalGap, y: PADDING_Y + position.y }
}

export function SegmentTreeVisualizer({
  values,
  nodes,
  rootId,
  queryRange,
  updatedIndex,
  highlightedNodeId,
  nodeStates = new Map(),
}: SegmentTreeVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const resize = () => setContainerWidth(container.clientWidth)
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const byId = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])
  const layout = useMemo(
    () => computeHierarchyLayout(nodes, rootId, (node) => [node.left, node.right].filter((id): id is string => id !== null)),
    [nodes, rootId],
  )
  const positionsById = useMemo(() => new Map(layout.map((position) => [position.id, position])), [layout])
  const maxX = layout.reduce((maximum, position) => Math.max(maximum, position.x), 0)
  const horizontalGap = Math.max(
    MIN_HORIZONTAL_GAP,
    Math.min(MAX_HORIZONTAL_GAP, (Math.max(containerWidth, 0) - PADDING_X * 2) / Math.max(maxX, 1)),
  )
  const positioned = layout.map((position) => ({
    node: byId.get(position.id),
    position: positionFor(position, horizontalGap),
  }))
  const width = Math.max(containerWidth, PADDING_X * 2 + maxX * horizontalGap)
  const height = PADDING_Y * 2 + (layout.reduce((maximum, position) => Math.max(maximum, position.y), 0) || 0)

  return (
    <div ref={containerRef} className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950" aria-label="Segment tree visualization">
      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-max items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Array</span>
          {values.length > 0 ? values.map((value, index) => {
            const isUpdated = updatedIndex === index
            const isQueried = queryRange !== null && queryRange !== undefined && index >= queryRange[0] && index <= queryRange[1]
            return (
              <div key={index} className={`grid size-14 shrink-0 grid-rows-[1fr_auto] place-items-center rounded-lg border transition-colors ${isUpdated ? 'border-amber-400 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100' : isQueried ? 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}>
                <span className="self-end font-mono text-lg font-bold">{value}</span>
                <span className="self-center font-mono text-[10px] text-slate-400">{index}</span>
              </div>
            )
          }) : <span className="text-sm text-slate-500">Build a tree from an array to begin.</span>}
        </div>
      </div>

      {layout.length > 0 ? (
        <div className="mt-3 overflow-x-auto border-t border-slate-200 pt-4 dark:border-slate-800">
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Segment tree ranges and sums" className="block min-w-full">
            {positioned.flatMap(({ node, position }) => {
              if (!node) return []
              return [node.left, node.right].flatMap((childId) => {
                if (!childId) return []
                const childLayout = positionsById.get(childId)
                if (!childLayout) return []
                const child = positionFor(childLayout, horizontalGap)
                return <line key={`${node.id}-${childId}`} x1={position.x} y1={position.y} x2={child.x} y2={child.y} stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-700" />
              })
            })}
            {positioned.map(({ node, position }) => {
              if (!node) return null
              const state = nodeStates.get(node.id)
              const active = highlightedNodeId === node.id
              const stateStyle = state === 'in-range'
                ? { fill: '#dcfce7', stroke: '#16a34a', text: '#14532d' }
                : state === 'partial'
                  ? { fill: '#fef3c7', stroke: '#d97706', text: '#78350f' }
                  : state === 'out-of-range'
                    ? { fill: '#e2e8f0', stroke: '#94a3b8', text: '#475569' }
                    : { fill: '#ffffff', stroke: '#64748b', text: '#0f172a' }
              return (
                <g key={node.id} transform={`translate(${position.x} ${position.y})`}>
                  <circle r={NODE_RADIUS} fill={stateStyle.fill} stroke={active ? '#f59e0b' : stateStyle.stroke} strokeWidth={active ? 4 : 2.5} />
                  <text y="-3" textAnchor="middle" className="font-mono text-[10px] font-semibold" fill={stateStyle.text}>[{node.rangeStart},{node.rangeEnd}]</text>
                  <text y="13" textAnchor="middle" className="font-mono text-sm font-bold" fill={stateStyle.text}>{node.value}</text>
                  <title>{`Range [${node.rangeStart}, ${node.rangeEnd}], sum ${node.value}`}</title>
                </g>
              )
            })}
          </svg>
        </div>
      ) : null}
    </div>
  )
}