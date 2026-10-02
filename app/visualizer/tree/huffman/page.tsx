'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { TreeVisualizer } from '@/components/visualizer/TreeVisualizer'
import { huffmanEncode, type HuffmanStep } from '@/lib/algorithms/tree/huffmanCoding'
import { StepControls } from '@/lib/visualizer/StepControls'
import { useStepPlayer } from '@/lib/visualizer/useStepPlayer'
import type { Step } from '@/lib/visualizer/types'

function toPlayerSteps(steps: HuffmanStep[]): Step[] {
  return steps.map((step) => ({ type: step.type, indices: [], description: step.message }))
}

export default function HuffmanPage() {
  const [text, setText] = useState('this is an example of a huffman tree')
  const [steps, setSteps] = useState<HuffmanStep[]>([])
  const playerSteps = useMemo(() => toPlayerSteps(steps), [steps])
  const player = useStepPlayer(playerSteps, 520)
  const { play, reset } = player
  const activeStep = steps[player.currentStep]
  const frequencies = activeStep?.frequencies ?? []
  const queue = activeStep?.queue ?? []
  const isComplete = activeStep?.type === 'done'
  const codeEntries = Object.entries(activeStep?.codes ?? {}).sort(([a], [b]) => a.localeCompare(b))

  useEffect(() => {
    if (steps.length > 0) play()
  }, [steps, play])

  function encode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    reset()
    setSteps(huffmanEncode(text))
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Lossless compression</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Build codes from frequency.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Huffman coding repeatedly merges the two least frequent entries to build a prefix-code tree.</p>
      </header>

      <main className="mt-9 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20" aria-label="Huffman coding visualizer">
          <form onSubmit={encode} className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end dark:border-slate-800">
            <label className="min-w-0 flex-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Text to encode
              <textarea value={text} onChange={(event) => setText(event.target.value)} rows={2} aria-label="Text to encode" className="mt-2 block w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-slate-900 outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
            </label>
            <button type="submit" className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Encode</button>
          </form>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current Huffman tree</h2>{activeStep && <span className="text-xs text-slate-400">{activeStep.type === 'merge' ? 'Latest merge' : activeStep.type === 'code' ? 'Assigning codes' : activeStep.type}</span>}</div>
              <TreeVisualizer nodes={activeStep?.treeNodes ?? []} rootId={activeStep?.rootId ?? ''} nodeLabels={activeStep?.nodeLabels} highlightedNodeId={activeStep?.nodeId} highlightedPathNodeIds={activeStep?.pathNodeIds} />
            </div>
            <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Priority queue</h2>
              <div className="mt-3 grid gap-2">{queue.length > 0 ? queue.map((item) => <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"><span className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span><span className="font-mono text-xs text-teal-700 dark:text-teal-300">{item.frequency}</span></div>) : <p className="text-sm text-slate-400">Encode text to initialize.</p>}</div>
            </aside>
          </div>

          {frequencies.length > 0 && <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400 dark:bg-slate-900"><tr><th className="px-3 py-2">Character</th><th className="px-3 py-2">Frequency</th></tr></thead><tbody>{frequencies.map(({ character, frequency }) => <tr key={character} className="border-t border-slate-200 dark:border-slate-800"><td className="px-3 py-2 font-mono">{character === ' ' ? '(space)' : character}</td><td className="px-3 py-2 font-mono">{frequency}</td></tr>)}</tbody></table></div>}

          {isComplete && <div className="mt-5 grid gap-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/50 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Codes</h2><div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">{codeEntries.map(([character, code]) => <p key={character} className="font-mono text-emerald-950 dark:text-emerald-100">{character === ' ' ? '(space)' : character}: {code}</p>)}</div></div>
            <div className="min-w-0"><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Encoded string</h2><p className="mt-2 break-all font-mono text-sm leading-6 text-emerald-950 dark:text-emerald-100">{activeStep?.encoded}</p></div>
          </div>}

          <p className="mt-4 min-h-6 text-sm text-slate-500 dark:text-slate-400">{activeStep?.message ?? 'Enter text and encode to count frequencies and build the tree.'}</p>
          <div className="mt-4"><StepControls {...player} currentStep={player.currentStep} totalSteps={steps.length || undefined} /></div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">Greedy merge</p>
          <h2 className="mt-3 text-xl font-semibold">Frequent characters get shorter codes.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Each merge removes the two lowest-frequency queue entries and inserts a parent with their combined weight. Left and right branches add 0 and 1 to each character’s code.</p>
        </aside>
      </main>
    </div>
  )
}