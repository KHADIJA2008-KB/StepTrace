'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TrieVisualizer } from '@/components/visualizer/TrieVisualizer'
import { trieInsert, trieSearch, trieStartsWith, type TrieNode, type TrieStep } from '@/lib/algorithms/tree/trie'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

type Operation = { kind: 'insert' | 'search' | 'prefix'; value: string; steps: TrieStep[]; log?: string }
const SAMPLE_WORDS = ['cat', 'car', 'cart', 'dog', 'door', 'dove', 'apple']

function toPlayerSteps(steps: TrieStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

function randomDelay() {
  return new Promise((resolve) => window.setTimeout(resolve, 220))
}

export default function TriePage() {
  const [nodes, setNodes] = useState<TrieNode[]>([])
  const [operation, setOperation] = useState<Operation | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [words, setWords] = useState<string[]>([])
  const [loadingSample, setLoadingSample] = useState(false)
  const sampleQueue = useRef<string[]>([])
  const playerSteps = useMemo(() => toPlayerSteps(operation?.steps ?? []), [operation])
  const player = useStepPlayer(playerSteps, 420)
  const { play } = player
  const activeStep = operation?.steps[player.currentStep]
  const displayedNodes = operation?.kind === 'insert' && activeStep ? activeStep.nodesAfter : nodes
  const visitedNodeIds = operation?.steps.slice(0, player.currentStep + 1).map((step) => step.nodeId) ?? []
  const isBusy = Boolean(operation) || loadingSample

  const startOperation = useCallback((kind: Operation['kind'], value: string) => {
    const word = value.trim().toLowerCase()
    if (!word || operation) return
    const steps = kind === 'insert'
      ? trieInsert(nodes, 'root', word)
      : kind === 'search'
        ? trieSearch(nodes, 'root', word)
        : trieStartsWith(nodes, 'root', word)
    setOperation({ kind, value: word, steps })
    setInputValue('')
  }, [nodes, operation])

  useEffect(() => {
    if (operation) play()
  }, [operation, play])

  useEffect(() => {
    if (!operation || player.currentStep !== operation.steps.length - 1) return
    const finalStep = operation.steps.at(-1)
    if (!finalStep) return
    if (operation.kind === 'insert') {
      setNodes(finalStep.nodesAfter)
      setWords((items) => items.includes(operation.value) ? items : [operation.value, ...items])
    }
    setOperation(null)
  }, [operation, player.currentStep])

  useEffect(() => {
    if (loadingSample || operation || sampleQueue.current.length === 0) return
    const nextWord = sampleQueue.current.shift()
    if (!nextWord) {
      setLoadingSample(false)
      return
    }
    const timer = window.setTimeout(() => startOperation('insert', nextWord), 220)
    return () => window.clearTimeout(timer)
  }, [loadingSample, operation, startOperation, nodes])

  useEffect(() => {
    if (loadingSample && !operation && sampleQueue.current.length === 0) setLoadingSample(false)
  }, [loadingSample, operation])

  function submit(kind: Operation['kind']) {
    startOperation(kind, inputValue)
  }

  async function loadSample() {
    if (isBusy) return
    sampleQueue.current = SAMPLE_WORDS.filter((word) => !words.includes(word))
    setLoadingSample(true)
    await randomDelay()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Prefix tree</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Let words branch.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Trace shared prefixes as a trie stores words one character at a time.</p>
      </header>

      <main className="mt-10 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Trie controls">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5 dark:border-slate-800">
            <input value={inputValue} onChange={(event) => setInputValue(event.target.value)} type="text" placeholder="Type a word or prefix" aria-label="Word or prefix" className="min-w-48 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            <button type="button" onClick={() => submit('insert')} disabled={isBusy} className="rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-40">Insert</button>
            <button type="button" onClick={() => submit('search')} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-400 hover:text-teal-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Search</button>
            <button type="button" onClick={() => submit('prefix')} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Starts With</button>
            <button type="button" onClick={loadSample} disabled={isBusy} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-400 hover:text-rose-600 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200">Load dictionary sample</button>
          </div>

          <div className="mt-7">
            <TrieVisualizer nodes={displayedNodes} rootId="root" highlightedNodeId={activeStep?.nodeId} visitedNodeIds={visitedNodeIds} />
          </div>
          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Insert a word to grow the trie.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={operation ? player.currentStep : -1} totalSteps={operation ? playerSteps.length : undefined} /></div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Inserted words</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{words.length > 0 ? words.join(' · ') : 'No words yet.'}</p>
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Trie signals</p>
          <h2 className="mt-3 text-2xl font-semibold">Shared prefixes, shared paths.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Each circle is one character. A thicker outline marks a node where a complete word ends; a thinner path can still continue into longer words.</p>
          <div className="mt-6 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-400">Search requires an end-of-word marker. Starts With succeeds as soon as the prefix path exists.</div>
        </aside>
      </main>
    </div>
  )
}