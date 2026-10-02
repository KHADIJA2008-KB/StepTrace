'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { deserializeTree, serializeTree, type TreeAnalysisStep } from '@/lib/algorithms/tree/treeAlgorithms'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

const sampleTree: TreeNode[] = [
  { id: 'root', value: 5, left: 'left', right: 'right', color: 'black' },
  { id: 'left', value: 3, left: 'leaf-a', right: null, color: 'black' },
  { id: 'right', value: 8, left: null, right: 'leaf-b', color: 'black' },
  { id: 'leaf-a', value: 1, left: null, right: null, color: 'black' },
  { id: 'leaf-b', value: 9, left: null, right: null, color: 'black' },
]

type Operation = 'serialize' | 'deserialize'

function toPlayerSteps(steps: TreeAnalysisStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

export default function SerializeTreePage() {
  const [operation, setOperation] = useState<Operation | null>(null)
  const [steps, setSteps] = useState<TreeAnalysisStep[]>([])
  const [serialized, setSerialized] = useState('')
  const [restoredTree, setRestoredTree] = useState<TreeNode[] | null>(null)
  const [restoredRootId, setRestoredRootId] = useState('')
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 420)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const liveSerialized = operation === 'serialize' ? activeStep?.serialized ?? '' : serialized
  const displayNodes = operation === 'deserialize' ? activeStep?.nodesAfter ?? [] : restoredTree ?? sampleTree
  const displayRootId = operation === 'deserialize' ? activeStep?.rootId ?? '' : restoredTree ? restoredRootId : 'root'
  const isSerialized = activeStep?.type === 'serialize' || (!operation && serialized.length > 0)
  const finishedDeserialization = operation === 'deserialize' && activeStep?.type === 'found'

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== steps.length - 1) return
    const last = steps.at(-1)
    if (!last) return
    if (operation === 'serialize' && last.serialized !== undefined) {
      setSerialized(last.serialized)
      setRestoredTree(null)
      setRestoredRootId('')
    } else if (operation === 'deserialize' && last.nodesAfter) {
      setRestoredTree(last.nodesAfter)
      setRestoredRootId(last.rootId ?? '')
    }
    setOperation(null)
  }, [operation, player.currentStep, steps])

  function beginSerialize() {
    reset()
    setSerialized('')
    setRestoredTree(null)
    setSteps(serializeTree(sampleTree, 'root'))
    setOperation('serialize')
  }

  function beginDeserialize() {
    if (!serialized || operation) return
    reset()
    setSteps(deserializeTree(serialized))
    setOperation('deserialize')
  }

  const currentPath = activeStep?.pathNodeIds ?? []

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree encoding</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Turn a tree into tokens.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Pre-order serialization records each node and every empty child, so the shape can be rebuilt exactly.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Tree serialization visualizer">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sample tree</p><p className="mt-1 text-sm text-slate-500">Serialize the tree, then rebuild it from its token string.</p></div>
            <div className="flex gap-2">
              <button type="button" onClick={beginSerialize} disabled={operation === 'deserialize'} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Serialize tree</button>
              <button type="button" onClick={beginDeserialize} disabled={!isSerialized || Boolean(operation)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Deserialize it back</button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pre-order output</p>
            <p className="mt-2 break-all font-mono text-sm leading-6 text-slate-800 dark:text-slate-100">{liveSerialized || 'Tokens will appear here as the walk proceeds.'}</p>
          </div>

          {finishedDeserialization && <p className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">Tree rebuilt from {displayNodes.length} nodes.</p>}
          <div className="mt-6"><TreeVisualizer nodes={displayNodes} rootId={displayRootId} highlightedNodeId={activeStep?.nodeId} highlightedPathNodeIds={currentPath} /></div>
          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Start by serializing the sample tree.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Why the nulls matter</p>
          <h2 className="mt-3 text-xl font-semibold">Values alone lose shape.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Each null token marks an empty left or right child. Those placeholders preserve where branches stop, making the serialized sequence unambiguous to rebuild.</p>
          <p className="mt-5 border-t border-slate-800 pt-4 font-mono text-xs leading-5 text-slate-400">node, left subtree, right subtree</p>
        </aside>
      </main>
    </div>
  )
}