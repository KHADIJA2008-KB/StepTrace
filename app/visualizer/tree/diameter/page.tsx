'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { treeDiameter, type TreeAnalysisStep } from '@/lib/algorithms/tree/treeAlgorithms'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

const sampleTree: TreeNode[] = [
  { id: 'n10', value: 10, left: 'n5', right: 'n15', color: 'black' },
  { id: 'n5', value: 5, left: 'n3', right: 'n7', color: 'black' },
  { id: 'n15', value: 15, left: 'n12', right: 'n20', color: 'black' },
  { id: 'n3', value: 3, left: 'n1', right: 'n4', color: 'black' },
  { id: 'n7', value: 7, left: null, right: null, color: 'black' },
  { id: 'n12', value: 12, left: null, right: null, color: 'black' },
  { id: 'n20', value: 20, left: null, right: null, color: 'black' },
  { id: 'n1', value: 1, left: null, right: null, color: 'black' },
  { id: 'n4', value: 4, left: null, right: null, color: 'black' },
]

function toPlayerSteps(steps: TreeAnalysisStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

export default function TreeDiameterPage() {
  const [steps, setSteps] = useState<TreeAnalysisStep[]>([])
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 500)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const pathNodeIds = activeStep?.pathNodeIds ?? []
  const finalStep = steps.at(-1)
  const isComplete = activeStep?.type === 'diameter'

  useEffect(() => {
    if (steps.length > 0) play()
  }, [steps, play])

  function calculate() {
    reset()
    setSteps(treeDiameter(sampleTree, 'n10'))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree measurement</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Measure the longest route.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Calculate subtree heights bottom-up and keep the longest path found so far in view.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Tree diameter visualizer">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Sample tree</p><p className="mt-1 text-sm text-slate-500">Diameter is measured in edges.</p></div>
            <button type="button" onClick={calculate} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Calculate diameter</button>
          </div>

          {activeStep && <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Height at current subtree</p><p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-white">{activeStep.height ?? '—'}</p></div>
            <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 dark:border-teal-900 dark:bg-teal-950/50"><p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">Longest path so far</p><p className="mt-1 font-mono text-xl font-bold text-teal-950 dark:text-teal-100">{activeStep.diameter ?? 0} edges</p></div>
          </div>}

          {isComplete && <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-center dark:border-emerald-900 dark:bg-emerald-950/60"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Final diameter</p><p className="mt-1 font-mono text-2xl font-bold text-emerald-950 dark:text-emerald-100">{finalStep?.diameter} edges</p><p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">Path: {pathNodeIds.map((id) => sampleTree.find((node) => node.id === id)?.value).join(' → ')}</p></div>}

          <div className="mt-6"><TreeVisualizer nodes={sampleTree} rootId="n10" highlightedNodeId={activeStep?.nodeId} highlightedPathNodeIds={pathNodeIds} /></div>
          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Calculate to trace the post-order height pass.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Post-order pass</p>
          <h2 className="mt-3 text-xl font-semibold">Children first, parent next.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">At each node, the algorithm combines the child heights. The longest path through that node uses the deepest route on each side; the global best is retained as the walk returns toward the root.</p>
          <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-400">Sample values: 10, 5, 15, 3, 7, 12, 20, 1, 4</p>
        </aside>
      </main>
    </div>
  )
}