'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { lowestCommonAncestor, type TreeAnalysisStep } from '@/lib/algorithms/tree/treeAlgorithms'
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

export default function LcaPage() {
  const [valueA, setValueA] = useState('1')
  const [valueB, setValueB] = useState('7')
  const [steps, setSteps] = useState<TreeAnalysisStep[]>([])
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 500)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const path = activeStep?.pathNodeIds ?? []
  const visited = steps.slice(0, player.currentStep + 1).filter((step) => step.type === 'visit').map((step) => step.nodeId)
  const found = activeStep?.type === 'found' ? activeStep : undefined
  const missing = activeStep?.type === 'not-found' ? activeStep : undefined

  useEffect(() => {
    if (steps.length > 0) play()
  }, [steps, play])

  function runSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const first = Number(valueA)
    const second = Number(valueB)
    if (!Number.isFinite(first) || !Number.isFinite(second)) return
    reset()
    setSteps(lowestCommonAncestor(sampleTree, 'n10', first, second))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree relationship</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Find the shared ancestor.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Trace both root-to-node paths until they split. The last shared node is their lowest common ancestor.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Lowest common ancestor visualizer">
          <form onSubmit={runSearch} className="flex flex-wrap items-end gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Value A<input value={valueA} onChange={(event) => setValueA(event.target.value)} type="number" className="mt-2 block w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
            <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Value B<input value={valueB} onChange={(event) => setValueB(event.target.value)} type="number" className="mt-2 block w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
            <button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Find LCA</button>
          </form>

          {found && <div className="mt-5 rounded-xl border border-teal-300 bg-teal-50 px-5 py-4 text-center dark:border-teal-900 dark:bg-teal-950/60"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Lowest common ancestor</p><p className="mt-1 font-mono text-2xl font-bold text-teal-950 dark:text-teal-100">{found.value}</p></div>}
          {missing && <p className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200">{missing.message}</p>}

          <div className="mt-6"><TreeVisualizer nodes={sampleTree} rootId="n10" highlightedNodeId={activeStep?.nodeId} visitedNodeIds={visited} highlightedPathNodeIds={path} /></div>
          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Choose two values and trace their paths from the root.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">How to read it</p>
          <h2 className="mt-3 text-xl font-semibold">Follow the shared route.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">The teal path marks nodes on either search route. The highlighted divergence point is the deepest node they share before their branches separate.</p>
          <p className="mt-5 border-t border-slate-800 pt-4 text-sm text-slate-400">Sample values: 10, 5, 15, 3, 7, 12, 20, 1, 4</p>
        </aside>
      </main>
    </div>
  )
}