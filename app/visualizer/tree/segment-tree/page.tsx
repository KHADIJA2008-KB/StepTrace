'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SegmentTreeVisualizer } from '@/components/visualizer/SegmentTreeVisualizer'
import {
  buildSegmentTree,
  querySegmentTree,
  updateSegmentTree,
  type SegNode,
  type SegmentTreeStep,
} from '@/lib/algorithms/tree/segmentTree'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

type Operation = {
  kind: 'build' | 'query' | 'update'
  steps: SegmentTreeStep[]
  rootId: string
  arraySnapshot: number[]
  queryRange?: [number, number]
  updateIndex?: number
  newValue?: number
}

type QueryResult = {
  start: number
  end: number
  sum: number
}

function toPlayerSteps(steps: SegmentTreeStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

function parseArrayInput(input: string) {
  const values = input.split(',').map((part) => Number(part.trim()))
  return values.length > 0 && values.every(Number.isFinite) ? values : null
}

export default function SegmentTreePage() {
  const [arrayInput, setArrayInput] = useState('4, 7, 2, 9, 1, 5, 8')
  const [values, setValues] = useState<number[]>([])
  const [nodes, setNodes] = useState<SegNode[]>([])
  const [rootId, setRootId] = useState('')
  const [queryStart, setQueryStart] = useState('1')
  const [queryEnd, setQueryEnd] = useState('4')
  const [updateIndex, setUpdateIndex] = useState('2')
  const [newValue, setNewValue] = useState('12')
  const [operation, setOperation] = useState<Operation | null>(null)
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null)

  const playerSteps = useMemo(() => toPlayerSteps(operation?.steps ?? []), [operation])
  const player = useStepPlayer(playerSteps, 450)
  const { play } = player
  const activeStep = operation?.steps[player.currentStep]
  const displayNodes = activeStep?.treeAfter ?? nodes
  const displayRootId = operation?.kind === 'build' ? operation.rootId : rootId
  const displayedValues = operation?.kind === 'build' ? operation.arraySnapshot : values
  const nodeStates = new Map<string, 'in-range' | 'partial' | 'out-of-range'>()
  operation?.steps.slice(0, player.currentStep + 1).forEach((step) => {
    if (step.type === 'in-range' || step.type === 'partial' || step.type === 'out-of-range') {
      nodeStates.set(step.nodeId, step.type)
    }
  })
  const isBusy = operation !== null
  const activeQueryRange = operation?.kind === 'query' ? operation.queryRange : null
  const activeUpdateIndex = operation?.kind === 'update' ? operation.updateIndex : null

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== operation.steps.length - 1) return
    const finalStep = operation.steps.at(-1)
    if (!finalStep) return

    if (operation.kind === 'build') {
      setNodes(finalStep.treeAfter)
      setRootId(operation.rootId)
      setValues(operation.arraySnapshot)
      setQueryResult(null)
    } else if (operation.kind === 'update') {
      setNodes(finalStep.treeAfter)
      setValues((current) => {
        const next = [...current]
        if (operation.updateIndex !== undefined && operation.newValue !== undefined) next[operation.updateIndex] = operation.newValue
        return next
      })
      setQueryResult(null)
    } else if (operation.queryRange && finalStep.querySum !== undefined) {
      setQueryResult({ start: operation.queryRange[0], end: operation.queryRange[1], sum: finalStep.querySum })
    }
    setOperation(null)
  }, [operation, player.currentStep])

  function beginBuild() {
    if (isBusy) return
    const parsed = parseArrayInput(arrayInput)
    if (!parsed || parsed.length === 0) return
    const result = buildSegmentTree(parsed)
    setQueryResult(null)
    setOperation({ kind: 'build', steps: result.steps, rootId: result.rootId, arraySnapshot: parsed })
  }

  function beginQuery() {
    if (isBusy || nodes.length === 0) return
    const start = Number(queryStart)
    const end = Number(queryEnd)
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end >= values.length) return
    setQueryResult(null)
    setOperation({
      kind: 'query',
      steps: querySegmentTree(nodes, rootId, start, end),
      rootId,
      arraySnapshot: values,
      queryRange: [start, end],
    })
  }

  function beginUpdate() {
    if (isBusy || nodes.length === 0) return
    const index = Number(updateIndex)
    const value = Number(newValue)
    if (!Number.isInteger(index) || index < 0 || index >= values.length || !Number.isFinite(value)) return
    setQueryResult(null)
    setOperation({
      kind: 'update',
      steps: updateSegmentTree(nodes, rootId, index, value),
      rootId,
      arraySnapshot: values,
      updateIndex: index,
      newValue: value,
    })
  }

  const highlightedNodeId = activeStep?.nodeId || null
  const statusMessage = activeStep?.message ?? (nodes.length === 0 ? 'Build a segment tree to begin.' : 'Choose a query or update.')

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Range-sum structure</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Sum by segments.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">See how covered ranges contribute directly while partial ranges recurse into smaller segments.</p>
      </header>

      <main className="mt-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Segment tree operations">
          <div className="grid gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 lg:grid-cols-[minmax(240px,1.2fr)_minmax(240px,1fr)_minmax(240px,1fr)]">
            <form onSubmit={(event) => { event.preventDefault(); beginBuild() }} className="flex flex-wrap items-end gap-2">
              <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Array values
                <input value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} type="text" aria-label="Comma-separated array values" className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
              </label>
              <button type="submit" disabled={isBusy} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Build</button>
            </form>

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Start<input value={queryStart} onChange={(event) => setQueryStart(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">End<input value={queryEnd} onChange={(event) => setQueryEnd(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <button type="button" onClick={beginQuery} disabled={isBusy || nodes.length === 0} className="rounded-lg border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-40 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950">Query Sum</button>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Index<input value={updateIndex} onChange={(event) => setUpdateIndex(event.target.value)} type="number" className="mt-2 block w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">New value<input value={newValue} onChange={(event) => setNewValue(event.target.value)} type="number" className="mt-2 block w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /></label>
              <button type="button" onClick={beginUpdate} disabled={isBusy || nodes.length === 0} className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:opacity-40 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950">Update</button>
            </div>
          </div>

          {queryResult && <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-center dark:border-emerald-900 dark:bg-emerald-950/60"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Query result</p><p className="mt-1 font-mono text-2xl font-bold text-emerald-950 dark:text-emerald-100">Sum of [{queryResult.start},{queryResult.end}] = {queryResult.sum}</p></div>}

          <div className="mt-6">
            <SegmentTreeVisualizer
              values={displayedValues}
              nodes={displayNodes}
              rootId={displayRootId}
              queryRange={activeQueryRange}
              updatedIndex={activeUpdateIndex}
              highlightedNodeId={highlightedNodeId}
              nodeStates={nodeStates}
            />
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{statusMessage}</p>
          <div className="mt-4"><StepControls {...player} currentStep={operation ? player.currentStep : -1} totalSteps={operation ? playerSteps.length : undefined} /></div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-600 dark:text-slate-300" aria-label="Query legend">
            <span className="inline-flex items-center gap-2"><i className="size-3 rounded-sm bg-emerald-500" />Fully covered: contributes</span>
            <span className="inline-flex items-center gap-2"><i className="size-3 rounded-sm bg-amber-400" />Partially covered: recurse</span>
            <span className="inline-flex items-center gap-2"><i className="size-3 rounded-sm bg-slate-400" />Outside query: skipped</span>
          </div>
        </section>
      </main>
    </div>
  )
}