'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { rbInsert, type RBStep } from '@/lib/algorithms/tree/redBlackTree'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

type Operation = {
  kind: 'insert' | 'search'
  value: number
  steps: RBStep[]
  log: string
}

const SAMPLE_VALUES = [10, 20, 30, 15, 25, 5, 1, 7]

function copyTree(nodes: TreeNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function findRoot(nodes: TreeNode[]) {
  return nodes.find((node) => !nodes.some((candidate) => candidate.left === node.id || candidate.right === node.id))?.id ?? null
}

function searchOperation(nodes: TreeNode[], value: number): Operation {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const steps: RBStep[] = []
  let current = findRoot(nodes)
  while (current) {
    const node = byId.get(current)
    if (!node) break
    steps.push({ type: 'compare', nodeId: node.id, message: `Compared ${value} with ${node.value}.`, treeAfter: copyTree(nodes) })
    if (value === node.value) {
      steps.push({ type: 'found', nodeId: node.id, message: `Found ${value}.`, treeAfter: copyTree(nodes) })
      return { kind: 'search', value, steps, log: `Found ${value}` }
    }
    current = value < node.value ? node.left : node.right
  }
  steps.push({ type: 'not-found', nodeId: findRoot(nodes) ?? 'search', message: `${value} was not found.`, treeAfter: copyTree(nodes) })
  return { kind: 'search', value, steps, log: `${value} was not found` }
}

function randomValues(count: number) {
  const values = new Set<number>()
  while (values.size < count) values.add(Math.floor(Math.random() * 89) + 10)
  return Array.from(values)
}

export default function RedBlackTreePage() {
  const [nodes, setNodes] = useState<TreeNode[]>([])
  const [operation, setOperation] = useState<Operation | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [randomizing, setRandomizing] = useState(false)
  const randomQueue = useRef<number[]>([])
  const playerSteps = useMemo<Step[]>(() => operation?.steps.map((step) => ({ type: step.type, indices: [], description: step.message })) ?? [], [operation])
  const player = useStepPlayer(playerSteps, 420)
  const { play } = player
  const activeStep = operation?.steps[player.currentStep]
  const previousStep = operation?.steps[player.currentStep - 1]
  const displayNodes = activeStep?.treeAfter ?? nodes
  const rootId = findRoot(displayNodes) ?? ''
  const visitedNodeIds = operation?.steps.slice(0, player.currentStep + 1).filter((step) => step.type === 'compare' || step.type === 'insert').map((step) => step.nodeId) ?? []
  const isBusy = Boolean(operation) || randomizing
  const fixupLog = operation?.steps.slice(0, player.currentStep + 1).filter((step) => step.type === 'recolor' || step.type === 'rotate').map((step) => step.message) ?? []
  const rotationAnimation = activeStep?.type === 'rotate' && previousStep
    ? { beforeNodes: previousStep.treeAfter, key: player.currentStep }
    : undefined
  const colorAnimation = activeStep?.type === 'recolor' && previousStep
    ? { beforeNodes: previousStep.treeAfter, key: player.currentStep }
    : undefined

  const startOperation = useCallback((kind: Operation['kind'], value: number) => {
    if (operation) return
    const steps = kind === 'insert' ? rbInsert(nodes, findRoot(nodes), value) : searchOperation(nodes, value).steps
    setOperation({ kind, value, steps, log: steps.at(-1)?.message ?? `${kind} ${value}` })
    setInputValue('')
  }, [nodes, operation])

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== operation.steps.length - 1) return
    const finalStep = operation.steps.at(-1)
    if (!finalStep) return
    if (operation.kind === 'insert') setNodes(finalStep.treeAfter)
    setHistory((items) => [operation.log, ...items].slice(0, 10))
    setOperation(null)
  }, [operation, player.currentStep])

  useEffect(() => {
    if (randomizing || operation || randomQueue.current.length === 0) return
    const value = randomQueue.current.shift()
    if (value === undefined) {
      setRandomizing(false)
      return
    }
    const timer = window.setTimeout(() => startOperation('insert', value), 240)
    return () => window.clearTimeout(timer)
  }, [nodes, operation, randomizing, startOperation])

  useEffect(() => {
    if (randomizing && !operation && randomQueue.current.length === 0) setRandomizing(false)
  }, [operation, randomizing])

  function valueFromInput() {
    const value = Number(inputValue)
    return Number.isInteger(value) ? value : undefined
  }

  function loadRandomTree() {
    if (isBusy) return
    randomQueue.current = randomValues(7 + Math.floor(Math.random() * 4))
    setRandomizing(true)
  }

  function handleClear() {
    if (isBusy) return
    setNodes([])
    setHistory((items) => ['Cleared tree', ...items].slice(0, 10))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Red-black tree</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Balance through color.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Follow comparisons, recolors, and rotations as every insert preserves the red-black rules.</p>
      </header>

      <main className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Red-black tree controls">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5 dark:border-slate-800">
            <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} type="number" placeholder="Value" aria-label="Tree value" className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            <button type="button" onClick={() => { const value = valueFromInput(); if (value !== undefined) startOperation('insert', value) }} disabled={isBusy} className="rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Insert</button>
            <button type="button" onClick={() => { const value = valueFromInput(); if (value !== undefined) startOperation('search', value) }} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Search</button>
            <button type="button" onClick={loadRandomTree} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Random tree</button>
            <button type="button" onClick={handleClear} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Clear</button>
          </div>

          <div className="relative mt-7">
            <TreeVisualizer nodes={displayNodes} rootId={rootId} highlightedNodeId={activeStep?.nodeId} visitedNodeIds={visitedNodeIds} rotationAnimation={rotationAnimation} colorAnimation={colorAnimation} />
            {activeStep?.type === 'rotate' && <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 shadow-lg animate-pulse">{activeStep.rotationType === 'left' ? 'Left' : 'Right'} Rotation</div>}
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? (nodes.length === 0 ? 'Start by inserting a value.' : 'Choose an operation to explore the tree.')}</p>
          <div className="mt-4"><StepControls {...player} currentStep={operation ? player.currentStep : -1} totalSteps={operation ? playerSteps.length : undefined} /></div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Fix-up log</p>
            <div className="mt-2 grid gap-1 text-sm text-slate-700 dark:text-slate-200">{fixupLog.length > 0 ? fixupLog.map((message, index) => <p key={`${message}-${index}`}>{message}</p>) : <p className="text-slate-400">No fix-up steps yet.</p>}</div>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">History</p>
            <div className="mt-2 grid gap-1 text-sm text-slate-600 dark:text-slate-300">{history.length > 0 ? history.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p className="text-slate-400">No operations yet.</p>}</div>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Color rules</p>
          <h2 className="mt-3 text-2xl font-semibold">Red nodes cannot touch.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Every inserted leaf starts red. Recoloring handles red uncles; rotations handle black uncles. The root is confirmed black before each operation completes.</p>
          <div className="mt-6 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-400">Demo sequence: {SAMPLE_VALUES.join(' → ')}</div>
        </aside>
      </main>
    </div>
  )
}