'use client'

import { useId, useRef, useState, type Dispatch, type PointerEvent, type SetStateAction, type MouseEvent } from 'react'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'

type GraphCanvasProps = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  setNodes: Dispatch<SetStateAction<GraphNode[]>>
  setEdges: Dispatch<SetStateAction<GraphEdge[]>>
  highlightedNodeId?: string | null
  visitedNodeIds?: string[]
  dimUnvisited?: boolean
  highlightedEdgeId?: string | null
  highlightedEdgeUpdated?: boolean
  shortestPathTreeEdgeIds?: string[]
  distances?: Record<string, number>
  showDistances?: boolean
  weightedRequired?: boolean
  undirectedRequired?: boolean
  mstEdgeIds?: string[]
  consideredEdgeIds?: string[]
  activeMstCandidateEdgeId?: string | null
  rejectedEdgeId?: string | null
  dimUnconsideredEdges?: boolean
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500
const NODE_RADIUS = 24

function nodeLabel(index: number) {
  let value = index + 1
  let label = ''
  while (value > 0) {
    value -= 1
    label = String.fromCharCode(65 + (value % 26)) + label
    value = Math.floor(value / 26)
  }
  return label
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function GraphCanvas({
  nodes,
  edges,
  setNodes,
  setEdges,
  highlightedNodeId = null,
  visitedNodeIds = [],
  dimUnvisited = false,
  highlightedEdgeId = null,
  highlightedEdgeUpdated = false,
  shortestPathTreeEdgeIds = [],
  distances,
  showDistances = false,
  weightedRequired = false,
  undirectedRequired = false,
  mstEdgeIds = [],
  consideredEdgeIds = [],
  activeMstCandidateEdgeId = null,
  rejectedEdgeId = null,
  dimUnconsideredEdges = false,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ id: string; pointerId: number; x: number; y: number; moved: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const markerId = `graph-arrow-${useId().replace(/:/g, '')}`
  const [directed, setDirected] = useState(!undirectedRequired)
  const [weighted, setWeighted] = useState(weightedRequired)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const visitedNodes = new Set(visitedNodeIds)
  const shortestPathTreeEdges = new Set(shortestPathTreeEdgeIds)
  const mstEdges = new Set(mstEdgeIds)
  const consideredEdges = new Set(consideredEdgeIds)

  function canvasPoint(event: PointerEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current
    const matrix = svg?.getScreenCTM()
    if (!svg || !matrix) return null
    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const localPoint = point.matrixTransform(matrix.inverse())
    return {
      x: Math.max(NODE_RADIUS, Math.min(CANVAS_WIDTH - NODE_RADIUS, localPoint.x)),
      y: Math.max(NODE_RADIUS, Math.min(CANVAS_HEIGHT - NODE_RADIUS, localPoint.y)),
    }
  }

  function addNode(event: MouseEvent<SVGSVGElement>) {
    if (event.target !== svgRef.current || deleteMode) return
    const position = canvasPoint(event)
    if (!position) return
    const usedLabels = new Set(nodes.map((node) => node.label))
    let labelIndex = 0
    while (usedLabels.has(nodeLabel(labelIndex))) labelIndex += 1
    setNodes((current) => [...current, { id: newId('node'), ...position, label: nodeLabel(labelIndex) }])
    setSelectedNodeId(null)
  }

  function removeNode(id: string) {
    setNodes((current) => current.filter((node) => node.id !== id))
    setEdges((current) => current.filter((edge) => edge.from !== id && edge.to !== id))
    setSelectedNodeId((current) => (current === id ? null : current))
  }

  function addEdge(from: string, to: string) {
    if (from === to) {
      setSelectedNodeId(null)
      return
    }

    let weight: number | undefined
    if (weighted) {
      const answer = window.prompt('Enter edge weight:')
      if (answer === null || answer.trim() === '') return
      weight = Number(answer)
      if (!Number.isFinite(weight)) return
    }

    setEdges((current) => [...current, { id: newId('edge'), from, to, ...(weight === undefined ? {} : { weight }), directed }])
    setSelectedNodeId(null)
  }

  function handleNodeClick(event: MouseEvent<SVGGElement>, nodeId: string) {
    event.stopPropagation()
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    if (deleteMode) {
      removeNode(nodeId)
      return
    }
    if (selectedNodeId) addEdge(selectedNodeId, nodeId)
    else setSelectedNodeId(nodeId)
  }

  function handleNodePointerDown(event: PointerEvent<SVGGElement>, node: GraphNode) {
    if (event.button !== 0 || deleteMode) return
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { id: node.id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 3) drag.moved = true
    if (!drag.moved) return
    const position = canvasPoint(event)
    if (position) setNodes((current) => current.map((node) => (node.id === drag.id ? { ...node, ...position } : node)))
  }

  function handlePointerUp(event: PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    suppressClickRef.current = drag.moved
    dragRef.current = null
  }

  function removeEdge(event: MouseEvent<SVGGElement>, edgeId: string) {
    event.stopPropagation()
    if (deleteMode) setEdges((current) => current.filter((edge) => edge.id !== edgeId))
  }

  function preventContextMenu(event: MouseEvent<SVGElement>) {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <section className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950" aria-label="Graph canvas">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-3 dark:border-slate-800">
        <button type="button" aria-pressed={directed} disabled={undirectedRequired} title={undirectedRequired ? 'Undirected mode is required' : undefined} onClick={() => setDirected((current) => !current)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 aria-pressed:bg-slate-900 aria-pressed:text-white disabled:cursor-not-allowed disabled:opacity-80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">
          {directed ? 'Directed' : 'Undirected'}
        </button>
        <button type="button" aria-pressed={weightedRequired || weighted} disabled={weightedRequired} title={weightedRequired ? 'Weighted mode is required' : undefined} onClick={() => setWeighted((current) => !current)} className="rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 aria-pressed:bg-slate-900 aria-pressed:text-white disabled:cursor-not-allowed disabled:opacity-80 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">
          {weightedRequired || weighted ? 'Weighted' : 'Unweighted'}
        </button>
        <button type="button" aria-pressed={deleteMode} onClick={() => { setDeleteMode((current) => !current); setSelectedNodeId(null) }} className="rounded-md border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 aria-pressed:bg-rose-600 aria-pressed:text-white dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950 dark:aria-pressed:bg-rose-700 dark:aria-pressed:text-white">
          {deleteMode ? 'Delete mode on' : 'Delete mode'}
        </button>
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
          {deleteMode ? 'Select a node or edge to remove' : selectedNodeId ? 'Select a second node to connect' : 'Click canvas to add a node'}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        role="img"
        aria-label="Interactive graph canvas"
        className={`block aspect-[8/5] w-full touch-none ${deleteMode ? 'cursor-crosshair' : 'cursor-cell'}`}
        onClick={addNode}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L8,4 L0,8 z" className="fill-slate-500 dark:fill-slate-400" />
          </marker>
        </defs>
        <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="fill-white dark:fill-slate-950" pointerEvents="none" />
        <g className="text-slate-400 dark:text-slate-600">
          {edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.from)
            const to = nodes.find((node) => node.id === edge.to)
            if (!from || !to) return null
            const angle = Math.atan2(to.y - from.y, to.x - from.x)
            const startX = from.x + Math.cos(angle) * NODE_RADIUS
            const startY = from.y + Math.sin(angle) * NODE_RADIUS
            const endX = to.x - Math.cos(angle) * (NODE_RADIUS + (edge.directed ? 3 : 0))
            const endY = to.y - Math.sin(angle) * (NODE_RADIUS + (edge.directed ? 3 : 0))
            const middleX = (from.x + to.x) / 2
            const middleY = (from.y + to.y) / 2
            const isHighlighted = edge.id === highlightedEdgeId
            const isTreeEdge = shortestPathTreeEdges.has(edge.id)
            const isMstEdge = mstEdges.has(edge.id)
            const isMstCandidate = edge.id === activeMstCandidateEdgeId
            const isRejected = edge.id === rejectedEdgeId
            const isUnconsidered = dimUnconsideredEdges && !consideredEdges.has(edge.id) && !isMstEdge
            const edgeColorClass = isRejected
              ? 'text-rose-600 dark:text-rose-400'
              : isMstCandidate
                ? 'text-amber-500 dark:text-amber-400'
                : isMstEdge
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isHighlighted
                    ? highlightedEdgeUpdated ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    : isTreeEdge ? 'text-teal-600 dark:text-teal-400' : ''
            const dimClass = isUnconsidered ? 'opacity-30' : ''
            const pulseClass = isRejected || isMstCandidate || isHighlighted ? 'animate-pulse' : ''
            return (
              <g
                key={edge.id}
                className={`cursor-pointer ${edgeColorClass} ${dimClass} ${pulseClass}`}
                onClick={(event) => removeEdge(event, edge.id)}
                onContextMenu={(event) => { preventContextMenu(event); setEdges((current) => current.filter((item) => item.id !== edge.id)) }}
                aria-label={`Edge ${from.label} to ${to.label}${edge.weight === undefined ? '' : `, weight ${edge.weight}`}`}
              >
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="currentColor" strokeWidth={isMstEdge ? 4.5 : isHighlighted || isTreeEdge || isMstCandidate || isRejected ? 3.5 : 2.5} markerEnd={edge.directed ? `url(#${markerId})` : undefined} />
                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="transparent" strokeWidth="16" />
                {edge.weight !== undefined && <text x={middleX} y={middleY - 9} textAnchor="middle" className="fill-slate-700 text-sm font-semibold dark:fill-slate-200">{edge.weight}</text>}
              </g>
            )
          })}
        </g>
        {nodes.map((node) => {
          const isHighlighted = node.id === highlightedNodeId
          const isVisited = visitedNodes.has(node.id)
          const isSelected = node.id === selectedNodeId
          const colorClass = isHighlighted
            ? 'text-amber-600 dark:text-amber-400'
            : isVisited
              ? 'text-teal-600 dark:text-teal-400'
              : isSelected
                ? 'text-teal-600 dark:text-teal-400'
              : 'text-slate-700 dark:text-slate-200'
          const fillClass = isHighlighted
            ? 'fill-amber-100 dark:fill-amber-950'
            : isVisited
              ? 'fill-teal-50 dark:fill-teal-950'
              : isSelected
                ? 'fill-teal-50 dark:fill-teal-950'
              : 'fill-white dark:fill-slate-900'
          const dimClass = dimUnvisited && !isHighlighted && !isVisited ? 'opacity-30' : ''
          const distance = distances?.[node.id]
          const distanceX = node.x > CANVAS_WIDTH * 0.72 ? -NODE_RADIUS - 8 : NODE_RADIUS + 8
          return (
            <g
              key={node.id}
              transform={`translate(${node.x} ${node.y})`}
              className={`cursor-grab active:cursor-grabbing ${colorClass} ${dimClass}`}
              onClick={(event) => handleNodeClick(event, node.id)}
              onPointerDown={(event) => handleNodePointerDown(event, node)}
              onContextMenu={(event) => { preventContextMenu(event); removeNode(node.id) }}
            >
              <circle r={NODE_RADIUS} className={fillClass} stroke="currentColor" strokeWidth="3" />
              <text y="5" textAnchor="middle" className="pointer-events-none fill-current text-sm font-bold">{node.label}</text>
              {showDistances && distance !== undefined && (
                <text x={distanceX} y="5" textAnchor={distanceX < 0 ? 'end' : 'start'} className="pointer-events-none fill-slate-500 text-xs font-semibold dark:fill-slate-400">
                  {Number.isFinite(distance) ? distance : '∞'}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </section>
  )
}