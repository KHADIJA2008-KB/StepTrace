'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import {
  inorderTraversal,
  levelOrderTraversal,
  morrisInorderTraversal,
  postorderTraversal,
  preorderTraversal,
  type TreeStep,
} from '@/lib/algorithms/tree/traversals'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

const sampleTree: TreeNode[] = [
  { id: 'root', value: 5, left: 'left', right: 'right', color: 'black' },
  { id: 'left', value: 3, left: 'left-left', right: 'left-right', color: 'black' },
  { id: 'right', value: 8, left: 'right-left', right: 'right-right', color: 'black' },
  { id: 'left-left', value: 1, left: null, right: null, color: 'black' },
  { id: 'left-right', value: 4, left: null, right: null, color: 'black' },
  { id: 'right-left', value: 7, left: null, right: null, color: 'black' },
  { id: 'right-right', value: 9, left: null, right: null, color: 'black' },
]

const traversalOptions = {
  preorder: {
    label: 'Preorder',
    run: preorderTraversal,
    summary: 'Visit the node before its children.',
    useCase: 'Useful for copying a tree or creating a prefix expression.',
  },
  inorder: {
    label: 'Inorder',
    run: inorderTraversal,
    summary: 'Visit the left subtree, then the node, then the right subtree.',
    useCase: 'A binary search tree produces sorted values in this order.',
  },
  postorder: {
    label: 'Postorder',
    run: postorderTraversal,
    summary: 'Visit both children before visiting the node.',
    useCase: 'Useful for deleting a tree or evaluating expression trees.',
  },
  'level-order': {
    label: 'Level-order',
    run: levelOrderTraversal,
    summary: 'Visit every node from top to bottom, left to right.',
    useCase: 'Useful when distance from the root or breadth matters.',
  },
  morris: {
    label: 'Morris inorder',
    run: morrisInorderTraversal,
    summary: 'Perform inorder traversal with temporary links and no stack.',
    useCase: 'Useful when inorder traversal needs constant auxiliary space.',
  },
} as const

type TraversalKey = keyof typeof traversalOptions

function toPlayerSteps(steps: TreeStep[]): Step[] {
  return steps.map((step) => ({
    type: step.type,
    indices: [],
    description: step.message,
  }))
}

export default function TreeTraversalPage() {
  const [traversal, setTraversal] = useState<TraversalKey>('preorder')
  const option = traversalOptions[traversal]
  const treeSteps = useMemo(() => option.run(sampleTree, 'root'), [option])
  const playerSteps = useMemo(() => toPlayerSteps(treeSteps), [treeSteps])
  const player = useStepPlayer(playerSteps, 500)
  const { play } = player
  const currentTreeStep = player.currentStep >= 0 ? treeSteps[player.currentStep] : undefined
  const visitedNodeIds = treeSteps
    .slice(0, player.currentStep + 1)
    .filter((step) => step.type === 'visit')
    .map((step) => step.nodeId)
  const visitOrder = visitedNodeIds.map((nodeId) => sampleTree.find((node) => node.id === nodeId)?.value ?? nodeId)
  const highlightedNodeId = currentTreeStep?.type === 'done' ? null : currentTreeStep?.nodeId

  useEffect(() => {
    play()
  }, [traversal, play])

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>

      <header className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree traversal</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Walk the branches.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Follow the order each algorithm uses to turn a hierarchy into a sequence.</p>
        </div>
        <label className="flex shrink-0 flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Traversal type
          <select
            value={traversal}
            onChange={(event) => setTraversal(event.target.value as TraversalKey)}
            className="min-w-48 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-medium normal-case tracking-normal text-slate-900 outline-none transition focus:border-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {Object.entries(traversalOptions).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
          </select>
        </label>
      </header>

      <main className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Tree traversal animation">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Sample tree</p>
              <p className="mt-1 text-sm text-slate-500">{option.label} traversal</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">{sampleTree.length} nodes</span>
          </div>

          <div className="mt-7">
            <TreeVisualizer nodes={sampleTree} rootId="root" highlightedNodeId={highlightedNodeId} visitedNodeIds={visitedNodeIds} />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Visit order</p>
            <p className="mt-2 min-h-6 font-mono text-sm text-slate-700 dark:text-slate-200">
              {visitOrder.length > 0 ? `Visited: ${visitOrder.join(' → ')}` : 'Visited: —'}
            </p>
          </div>

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{currentTreeStep?.message ?? 'Ready to traverse the sample tree.'}</p>
          <div className="mt-4">
            <StepControls {...player} currentStep={player.currentStep} totalSteps={playerSteps.length} />
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800" aria-label="Traversal explanations">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">How to read it</p>
          <h2 className="mt-3 text-2xl font-semibold">{option.label}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{option.summary}</p>
          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Good for</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{option.useCase}</p>
          </div>
          <div className="mt-6 grid gap-3 border-t border-slate-800 pt-5 text-sm">
            {Object.values(traversalOptions).map((item) => (
              <div key={item.label} className={item.label === option.label ? 'text-teal-300' : 'text-slate-500'}>{item.label}</div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  )
}