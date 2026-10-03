'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GraphCanvas } from '@/components/visualizer/GraphCanvas'
import { GraphRepresentations } from '@/components/visualizer/GraphRepresentations'
import type { GraphEdge, GraphNode } from '@/lib/algorithms/graph/graphTypes'

export default function GraphBuilderPage() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Graph laboratory</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Build a graph. Read its structure.</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Create nodes and edges to compare the graph’s matrix and list representations.</p>
      </header>

      <main className="mt-8 space-y-6">
        <GraphCanvas nodes={nodes} edges={edges} setNodes={setNodes} setEdges={setEdges} />
        <GraphRepresentations nodes={nodes} edges={edges} />
      </main>
    </div>
  )
}