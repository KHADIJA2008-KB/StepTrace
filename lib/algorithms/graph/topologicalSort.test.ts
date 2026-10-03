import assert from 'node:assert/strict'
import test from 'node:test'
import { topologicalSort } from './topologicalSort'
import type { GraphEdge, GraphNode } from './graphTypes'

const nodes: GraphNode[] = [
  { id: 'a', x: 0, y: 0, label: 'A' },
  { id: 'b', x: 0, y: 0, label: 'B' },
  { id: 'c', x: 0, y: 0, label: 'C' },
  { id: 'd', x: 0, y: 0, label: 'D' },
]

test('Kahn topological sort records in-degrees, queue entries, and an ordered result', () => {
  const edges: GraphEdge[] = [
    { id: 'ac', from: 'a', to: 'c', directed: true },
    { id: 'bc', from: 'b', to: 'c', directed: true },
    { id: 'cd', from: 'c', to: 'd', directed: true },
  ]
  const steps = topologicalSort(nodes, edges)
  const done = steps.at(-1)

  assert.equal(done?.type, 'done')
  assert.deepEqual(done?.order, ['a', 'b', 'c', 'd'])
  assert.deepEqual(done?.indegrees, { a: 0, b: 0, c: 0, d: 0 })
  assert.ok(steps.some((step) => step.type === 'in-degree' && step.nodeId === 'c' && step.indegrees.c === 2))
  assert.ok(steps.some((step) => step.type === 'enqueue' && step.nodeId === 'c' && step.queue.includes('c')))
  assert.ok(steps.every((step) => step.order.length <= nodes.length))
})

test('topological sort reports a cycle instead of a done step', () => {
  const cyclicEdges: GraphEdge[] = [
    { id: 'ab', from: 'a', to: 'b', directed: true },
    { id: 'ba', from: 'b', to: 'a', directed: true },
    { id: 'cd', from: 'c', to: 'd', directed: true },
  ]
  const steps = topologicalSort(nodes, cyclicEdges)
  const finalStep = steps.at(-1)

  assert.equal(finalStep?.type, 'cycle-detected')
  assert.match(finalStep?.message ?? '', /Cycle detected/)
  assert.deepEqual(finalStep?.order, ['c', 'd'])
  assert.ok(!steps.some((step) => step.type === 'done'))
})