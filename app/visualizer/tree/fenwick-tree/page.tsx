'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FenwickTreeVisualizer } from '@/components/visualizer/FenwickTreeVisualizer'
import {
  buildFenwickTree,
  fenwickRangeQuery,
  fenwickUpdate,
  type FenwickStep,
} from '@/lib/algorithms/tree/fenwickTree'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

type Operation = {
  kind: 'build' | 'update' | 'query'
  steps: FenwickStep[]
  baseTree: number[]
  finalTree: number[]
  arrayAfter: number[]
  queryRange?: [number, number]
  updateIndex?: number
  newValue?: number
}

type QueryResult = {
  start: number
  end: number
  sum: number
}

function toPlayerSteps(steps: FenwickStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

function parseValues(input: string) {
  const parts = input.split(',').map((part) => part.trim())
  if (parts.length === 0 || parts.some((part) => part.length === 0)) return null
  const values = parts.map(Number)
  return values.every(Number.isFinite) ? values : null
}

function replayUpdates(base: number[], steps: FenwickStep[], currentStep: number) {
  const replayed = [...base]
  steps.slice(0, currentStep + 1).forEach((step) => {
    if (step.type === 'update' && step.value !== undefined && step.index > 0) replayed[step.index] = step.value
  })
  return replayed
}

export default function FenwickTreePage() {
  const [arrayInput, setArrayInput] = useState('3, 1, 4, 1, 5, 9, 2')
  const [values, setValues] = useState<number[]>([])
  const [tree, setTree] = useState<number[]>([])
  const [updateIndex, setUpdateIndex] = useState('2')
  const [delta, setDelta] = useState('5')
  const [queryStart, setQueryStart] = useState('1')
  const [queryEnd, setQueryEnd] = useState('5')
  const [operation, setOperation] = useState<Operation | null>(null)
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)

  const playerSteps = useMemo<Step[]>(() => toPlayerSteps(operation?.steps ?? []), [operation])
  const player = useStepPlayer(playerSteps, 420)
  const { play, reset } = player
  const activeStep = operation?.steps[player.currentStep]
  const isBusy = operation !== null
  const currentArray = operation?.kind === 'build' ? operation.arrayAfter : values
  const currentTree = operation
    ? operation.kind === 'query'
      ? operation.baseTree
      : replayUpdates(operation.baseTree, operation.steps, player.currentStep)
    : tree
  const visitedIndices = operation?.steps.slice(0, player.currentStep + 1).filter((step) => step.type === 'visit').map((step) => step.index) ?? []
  const activeInternalIndex = visitedIndices.at(-1) ?? null
  const previousInternalIndex = visitedIndices.length > 1 ? visitedIndices[visitedIndices.length - 2] : null
  const runningSum = operation?.steps.slice(0, player.currentStep + 1).filter((step) => step.type === 'sum-accumulate').at(-1)?.runningSum ?? null

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== operation.steps.length - 1) return
    setTree(operation.finalTree)
    setValues(operation.arrayAfter)
    if (operation.kind === 'query' && operation.queryRange) {
      setQueryResult({
        start: operation.queryRange[0],
        end: operation.queryRange[1],
        sum: operation.steps.at(-1)?.value ?? 0,
      })
    } else {
      setQueryResult(null)
    }
    setOperation(null)
  }, [operation, player.currentStep])

  function beginBuild() {
    if (isBusy) return
    const parsed = parseValues(arrayInput)
    if (!parsed) return
    const built = buildFenwickTree(parsed)
    setQueryResult(null)
    reset()
    setOperation({
      kind: 'build',
      steps: built.steps,
      baseTree: new Array<number>(parsed.length + 1).fill(0),
      finalTree: built.tree,
      arrayAfter: parsed,
    })
  }

  function beginUpdate() {
    if (isBusy || tree.length <= 1) return
    const index = Number(updateIndex)
    const change = Number(delta)
    if (!Number.isInteger(index) || index < 0 || index >= values.length || !Number.isFinite(change)) return
    const nextTree = [...tree]
    const steps = fenwickUpdate(nextTree, index, change)
    const nextValues = [...values]
    nextValues[index] += change
    setQueryResult(null)
    reset()
    setOperation({
      kind: 'update',
      steps,
      baseTree: [...tree],
      finalTree: nextTree,
      arrayAfter: nextValues,
      updateIndex: index,
      newValue: change,
    })
  }

  function beginQuery() {
    if (isBusy || tree.length <= 1) return
    const start = Number(queryStart)
    const end = Number(queryEnd)
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end >= values.length) return
    setQueryResult(null)
    reset()
    setOperation({
      kind: 'query',
      steps: fenwickRangeQuery(tree, start, end),
      baseTree: [...tree],
      finalTree: [...tree],
      arrayAfter: [...values],
      queryRange: [start, end],
    })
  }

  const queryRange = operation?.kind === 'query' ? operation.queryRange : null
  const highlightedArrayIndex = operation?.kind === 'update' ? operation.updateIndex : null

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Prefix-sum structure</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Index the useful sums.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Build, update, and query a Binary Indexed Tree while following its jumps.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Fenwick tree operations">
          <div className="grid gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:grid-cols-[minmax(240px,1.2fr)_minmax(220px,0.8fr)_minmax(270px,1fr)]">
            <form onSubmit={(event) => { event.preventDefault(); beginBuild() }} className="flex flex-wrap items-end gap-2">
              <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Array values
                <input value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} type="text" aria-label="Comma-separated array values" className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </label>
              <button type="submit" disabled={isBusy} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Build</button>
            </form>

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Index<input value={updateIndex} onChange={(event) => setUpdateIndex(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Delta<input value={delta} onChange={(event) => setDelta(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <button type="button" onClick={beginUpdate} disabled={isBusy || tree.length <= 1} className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:opacity-40 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950">Update</button>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Start<input value={queryStart} onChange={(event) => setQueryStart(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">End<input value={queryEnd} onChange={(event) => setQueryEnd(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <button type="button" onClick={beginQuery} disabled={isBusy || tree.length <= 1} className="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-40 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950">Range Query</button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/50">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">Why does this work?</p>
            <p className="mt-2 text-sm leading-6 text-teal-950 dark:text-teal-100">Every index has a lowest set bit: its rightmost 1 in binary. That bit tells the tree how large a block of values a cell stores. Adding it jumps to the next block that needs an update; subtracting it moves through disjoint blocks that complete a prefix sum.</p>
          </div>

          {queryResult && <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-center dark:border-emerald-900 dark:bg-emerald-950/60"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Range sum</p><p className="mt-1 font-mono text-2xl font-bold text-emerald-950 dark:text-emerald-100">Sum of [{queryResult.start},{queryResult.end}] = {queryResult.sum}</p></div>}

          <div className="mt-6">
            <FenwickTreeVisualizer
              values={currentArray}
              tree={currentTree}
              activeInternalIndex={activeInternalIndex}
              previousInternalIndex={previousInternalIndex}
              visitedInternalIndices={visitedIndices}
              queryRange={queryRange}
              updatedArrayIndex={highlightedArrayIndex}
              runningSum={runningSum}
              isQuerying={operation?.kind === 'query'}
            />
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? (values.length === 0 ? 'Build a Fenwick tree to begin.' : 'Choose an update or range query.')}</p>
          <div className="mt-4"><StepControls {...player} currentStep={operation ? player.currentStep : -1} totalSteps={operation ? playerSteps.length : undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Jump pattern</p>
          <h2 className="mt-3 text-xl font-semibold">One bit, two directions.</h2>
          <div className="mt-4 grid gap-3 border-t border-slate-800 pt-4 text-sm text-slate-300">
            <p><span className="font-mono text-teal-300">Update:</span> move forward by the lowest set bit.</p>
            <p><span className="font-mono text-teal-300">Query:</span> move backward by the lowest set bit.</p>
            <p><span className="font-mono text-teal-300">Indices:</span> array row is 0-based; internal row is 1-based.</p>
          </div>
        </aside>
      </main>
    </div>
  )
}