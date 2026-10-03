'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GraphCanvas } from '@/components/visualizer/GraphCanvas'
import { kruskalsMST, primsMST, type MSTStep } from '@/lib/algorithms/graph/mst'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import type { Step } from '@/lib/visualizer/types'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'

type Algorithm = 'prim' | 'kruskal'

const SAMPLE_NODES: GraphNode[] = [
  { id: 'mst-a', x: 140, y: 115, label: 'A' },
  { id: 'mst-b', x: 350, y: 95, label: 'B' },
  { id: 'mst-c', x: 590, y: 130, label: 'C' },
  { id: 'mst-d', x: 255, y: 365, label: 'D' },
  { id: 'mst-e', x: 515, y: 365, label: 'E' },
]

const SAMPLE_EDGES: GraphEdge[] = [
  { id: 'mst-ab', from: 'mst-a', to: 'mst-b', weight: 1, directed: false },
  { id: 'mst-ac', from: 'mst-a', to: 'mst-c', weight: 4, directed: false },
  { id: 'mst-bc', from: 'mst-b', to: 'mst-c', weight: 2, directed: false },
  { id: 'mst-bd', from: 'mst-b', to: 'mst-d', weight: 5, directed: false },
  { id: 'mst-cd', from: 'mst-c', to: 'mst-d', weight: 3, directed: false },
  { id: 'mst-ce', from: 'mst-c', to: 'mst-e', weight: 6, directed: false },
  { id: 'mst-de', from: 'mst-d', to: 'mst-e', weight: 4, directed: false },
]

function toPlayerSteps(steps: MSTStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], token: step.nodeId, description: step.message }))
}

export default function MSTPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [algorithm, setAlgorithm] = useState<Algorithm>('prim')
  const [startNodeId, setStartNodeId] = useState('')
  const effectiveStartId = nodes.some((node) => node.id === startNodeId) ? startNodeId : nodes[0]?.id ?? ''
  const hasWeights = edges.some((edge) => edge.weight !== undefined)
  const hasInvalidWeights = edges.some((edge) => edge.weight !== undefined && !Number.isFinite(edge.weight))
  const canRun = nodes.length > 0 && hasWeights && !hasInvalidWeights && (algorithm === 'kruskal' || Boolean(effectiveStartId))
  const graphSteps = useMemo(() => {
    if (!canRun) return []
    return algorithm === 'prim'
      ? primsMST(nodes, edges, effectiveStartId)
      : kruskalsMST(nodes, edges)
  }, [algorithm, canRun, edges, effectiveStartId, nodes])
  const playerSteps = useMemo(() => toPlayerSteps(graphSteps), [graphSteps])
  const player = useStepPlayer(playerSteps, 550)
  const activeStep = graphSteps[player.currentStep]
  const acceptedEdgeIds = activeStep?.mstEdges ?? []
  const consideredEdgeIds = graphSteps
    .slice(0, player.currentStep + 1)
    .filter((step) => step.type === 'consider' && step.edgeId)
    .map((step) => step.edgeId as string)
  const runningTotal = acceptedEdgeIds.reduce((total, edgeId) => {
    const edge = edges.find((candidate) => candidate.id === edgeId)
    return total + (edge?.weight ?? 1)
  }, 0)
  const acceptedEdges = acceptedEdgeIds.map((edgeId) => edges.find((edge) => edge.id === edgeId)).filter((edge): edge is GraphEdge => Boolean(edge))

  function loadSampleGraph() {
    setNodes(SAMPLE_NODES.map((node) => ({ ...node })))
    setEdges(SAMPLE_EDGES.map((edge) => ({ ...edge })))
    setStartNodeId('mst-a')
  }

  function runMST() {
    player.reset()
    player.play()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer/graph/builder" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← Graph builder</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Minimum spanning tree</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Connect every node at minimum cost.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Compare Prim’s frontier with Kruskal’s weight-ordered edge selection.</p>
      </header>

      <main className="mt-8 space-y-5">
        <section className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" aria-label="MST settings">
          <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900" aria-label="MST algorithm">
            <button type="button" aria-pressed={algorithm === 'prim'} onClick={() => setAlgorithm('prim')} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-slate-200 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">Prim’s</button>
            <button type="button" aria-pressed={algorithm === 'kruskal'} onClick={() => setAlgorithm('kruskal')} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-slate-200 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">Kruskal’s</button>
          </div>
          {algorithm === 'prim' && (
            <label className="grid gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              Start node
              <select value={effectiveStartId} onChange={(event) => setStartNodeId(event.target.value)} disabled={nodes.length === 0} className="min-w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                {nodes.length === 0 && <option value="">No nodes</option>}
                {nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
              </select>
            </label>
          )}
          <button type="button" onClick={loadSampleGraph} className="rounded-md border border-teal-600 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950">Load weighted sample</button>
          <button type="button" onClick={runMST} disabled={!canRun} className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40">Run {algorithm === 'prim' ? 'Prim’s' : 'Kruskal’s'}</button>
        </section>

        {!hasWeights && (
          <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
            MST algorithms require weighted edges. Add weighted edges in the locked Weighted and Undirected modes, or load the sample graph.
          </p>
        )}
        {hasInvalidWeights && (
          <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
            Edge weights must be finite numbers before an MST can be calculated.
          </p>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0 space-y-4">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              weightedRequired
              undirectedRequired
              mstEdgeIds={acceptedEdgeIds}
              consideredEdgeIds={consideredEdgeIds}
              activeMstCandidateEdgeId={activeStep?.type === 'consider' ? activeStep.edgeId : null}
              rejectedEdgeId={activeStep?.type === 'reject' ? activeStep.edgeId : null}
              dimUnconsideredEdges
            />
            {graphSteps.length > 0 && <StepControls {...player} currentStep={player.currentStep} totalSteps={graphSteps.length} />}
            <p className="min-h-6 text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              {activeStep?.message ?? (canRun ? 'Ready to build a minimum spanning tree.' : 'Build a weighted graph to begin.')}
            </p>
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-label="MST progress">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Running total</p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">{runningTotal}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{acceptedEdgeIds.length} edge{acceptedEdgeIds.length === 1 ? '' : 's'} accepted</p>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">MST edges</p>
              {acceptedEdges.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {acceptedEdges.map((edge) => {
                    const from = nodes.find((node) => node.id === edge.from)
                    const to = nodes.find((node) => node.id === edge.to)
                    return <li key={edge.id} className="flex justify-between gap-3 text-sm text-slate-700 dark:text-slate-200"><span>{from?.label} — {to?.label}</span><span className="tabular-nums">{edge.weight ?? 1}</span></li>
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-400">No edges accepted yet.</p>
              )}
            </div>
            {activeStep?.type === 'done' && (
              <div className="mt-4 border-t border-emerald-200 pt-4 dark:border-emerald-900" role="status">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">Complete</p>
                <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-100">{activeStep.message}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Total weight: {runningTotal}</p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}