'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GraphCanvas } from '@/components/visualizer/GraphCanvas'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'
import { topologicalSort, type TopologicalSortStep } from '@/lib/algorithms/graph/topologicalSort'
import { StepControls } from '@/lib/visualizer/StepControls'
import type { Step } from '@/lib/visualizer/types'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'

const SAMPLE_NODES: GraphNode[] = [
  { id: 'topo-a', x: 135, y: 115, label: 'A' },
  { id: 'topo-b', x: 350, y: 95, label: 'B' },
  { id: 'topo-c', x: 570, y: 145, label: 'C' },
  { id: 'topo-d', x: 270, y: 355, label: 'D' },
  { id: 'topo-e', x: 520, y: 365, label: 'E' },
]

const SAMPLE_EDGES: GraphEdge[] = [
  { id: 'topo-ac', from: 'topo-a', to: 'topo-c', directed: true },
  { id: 'topo-bc', from: 'topo-b', to: 'topo-c', directed: true },
  { id: 'topo-bd', from: 'topo-b', to: 'topo-d', directed: true },
  { id: 'topo-cd', from: 'topo-c', to: 'topo-d', directed: true },
  { id: 'topo-ce', from: 'topo-c', to: 'topo-e', directed: true },
  { id: 'topo-de', from: 'topo-d', to: 'topo-e', directed: true },
]

const CYCLE_SAMPLE_EDGE: GraphEdge = { id: 'topo-ea-cycle', from: 'topo-e', to: 'topo-a', directed: true }

function toPlayerSteps(steps: TopologicalSortStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], token: step.nodeId, description: step.message }))
}

function initialIndegrees(nodes: GraphNode[], edges: GraphEdge[]) {
  const counts = Object.fromEntries(nodes.map((node) => [node.id, 0])) as Record<string, number>
  const validIds = new Set(nodes.map((node) => node.id))
  for (const edge of edges) {
    if (!validIds.has(edge.from) || !validIds.has(edge.to)) continue
    counts[edge.to] += 1
    if (!edge.directed && edge.from !== edge.to) counts[edge.from] += 1
  }
  return counts
}

export default function TopologicalSortPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const hasUndirectedEdges = edges.some((edge) => !edge.directed)
  const graphSteps = useMemo(
    () => nodes.length > 0 && !hasUndirectedEdges ? topologicalSort(nodes, edges) : [],
    [edges, hasUndirectedEdges, nodes],
  )
  const playerSteps = useMemo(() => toPlayerSteps(graphSteps), [graphSteps])
  const player = useStepPlayer(playerSteps, 500)
  const activeStep = graphSteps[player.currentStep]
  const order = activeStep?.order ?? []
  const indegrees = activeStep?.indegrees ?? initialIndegrees(nodes, edges)
  const queue = activeStep?.queue ?? []
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const cycleDetected = activeStep?.type === 'cycle-detected'

  function loadSampleGraph() {
    setNodes(SAMPLE_NODES.map((node) => ({ ...node })))
    setEdges(SAMPLE_EDGES.map((edge) => ({ ...edge })))
  }

  function loadCycleSample() {
    setNodes(SAMPLE_NODES.map((node) => ({ ...node })))
    setEdges([...SAMPLE_EDGES.map((edge) => ({ ...edge })), { ...CYCLE_SAMPLE_EDGE }])
  }

  function runSort() {
    player.reset()
    player.play()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer/graph/builder" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← Graph builder</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Directed graph</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Order the dependencies.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Peel away zero-in-degree nodes to build a valid topological order.</p>
      </header>

      <main className="mt-8 space-y-5">
        <section className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" aria-label="Topological sort settings">
          <button type="button" onClick={loadSampleGraph} className="rounded-md border border-teal-600 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950">Load sample DAG</button>
          <button type="button" onClick={loadCycleSample} className="rounded-md border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950">Load cycle sample</button>
          <button type="button" onClick={runSort} disabled={nodes.length === 0 || hasUndirectedEdges} className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40">Run topological sort</button>
        </section>

        {hasUndirectedEdges && (
          <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
            Topological sorting requires a directed graph. Switch the canvas to Directed mode or remove undirected edges before running.
          </p>
        )}
        {cycleDetected && (
          <p role="alert" className="rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">
            {activeStep.message}
          </p>
        )}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 space-y-4">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              highlightedNodeId={activeStep?.type === 'process' ? activeStep.nodeId : null}
              visitedNodeIds={order}
              dimUnvisited={player.currentStep >= 0}
            />
            {graphSteps.length > 0 && <StepControls {...player} currentStep={player.currentStep} totalSteps={graphSteps.length} />}
            <p className="min-h-6 text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              {activeStep?.message ?? (nodes.length > 0 ? 'Ready to build the topological order.' : 'Build a directed graph or load the sample DAG.')}
            </p>
          </div>

          <aside className="h-fit space-y-5 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-label="Topological sort progress">
            <section aria-labelledby="topological-order-heading">
              <h2 id="topological-order-heading" className="text-sm font-semibold text-slate-900 dark:text-white">Topological order</h2>
              {order.length > 0 ? (
                <ol className="mt-3 flex flex-wrap gap-2">
                  {order.map((nodeId, index) => (
                    <li key={nodeId} className={`grid size-9 place-items-center rounded-md border text-sm font-semibold ${index === order.length - 1 && activeStep?.type === 'process' ? 'border-teal-400 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950 dark:text-teal-200' : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200'}`}>
                      {nodeById.get(nodeId)?.label ?? nodeId}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-slate-400">No nodes processed yet.</p>
              )}
            </section>

            <section aria-labelledby="topological-queue-heading">
              <h2 id="topological-queue-heading" className="text-sm font-semibold text-slate-900 dark:text-white">Queue</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{queue.length > 0 ? queue.map((nodeId) => nodeById.get(nodeId)?.label ?? nodeId).join(', ') : 'Empty'}</p>
            </section>

            <section aria-labelledby="topological-indegree-heading">
              <h2 id="topological-indegree-heading" className="text-sm font-semibold text-slate-900 dark:text-white">In-degree</h2>
              {nodes.length > 0 ? (
                <ul className="mt-2 divide-y divide-slate-100 dark:divide-slate-900">
                  {nodes.map((node) => (
                    <li key={node.id} className="flex justify-between py-2 text-sm">
                      <span className="text-slate-600 dark:text-slate-300">{node.label}</span>
                      <span className="font-semibold tabular-nums text-slate-800 dark:text-slate-100">{indegrees[node.id] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-400">No nodes.</p>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}