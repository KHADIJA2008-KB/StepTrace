'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { heapSort, type HeapSortStep } from '@/lib/algorithms/tree/heapSort'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

function parseArray(input: string) {
  const parts = input.split(',').map((part) => part.trim())
  if (!parts.length || parts.some((part) => part.length === 0)) return null
  const values = parts.map(Number)
  return values.every(Number.isFinite) ? values : null
}

function toPlayerSteps(steps: HeapSortStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: step.indices, array: step.array, description: step.message }))
}

export default function HeapSortPage() {
  const [arrayInput, setArrayInput] = useState('7, 2, 9, 1, 5, 8, 3')
  const [initialValues, setInitialValues] = useState<number[]>([])
  const [steps, setSteps] = useState<HeapSortStep[]>([])
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 360)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const values = activeStep?.array ?? initialValues
  const heapSize = activeStep?.heapSize ?? 0
  const activeIndices = new Set(activeStep?.indices ?? [])
  const isComplete = activeStep?.type === 'done'

  useEffect(() => {
    if (steps.length > 0) play()
  }, [steps, play])

  function runSort(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = parseArray(arrayInput)
    if (!parsed) return
    reset()
    setInitialValues(parsed)
    setSteps(heapSort(parsed))
  }

  const treeNodes: TreeNode[] = activeStep?.treeNodes ?? []
  const heapNodeIds = Array.from(activeIndices).filter((index) => index < heapSize).map((index) => `heap-${index}`)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">In-place sorting</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Sort through the heap.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Build a max-heap, move each maximum to the sorted tail, and restore the remaining heap.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Heap sort visualizer">
          <form onSubmit={runSort} className="flex flex-wrap items-end gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
            <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Array values
              <input value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} type="text" aria-label="Comma-separated array values" className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </label>
            <button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Sort</button>
          </form>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Max-heap tree</p><p className="mt-1 text-sm text-slate-500">{activeStep ? `${heapSize} values remain in the heap` : 'Tree view appears during sorting'}</p></div>
            {isComplete && <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">Sorted</span>}
          </div>
          <div className="mt-3"><TreeVisualizer nodes={treeNodes} rootId={activeStep?.rootId ?? ''} visitedNodeIds={heapNodeIds} highlightedNodeId={heapNodeIds.at(-1)} /></div>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Array</h2><span className="text-xs text-slate-400">Heap prefix · sorted suffix</span></div>
            <div className="overflow-x-auto pb-2"><div className="flex min-w-max gap-2">
              {values.map((value, index) => {
                const isActive = activeIndices.has(index)
                const isSorted = isComplete || (activeStep !== undefined && index >= heapSize)
                return <div key={index} className={`grid h-16 w-16 shrink-0 grid-rows-[1fr_auto] place-items-center rounded-lg border transition-colors ${isActive ? 'border-amber-400 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100' : isSorted ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'}`}><span className="self-end font-mono text-lg font-bold">{value}</span><span className="self-center font-mono text-[10px] text-slate-400">{index}</span></div>
              })}
            </div></div>
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Enter values and sort to build a max-heap.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Two phases</p>
          <h2 className="mt-3 text-xl font-semibold">Heap first, sorted tail second.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">The max-heap keeps its largest value at the root. Each extraction moves that value to the array’s end, then sifts the new root down through the remaining heap.</p>
        </aside>
      </main>
    </div>
  )
}