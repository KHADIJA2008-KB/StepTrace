'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { TreeComplexityCard } from '@/components/visualizer/TreeComplexityCard'
import { TreeModeToggle } from '@/components/visualizer/TreeModeToggle'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'

type OperationStep = Step & {
  nodeId: string
  treeAfter: TreeNode[]
}

type Operation = {
  kind: 'insert' | 'delete' | 'search'
  value: number
  steps: OperationStep[]
  log: string
}

const EMPTY_TREE: TreeNode[] = []

function copyTree(nodes: TreeNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function nodeId(value: number) {
  return `node-${value}`
}

function makeStep(type: string, nodeIdValue: string, message: string, treeAfter: TreeNode[]): OperationStep {
  return { type, indices: [], nodeId: nodeIdValue, description: message, treeAfter }
}

function createOperation(tree: TreeNode[], kind: Operation['kind'], value: number): Operation {
  const nextTree = copyTree(tree)
  const byId = new Map(nextTree.map((node) => [node.id, node]))
  const steps: OperationStep[] = []
  const newId = nodeId(value)
  let current = tree.length > 0 ? nextTree.find((node) => node.id === nextTree[0].id) : undefined
  let parent: TreeNode | undefined
  let direction: 'left' | 'right' | undefined

  while (current) {
    steps.push(makeStep('visit', current.id, `Compared ${value} with ${current.value}.`, tree))
    if (value === current.value) break
    parent = current
    direction = value < current.value ? 'left' : 'right'
    const childId = current[direction]
    current = childId ? byId.get(childId) : undefined
  }

  if (kind === 'search') {
    const message = current ? `Found ${value}.` : `${value} is not in the tree.`
    steps.push(makeStep('done', current?.id ?? (parent?.id ?? 'search'), message, tree))
    return { kind, value, steps, log: current ? `Found ${value}` : `${value} was not found` }
  }

  if (kind === 'insert') {
    if (current) {
      steps.push(makeStep('done', current.id, `${value} already exists.`, tree))
      return { kind, value, steps, log: `${value} already exists` }
    }

    const inserted: TreeNode = { id: newId, value, left: null, right: null, color: 'black' }
    nextTree.push(inserted)
    if (!parent || !direction) {
      steps.push(makeStep('done', newId, `Inserted ${value} as the root.`, nextTree))
    } else {
      parent[direction] = newId
      steps.push(makeStep('done', newId, `Inserted ${value} ${direction} of ${parent.value}.`, nextTree))
    }
    return { kind, value, steps, log: `Inserted ${value}` }
  }

  if (!current) {
    steps.push(makeStep('done', parent?.id ?? 'delete', `${value} was not found.`, tree))
    return { kind, value, steps, log: `${value} was not found` }
  }

  const deleted = current
  let log = `Deleted ${value}`
  if (deleted.left && deleted.right) {
    let successor = byId.get(deleted.right)
    while (successor?.left) successor = byId.get(successor.left)
    if (successor) {
      const successorValue = successor.value
      deleted.value = successorValue
      log = `Deleted ${value} (had two children, replaced with successor ${successorValue})`
      const successorParent = nextTree.find((node) => node.left === successor?.id || node.right === successor?.id)
      const successorChild = successor.right
      if (successorParent) {
        if (successorParent.left === successor.id) successorParent.left = successorChild
        else successorParent.right = successorChild
      }
      nextTree.splice(nextTree.findIndex((node) => node.id === successor.id), 1)
    }
  } else {
    const child = deleted.left ?? deleted.right
    const deletedParent = nextTree.find((node) => node.left === deleted.id || node.right === deleted.id)
    if (!deletedParent) {
      const index = nextTree.findIndex((node) => node.id === deleted.id)
      nextTree.splice(index, 1)
    } else if (deletedParent.left === deleted.id) deletedParent.left = child
    else deletedParent.right = child
    const index = nextTree.findIndex((node) => node.id === deleted.id)
    nextTree.splice(index, 1)
  }
  steps.push(makeStep('done', deleted.id, log, nextTree))
  return { kind, value, steps, log }
}

function randomValues(count: number) {
  const values = new Set<number>()
  while (values.size < count) values.add(Math.floor(Math.random() * 89) + 10)
  return Array.from(values)
}

export default function BstPage() {
  const [tree, setTree] = useState<TreeNode[]>(EMPTY_TREE)
  const [operation, setOperation] = useState<Operation | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [randomizing, setRandomizing] = useState(false)
  const randomQueue = useRef<number[]>([])
  const playerSteps = useMemo<Step[]>(() => operation?.steps ?? [], [operation])
  const player = useStepPlayer(playerSteps, 420)
  const { play } = player
  const activeStep = operation?.steps[player.currentStep]
  const visitedNodeIds = operation?.steps.slice(0, player.currentStep + 1).map((step) => step.nodeId) ?? []
  const rootId = tree[0]?.id ?? ''
  const isBusy = Boolean(operation) || randomizing

  function parseValue() {
    const value = Number(inputValue)
    return Number.isInteger(value) ? value : undefined
  }

  const startOperation = useCallback((kind: Operation['kind'], value: number) => {
    if (operation) return
    setOperation(createOperation(tree, kind, value))
    setInputValue('')
  }, [operation, tree])

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== operation.steps.length - 1) return
    const finalStep = operation.steps.at(-1)
    if (!finalStep) return
    setTree(finalStep.treeAfter)
    setHistory((items) => [operation.log, ...items].slice(0, 8))
    setOperation(null)
  }, [operation, player.currentStep])

  useEffect(() => {
    if (randomizing || operation || randomQueue.current.length === 0) return
    const value = randomQueue.current.shift()
    if (value === undefined) {
      setRandomizing(false)
      return
    }
    const timer = window.setTimeout(() => startOperation('insert', value), 250)
    return () => window.clearTimeout(timer)
  }, [operation, randomizing, startOperation, tree])

  useEffect(() => {
    if (!randomizing || operation || randomQueue.current.length > 0) return
    setRandomizing(false)
  }, [operation, randomizing])

  function handleRandomTree() {
    if (isBusy) return
    randomQueue.current = randomValues(7 + Math.floor(Math.random() * 4))
    setRandomizing(true)
  }

  function handleClear() {
    if (isBusy) return
    setTree([])
    setHistory((items) => ['Cleared tree', ...items].slice(0, 8))
  }

  const controls = operation ? player : { ...player, currentStep: -1, totalSteps: 0 }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Binary search tree</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Shape the search.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Insert, find, and remove values while the tree reorganizes around ordering.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <TreeModeToggle mode="bst" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Repeat the same sequence in AVL-balanced mode to compare shapes.</span>
        </div>
      </header>

      <main className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Binary search tree controls">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5 dark:border-slate-800">
            <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} type="number" placeholder="Value" aria-label="Tree value" className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            <button type="button" onClick={() => { const value = parseValue(); if (value !== undefined) startOperation('insert', value) }} disabled={isBusy} className="rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Insert</button>
            <button type="button" onClick={() => { const value = parseValue(); if (value !== undefined) startOperation('delete', value) }} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Delete</button>
            <button type="button" onClick={() => { const value = parseValue(); if (value !== undefined) startOperation('search', value) }} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Search</button>
            <button type="button" onClick={handleRandomTree} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Random tree</button>
            <button type="button" onClick={handleClear} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Clear</button>
          </div>

          <div className="mt-7">
            <TreeVisualizer nodes={tree} rootId={rootId} highlightedNodeId={activeStep?.nodeId} visitedNodeIds={visitedNodeIds} />
          </div>
          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.description ?? (tree.length === 0 ? 'Start by inserting a value.' : 'Choose an operation to explore the tree.')}</p>
          <div className="mt-4"><StepControls {...controls} currentStep={operation ? player.currentStep : -1} totalSteps={operation ? playerSteps.length : undefined} /></div>

          <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Operation history</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">{history.length > 0 ? history.map((item, index) => <p key={`${item}-${index}`}>{item}</p>) : <p className="text-slate-400">No operations yet.</p>}</div>
          </div>
          <div className="mt-5"><TreeComplexityCard /></div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">BST rules</p>
          <h2 className="mt-3 text-2xl font-semibold">Ordered by comparison.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Values smaller than a node go left; larger values go right. Each operation follows those links until it finds its target or an open position.</p>
          <div className="mt-6 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-400">Deleting a node with two children replaces it with the smallest value in its right subtree.</div>
        </aside>
      </main>
    </div>
  )
}