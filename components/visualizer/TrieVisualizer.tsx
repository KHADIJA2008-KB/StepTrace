'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { computeHierarchyLayout, type TreeLayoutPosition } from '@/lib/algorithms/tree/treeLayout'
import type { TrieNode } from '@/lib/algorithms/tree/trie'

type TrieVisualizerProps = {
  nodes: TrieNode[]
  rootId: string
  highlightedNodeId?: string | null
  visitedNodeIds?: string[]
}

const NODE_RADIUS = 25
const MIN_HORIZONTAL_GAP = 70
const MAX_HORIZONTAL_GAP = 120
const PADDING = 40

function nodePosition(position: TreeLayoutPosition, horizontalGap: number) {
  return { x: PADDING + position.x * horizontalGap, y: PADDING + position.y }
}

export function TrieVisualizer({ nodes, rootId, highlightedNodeId, visitedNodeIds = [] }: TrieVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const updateWidth = () => setContainerWidth(container.clientWidth)
    updateWidth()
    const observer = new ResizeObserver(updateWidth)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])
  const layout = useMemo(
    () => computeHierarchyLayout(nodes, rootId, (node) => Object.values(node.children)),
    [nodes, rootId],
  )
  const positionById = useMemo(() => new Map(layout.map((position) => [position.id, position])), [layout])
  const maxX = layout.reduce((maximum, position) => Math.max(maximum, position.x), 0)
  const horizontalGap = Math.max(
    MIN_HORIZONTAL_GAP,
    Math.min(MAX_HORIZONTAL_GAP, (Math.max(containerWidth, 0) - PADDING * 2) / Math.max(maxX, 1)),
  )
  const positionedNodes = layout.map((position) => ({
    node: nodeById.get(position.id),
    position: nodePosition(position, horizontalGap),
  }))
  const svgWidth = Math.max(containerWidth, PADDING * 2 + maxX * horizontalGap)
  const svgHeight = PADDING * 2 + (layout.reduce((maximum, position) => Math.max(maximum, position.y), 0) || 0)
  const visited = new Set(visitedNodeIds)

  return (
    <div ref={containerRef} className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-950" aria-label="trie visualizer">
      {layout.length === 0 ? (
        <div className="flex min-h-40 items-center justify-center text-sm text-slate-500">No trie words to display.</div>
      ) : (
        <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} role="img" aria-label="Trie structure" className="block min-w-full">
          {positionedNodes.flatMap(({ node, position }) => {
            if (!node) return []
            return Object.entries(node.children).flatMap(([char, childId]) => {
              const childPosition = positionById.get(childId)
              if (!childPosition) return []
              const child = nodePosition(childPosition, horizontalGap)
              return <line key={`${node.id}-${char}`} x1={position.x} y1={position.y} x2={child.x} y2={child.y} stroke="currentColor" strokeWidth="2" className="text-slate-300 dark:text-slate-700" />
            })
          })}
          {positionedNodes.map(({ node, position }) => {
            if (!node) return null
            const highlighted = node.id === highlightedNodeId
            const wasVisited = visited.has(node.id)
            const color = highlighted ? 'text-amber-500' : wasVisited ? 'text-teal-500' : 'text-slate-700 dark:text-slate-300'
            const fill = highlighted ? 'fill-amber-50 dark:fill-amber-950' : node.isEndOfWord ? 'fill-teal-50 dark:fill-teal-950' : 'fill-white dark:fill-slate-900'
            return (
              <g key={node.id} className={highlighted ? `tree-node-highlight ${color}` : color} transform={`translate(${position.x} ${position.y})`}>
                <circle r={NODE_RADIUS} className={fill} stroke="currentColor" strokeWidth={node.isEndOfWord ? 5 : 3} />
                <text y="6" textAnchor="middle" className="fill-slate-800 text-lg font-bold uppercase dark:fill-slate-100">{node.char || 'root'}</text>
                <title>{node.isEndOfWord ? `${node.char || 'root'}: end of word` : node.char || 'root'}</title>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}