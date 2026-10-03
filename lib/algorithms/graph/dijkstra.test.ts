import assert from 'node:assert/strict'
import test from 'node:test'
import { dijkstra } from './dijkstra'
import type { GraphEdge, GraphNode } from './graphTypes'

const nodes: GraphNode[] = [
  { id: 's', x: 0, y: 0, label: 'S' },
  { id: 'a', x: 0, y: 0, label: 'A' },
  { id: 'b', x: 0, y: 0, label: 'B' },
  { id: 'c', x: 0, y: 0, label: 'C' },
  { id: 'd', x: 0, y: 0, label: 'D' },
  { id: 'isolated', x: 0, y: 0, label: 'X' },
]

const edges: GraphEdge[] = [
  { id: 'sa', from: 's', to: 'a', weight: 4, directed: true },
  { id: 'sb', from: 's', to: 'b', weight: 1, directed: true },
  { id: 'ba', from: 'b', to: 'a', weight: 2, directed: true },
  { id: 'ac', from: 'a', to: 'c', weight: 1, directed: true },
  { id: 'bc', from: 'b', to: 'c', weight: 5, directed: true },
  { id: 'cd', from: 'c', to: 'd', weight: 3, directed: true },
]

test('Dijkstra finds shortest distances and preserves Infinity for disconnected nodes', () => {
  const steps = dijkstra(nodes, edges, 's')
  const done = steps.at(-1)

  assert.equal(done?.type, 'done')
  assert.deepEqual(done?.distances, { s: 0, a: 3, b: 1, c: 4, d: 7, isolated: Infinity })
  assert.deepEqual(
    steps.filter((step) => step.type === 'finalize').map((step) => step.nodeId),
    ['s', 'b', 'a', 'c', 'd'],
  )
  assert.deepEqual(
    steps.filter((step) => step.type === 'update-distance' && step.nodeId === 'a').map((step) => step.distances.a),
    [4, 3],
  )
  assert.deepEqual(
    steps.filter((step) => step.type === 'relax').map((step) => step.edgeId),
    ['sa', 'sb', 'ba', 'bc', 'ac', 'cd'],
  )
  assert.ok(steps.every((step) => Object.keys(step.distances).length === nodes.length))
})