'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { avlInsert } from '@/lib/algorithms/tree/avl'
import { bstInsert } from '@/lib/algorithms/tree/bst'
import { rbInsert } from '@/lib/algorithms/tree/redBlackTree'
import type { TreeNode } from '@/lib/algorithms/tree/treeTypes'

type ComparisonTree = {
  nodes: TreeNode[]
  rootId: string
}

type ComparisonTrees = {
  bst: ComparisonTree
  avl: ComparisonTree
  redBlack: ComparisonTree
}

const emptyTrees: ComparisonTrees = {
  bst: { nodes: [], rootId: '' },
  avl: { nodes: [], rootId: '' },
  redBlack: { nodes: [], rootId: '' },
}

const panels = [
  {
    key: 'bst',
    title: 'BST',
    subtitle: 'No balancing',
    description: 'Insertion order shapes the tree. Sorted input can make it a chain.',
    color: 'text-rose-600 dark:text-rose-400',
  },
  {
    key: 'avl',
    title: 'AVL',
    subtitle: 'Strict height balance',
    description: 'Rotations keep subtree heights within one level of each other.',
    color: 'text-teal-600 dark:text-teal-400',
  },
  {
    key: 'redBlack',
    title: 'Red-Black',
    subtitle: 'Relaxed color balance',
    description: 'Recoloring and rotations limit height while allowing more flexibility.',
    color: 'text-slate-800 dark:text-slate-200',
  },
] as const

export default function TreeComparePage() {
  const [trees, setTrees] = useState(emptyTrees)
  const [input, setInput] = useState('')
  const [sequence, setSequence] = useState<number[]>([])

  function insertValue(value: number) {
    const bstRoot = trees.bst.rootId || 'bst-root'
    const bstResult = bstInsert(trees.bst.nodes, bstRoot, value)
    const avlSteps = avlInsert(trees.avl.nodes, trees.avl.rootId || 'avl-root', value)
    const rbSteps = rbInsert(trees.redBlack.nodes, trees.redBlack.rootId || null, value)
    const avlNodes = avlSteps.at(-1)?.treeAfter ?? trees.avl.nodes
    const rbNodes = rbSteps.at(-1)?.treeAfter ?? trees.redBlack.nodes

    setTrees({
      bst: { nodes: bstResult.tree, rootId: trees.bst.rootId || bstResult.tree[0]?.id || '' },
      avl: { nodes: avlNodes, rootId: avlNodes[0]?.id ?? '' },
      redBlack: {
        nodes: rbNodes,
        rootId: rbNodes.find((node) => !rbNodes.some((candidate) => candidate.left === node.id || candidate.right === node.id))?.id ?? '',
      },
    })
    setSequence((values) => [...values, value])
    setInput('')
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = Number(input)
    if (input.trim() && Number.isInteger(value)) insertValue(value)
  }

  function clearTrees() {
    setTrees(emptyTrees)
    setSequence([])
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Tree comparison</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">One sequence, three shapes.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Each value is inserted into all three trees at once. Try ascending values to see how balancing changes their structure.</p>
      </header>

      <section className="mt-9 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-end sm:justify-between" aria-label="Shared tree insertion">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
          <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
            Insert value into all trees
            <input
              type="number"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. 30"
              className="mt-2 block w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </label>
          <button type="submit" disabled={!input.trim()} className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40">Insert</button>
          <button type="button" onClick={clearTrees} disabled={sequence.length === 0} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Clear</button>
        </form>
        <div className="min-w-0 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Shared sequence:</span>{' '}
          {sequence.length > 0 ? sequence.join(' → ') : 'No values inserted'}
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3" aria-label="Side-by-side tree comparison">
        {panels.map((panel) => {
          const tree = trees[panel.key]
          return (
            <article key={panel.key} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                <div>
                  <h2 className={`text-xl font-bold ${panel.color}`}>{panel.title}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.13em] text-slate-400">{panel.subtitle}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tree.nodes.length} nodes</span>
              </div>
              <p className="min-h-12 py-3 text-sm leading-5 text-slate-500 dark:text-slate-400">{panel.description}</p>
              <TreeVisualizer nodes={tree.nodes} rootId={tree.rootId} />
            </article>
          )
        })}
      </section>
    </div>
  )
}