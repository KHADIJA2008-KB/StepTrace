'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { GraphCanvas } from '@/components/visualizer/GraphCanvas'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'
import { bfs, dfs, type GraphStep } from '@/lib/algorithms/graph/traversals'

type Algorithm = 'bfs' | 'dfs'

const SAMPLE_NODES: GraphNode[] = [
  { id: 'sample-a', x: 130, y: 110, label: 'A' },
  { id: 'sample-b', x: 360, y: 110, label: 'B' },
  { id: 'sample-c', x: 590, y: 110, label: 'C' },
  { id: 'sample-d', x: 245, y: 360, label: 'D' },
  { id: 'sample-e', x: 475, y: 360, label: 'E' },
]

const SAMPLE_EDGES: GraphEdge[] = [
  { id: 'sample-ab', from: 'sample-a', to: 'sample-b', directed: false },
  { id: 'sample-ac', from: 'sample-a', to: 'sample-c', directed: false },
  { id: 'sample-bd', from: 'sample-b', to: 'sample-d', directed: false },
  { id: 'sample-cd', from: 'sample-c', to: 'sample-d', directed: false },
  { id: 'sample-ce', from: 'sample-c', to: 'sample-e', directed: false },
  { id: 'sample-de', from: 'sample-d', to: 'sample-e', directed: false },
]

function toPlayerSteps(steps: GraphStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], token: step.nodeId, description: step.message }))
}

export default function GraphTraversalPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [startNodeId, setStartNodeId] = useState('')
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs')
  const effectiveStartId = nodes.some((node) => node.id === startNodeId) ? startNodeId : nodes[0]?.id ?? ''
  const graphSteps = useMemo(() => {
    if (!effectiveStartId) return []
    return algorithm === 'bfs' ? bfs(nodes, edges, effectiveStartId) : dfs(nodes, edges, effectiveStartId)
  }, [algorithm, edges, effectiveStartId, nodes])
  const playerSteps = useMemo(() => toPlayerSteps(graphSteps), [graphSteps])
  const player = useStepPlayer(playerSteps, 500)
  const activeStep = graphSteps[player.currentStep]
  const visitedNodeIds = graphSteps
    .slice(0, player.currentStep + 1)
    .filter((step) => step.type === 'visit')
    .map((step) => step.nodeId)
  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const structureState = graphSteps.slice(0, player.currentStep + 1).reduce<string[]>((state, step) => {
    if (algorithm === 'bfs') {
      if (step.type === 'enqueue') state.push(step.nodeId)
      if (step.type === 'dequeue') {
        const frontIndex = state.indexOf(step.nodeId)
        if (frontIndex >= 0) state.splice(frontIndex, 1)
      }
    } else {
      if (step.type === 'push') state.push(step.nodeId)
      if (step.type === 'pop') state.pop()
    }
    return state
  }, [])
  const visibleStructure = algorithm === 'dfs' ? [...structureState].reverse() : structureState

  function loadSampleGraph() {
    setNodes(SAMPLE_NODES.map((node) => ({ ...node })))
    setEdges(SAMPLE_EDGES.map((edge) => ({ ...edge })))
    setStartNodeId('sample-a')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer/graph/builder" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← Graph builder</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Graph traversal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Follow the frontier.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Watch breadth-first and depth-first search reveal each node and the state of their working structure.</p>
      </header>

      <main className="mt-8 space-y-5">
        <section className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950" aria-label="Traversal settings">
          <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-900" aria-label="Traversal algorithm">
            <button type="button" aria-pressed={algorithm === 'bfs'} onClick={() => setAlgorithm('bfs')} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-slate-200 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">BFS</button>
            <button type="button" aria-pressed={algorithm === 'dfs'} onClick={() => setAlgorithm('dfs')} className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-slate-200 dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900">DFS</button>
          </div>
          <label className="grid gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Start node
            <select value={effectiveStartId} onChange={(event) => setStartNodeId(event.target.value)} disabled={nodes.length === 0} className="min-w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
              {nodes.length === 0 && <option value="">No nodes</option>}
              {nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}
            </select>
          </label>
          <button type="button" onClick={loadSampleGraph} className="rounded-md border border-teal-600 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 dark:border-teal-500 dark:text-teal-300 dark:hover:bg-teal-950">Load sample graph</button>
        </section>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 space-y-4">
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              setNodes={setNodes}
              setEdges={setEdges}
              highlightedNodeId={activeStep?.type === 'done' ? null : activeStep?.nodeId}
              visitedNodeIds={visitedNodeIds}
              dimUnvisited={player.currentStep >= 0}
            />
            <StepControls {...player} currentStep={player.currentStep} totalSteps={graphSteps.length || undefined} />
            <p className="min-h-6 text-sm text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              {activeStep?.message ?? (graphSteps.length > 0 ? 'Ready to traverse from the selected node.' : 'Add nodes or load the sample graph to begin.')}
            </p>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950" aria-label={`${algorithm === 'bfs' ? 'Queue' : 'Stack'} state`}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{algorithm === 'bfs' ? 'Queue' : 'Stack'}</p>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{algorithm === 'bfs' ? 'Front first' : 'Top first'}</p>
            <ol className="mt-4 flex min-h-24 flex-col gap-2" aria-live="polite" aria-relevant="all">
              {visibleStructure.length > 0 ? visibleStructure.map((nodeId, index) => (
                <li key={`${nodeId}-${index}`} className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm font-semibold ${index === 0 ? 'border-teal-300 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-200' : 'border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-200'}`}>
                  <span>{nodeById.get(nodeId)?.label ?? nodeId}</span>
                  {index === 0 && <span className="text-[10px] uppercase tracking-wide">{algorithm === 'bfs' ? 'front' : 'top'}</span>}
                </li>
              )) : (
                <li className="flex min-h-12 items-center text-sm text-slate-400">Empty</li>
              )}
            </ol>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Visited</p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                {visitedNodeIds.length > 0 ? visitedNodeIds.map((nodeId) => nodeById.get(nodeId)?.label ?? nodeId).join(' → ') : '—'}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}