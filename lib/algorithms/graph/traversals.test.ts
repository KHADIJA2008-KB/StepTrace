import assert from 'node:assert/strict'
import test from 'node:test'
import { bfs, dfs } from './traversals'
import type { GraphEdge, GraphNode } from './graphTypes'

const nodes: GraphNode[] = [
  { id: 'a', x: 0, y: 0, label: 'A' },
  { id: 'b', x: 0, y: 0, label: 'B' },
  { id: 'c', x: 0, y: 0, label: 'C' },
  { id: 'd', x: 0, y: 0, label: 'D' },
]

const edges: GraphEdge[] = [
  { id: 'ab', from: 'a', to: 'b', directed: false },
  { id: 'ac', from: 'a', to: 'c', directed: false },
  { id: 'bd', from: 'b', to: 'd', directed: false },
  { id: 'cd', from: 'c', to: 'd', directed: false },
]

function visitOrder(steps: ReturnType<typeof bfs>) {
  return steps.filter((step) => step.type === 'visit').map((step) => step.nodeId)
}

test('BFS records queue changes and visits nodes level by level', () => {
  const steps = bfs(nodes, edges, 'a')

  assert.deepEqual(visitOrder(steps), ['a', 'b', 'c', 'd'])
  assert.equal(steps[0].message, 'Enqueued A. Queue: [A]')
  assert.equal(steps.find((step) => step.type === 'enqueue' && step.nodeId === 'c')?.message, 'Enqueued C. Queue: [B, C]')
  assert.equal(steps.at(-1)?.type, 'done')
})

test('DFS records stack changes and avoids revisiting cyclic nodes', () => {
  const steps = dfs(nodes, edges, 'a')

  assert.deepEqual(visitOrder(steps), ['a', 'b', 'd', 'c'])
  assert.equal(steps[0].message, 'Pushed A. Stack: [A]')
  assert.ok(steps.some((step) => step.type === 'pop' && step.message === 'Popped D. Stack: [C]'))
  assert.equal(steps.at(-1)?.type, 'done')
})

test('traversals follow directed edges and return no steps for an unknown start', () => {
  const directedEdges: GraphEdge[] = [{ id: 'ab', from: 'a', to: 'b', directed: true }]

  assert.deepEqual(visitOrder(bfs(nodes, directedEdges, 'b')), ['b'])
  assert.deepEqual(dfs(nodes, directedEdges, 'missing'), [])
})