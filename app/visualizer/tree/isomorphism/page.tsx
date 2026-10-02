'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { checkIsomorphic, type TreeAnalysisStep } from '@/lib/algorithms/tree/treeAlgorithms'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

const treeA: TreeNode[] = [
  { id: 'a-root', value: 5, left: 'a-left', right: 'a-right', color: 'black' },
  { id: 'a-left', value: 3, left: 'a-leaf', right: null, color: 'black' },
  { id: 'a-right', value: 8, left: null, right: null, color: 'black' },
  { id: 'a-leaf', value: 1, left: null, right: null, color: 'black' },
]

const matchingTree: TreeNode[] = [
  { id: 'b-root', value: 50, left: 'b-left', right: 'b-right', color: 'black' },
  { id: 'b-left', value: 30, left: 'b-leaf', right: null, color: 'black' },
  { id: 'b-right', value: 80, left: null, right: null, color: 'black' },
  { id: 'b-leaf', value: 10, left: null, right: null, color: 'black' },
]

const mismatchingTree: TreeNode[] = [
  { id: 'c-root', value: 50, left: 'c-left', right: 'c-right', color: 'black' },
  { id: 'c-left', value: 30, left: null, right: 'c-leaf', color: 'black' },
  { id: 'c-right', value: 80, left: null, right: null, color: 'black' },
  { id: 'c-leaf', value: 10, left: null, right: null, color: 'black' },
]

function toPlayerSteps(steps: TreeAnalysisStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

export default function IsomorphismPage() {
  const [comparison, setComparison] = useState<'matching' | 'mismatch'>('matching')
  const [steps, setSteps] = useState<TreeAnalysisStep[]>([])
  const [hasCompared, setHasCompared] = useState(false)
  const nodesB = comparison === 'matching' ? matchingTree : mismatchingTree
  const rootB = comparison === 'matching' ? 'b-root' : 'c-root'
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 480)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const matchedPairs = activeStep?.matchedPairs ?? []
  const matchedA = matchedPairs.map((pair) => pair.nodeId)
  const matchedB = matchedPairs.map((pair) => pair.otherNodeId)
  const isomorphic = activeStep?.type === 'found'
  const mismatch = activeStep?.type === 'mismatch' || activeStep?.type === 'not-found' ? activeStep : undefined
  const finalNotIsomorphic = activeStep?.type === 'not-found'

  useEffect(() => {
    if (steps.length > 0) play()
  }, [steps, play])

  function compareTrees() {
    reset()
    setSteps(checkIsomorphic(treeA, 'a-root', nodesB, rootB))
    setHasCompared(true)
  }

  function chooseComparison(value: 'matching' | 'mismatch') {
    reset()
    setSteps([])
    setHasCompared(false)
    setComparison(value)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree structure</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Same shape, different labels?</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Compare two trees in parallel. Isomorphism checks structure, not the values stored in nodes.</p>
      </header>

      <main className="mt-9">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Tree isomorphism comparison">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 dark:border-slate-700 dark:bg-slate-900" aria-label="Choose comparison case">
              <button type="button" onClick={() => chooseComparison('matching')} aria-pressed={comparison === 'matching'} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${comparison === 'matching' ? 'bg-teal-500 text-slate-950' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>Same structure</button>
              <button type="button" onClick={() => chooseComparison('mismatch')} aria-pressed={comparison === 'mismatch'} className={`rounded-md px-3 py-2 text-sm font-semibold transition ${comparison === 'mismatch' ? 'bg-rose-500 text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>Different structure</button>
            </div>
            <button type="button" onClick={compareTrees} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-600 dark:bg-white dark:text-slate-900">Compare trees</button>
          </div>

          {isomorphic && <p className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-center font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">Isomorphic: every child position matches.</p>}
          {finalNotIsomorphic && <p className="mt-5 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-center font-semibold text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-100">Not isomorphic: the child structure differs.</p>}

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <article className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Tree A</h2>
              <TreeVisualizer nodes={treeA} rootId="a-root" matchedNodeIds={matchedA} mismatchNodeId={mismatch?.mismatchSide === 'b' ? mismatch.nodeId : null} />
            </article>
            <article className="min-w-0 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Tree B</h2>
              <TreeVisualizer nodes={nodesB} rootId={rootB} matchedNodeIds={matchedB} mismatchNodeId={mismatch?.mismatchSide === 'a' ? mismatch.nodeId : null} />
            </article>
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? (hasCompared ? 'Comparison complete.' : 'Choose a case and compare the trees.')}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
          <div className="mt-4 flex gap-5 text-xs text-slate-500 dark:text-slate-400"><span className="inline-flex items-center gap-2"><i className="size-3 rounded-full border-2 border-emerald-600" />Matching structure</span><span className="inline-flex items-center gap-2"><i className="size-3 rounded-full border-2 border-rose-600" />First mismatch</span></div>
        </section>
      </main>
    </div>
  )
}