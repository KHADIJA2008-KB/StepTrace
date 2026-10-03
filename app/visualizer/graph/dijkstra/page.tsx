'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GraphCanvas } from '@/components/visualizer/GraphCanvas'
import { dijkstra, type GraphStep } from '@/lib/algorithms/graph/dijkstra'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import type { Step } from '@/lib/visualizer/types'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'

const SAMPLE_NODES: GraphNode[] = [
  { id: 'sample-a', x: 140, y: 115, label: 'A' },
  { id: 'sample-b', x: 350, y: 95, label: 'B' },
  { id: 'sample-c', x: 590, y: 130, label: 'C' },
  { id: 'sample-d', x: 255, y: 365, label: 'D' },
  { id: 'sample-e', x: 515, y: 365, label: 'E' },
]

const SAMPLE_EDGES: GraphEdge[] = [
  { id: 'sample-ab', from: 'sample-a', to: 'sample-b', weight: 4, directed: false },
  { id: 'sample-ac', from: 'sample-a', to: 'sample-c', weight: 2, directed: false },
  { id: 'sample-bd', from: 'sample-b', to: 'sample-d', weight: 5, directed: false },
  { id: 'sample-cd', from: 'sample-c', to: 'sample-d', weight: 1, directed: false },
  { id: 'sample-ce', from: 'sample-c', to: 'sample-e', weight: 8, directed: false },
  { id: 'sample-de', from: 'sample-d', to: 'sample-e', weight: 3, directed: false },
]

function toPlayerSteps(steps: GraphStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], token: step.nodeId, description: step.message }))
}

function formatDistance(distance: number | undefined) {
  return distance === undefined || !Number.isFinite(distance) ? '∞' : String(distance)
}

export default function DijkstraPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [startNodeId, setStartNodeId] = useState('')
  const hasWeights = edges.some((edge) => edge.weight !== undefined)
  const hasInvalidWeights = edges.some((edge) => edge.weight !== undefined && (!Number.isFinite(edge.weight) || edge.weight < 0))
  const canRun = nodes.length > 0 && hasWeights && !hasInvalidWeights
  const effectiveStartId = nodes.some((node) => node.id === startNodeId) ? startNodeId : nodes[0]?.id ?? ''
  const graphSteps = useMemo(
    () => canRun && effectiveStartId ? dijkstra(nodes, edges, effectiveStartId) : [],
    [canRun, edges, effectiveStartId, nodes],
  )
  const playerSteps = useMemo(() => toPlayerSteps(graphSteps), [graphSteps])
  const player = useStepPlayer(playerSteps, 500)
  const activeStep = graphSteps[player.currentStep]
  const distances = activeStep?.distances ?? Object.fromEntries(nodes.map((node) => [node.id, node.id === effectiveStartId ? 0 : Infinity]))
  const finalizedNodeIds = graphSteps
    .slice(0, player.currentStep + 1)
    .filter((step) => step.type === 'finalize')
    .map((step) => step.nodeId)
  const nextStep = graphSteps[player.currentStep + 1]
  const relaxedEdgeUpdated = activeStep?.type === 'relax' && nextStep?.type === 'update-distance' && nextStep.edgeId === activeStep.edgeId
  const parentEdgeByNode = new Map<string, string>()
  for (const step of graphSteps.slice(0, player.currentStep + 1)) {
    if (step.type === 'update-distance' && step.edgeId) parentEdgeByNode.set(step.nodeId, step.edgeId)
  }
  const shortestPathTreeEdgeIds = activeStep?.type === 'done' ? Array.from(parentEdgeByNode.values()) : []

  function loadSampleGraph() {
    setNodes(SAMPLE_NODES.map((node) => ({ ...node })))
    setEdges(SAMPLE_EDGES.map((edge) => ({ ...edge })))
    setStartNodeId('sample-a')
  }

  function runDijkstra() {
    player.reset()
    player.play()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer/graph/builder" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← Graph builder</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Shortest paths</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Find the least-cost route.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Watch Dijkstra finalize distances, check edges, and build a shortest-path tree.</p>
      </header>

      <main className="mt-8 space-y-5">
        <section className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" aria-label="Dijkstra settings">
          <label className="grid gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Start node
            <select value={effectiveStartId} onChange={(event) => setStartNodeId(event.target.value)} disabled={nodes.length === 0} className="min-w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              {nodes.length === 0 && <option value="">No nodes</option>}
              {nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
          </label>
          <button type="button" onClick={loadSampleGraph} className="rounded-md border border-teal-600 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950">Load weighted sample</button>
          <button type="button" onClick={runDijkstra} disabled={!canRun} className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40">Run Dijkstra</button>
        </section>

        {!hasWeights && (
          <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
            Dijkstra requires weighted edges. Add at least one edge in the locked Weighted mode, or load the weighted sample.
          </p>
        )}
        {hasInvalidWeights && (
          <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
            Dijkstra requires finite, non-negative edge weights. Remove or replace the invalid weight before running.
          </p>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 space-y-4">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              weightedRequired
              highlightedNodeId={activeStep?.type === 'finalize' ? activeStep.nodeId : null}
              visitedNodeIds={finalizedNodeIds}
              highlightedEdgeId={activeStep?.type === 'relax' ? activeStep.edgeId : null}
              highlightedEdgeUpdated={Boolean(relaxedEdgeUpdated)}
              shortestPathTreeEdgeIds={shortestPathTreeEdgeIds}
              distances={distances}
              showDistances
            />
            {graphSteps.length > 0 && <StepControls {...player} currentStep={player.currentStep} totalSteps={graphSteps.length} />}
            <p className="min-h-6 text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              {activeStep?.message ?? (canRun ? 'Ready to calculate shortest paths from the selected node.' : 'Build a weighted graph to begin.')}
            </p>
          </div>

          <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-labelledby="dijkstra-distances-heading">
            <h2 id="dijkstra-distances-heading" className="text-sm font-semibold text-slate-900 dark:text-white">{activeStep?.type === 'done' ? 'Final distances' : 'Distances'}</h2>
            {nodes.length > 0 ? (
              <table className="mt-3 w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th scope="col" className="py-2 font-medium">Node</th>
                    <th scope="col" className="py-2 text-right font-medium">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node) => (
                    <tr key={node.id} className="border-b border-slate-100 last:border-0 dark:border-slate-900">
                      <th scope="row" className="py-2 text-left font-semibold text-slate-700 dark:text-slate-200">{node.label}</th>
                      <td className="py-2 text-right tabular-nums text-slate-600 dark:text-slate-300">{formatDistance(distances[node.id])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No nodes yet.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}