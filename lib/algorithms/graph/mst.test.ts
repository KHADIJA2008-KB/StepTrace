import assert from 'node:assert/strict'
import test from 'node:test'
import { kruskalsMST, primsMST } from './mst'
import type { GraphEdge, GraphNode } from './graphTypes'

const nodes: GraphNode[] = [
  { id: 'a', x: 0, y: 0, label: 'A' },
  { id: 'b', x: 0, y: 0, label: 'B' },
  { id: 'c', x: 0, y: 0, label: 'C' },
  { id: 'd', x: 0, y: 0, label: 'D' },
  { id: 'e', x: 0, y: 0, label: 'E' },
]

const edges: GraphEdge[] = [
  { id: 'ab', from: 'a', to: 'b', weight: 1, directed: false },
  { id: 'ac', from: 'a', to: 'c', weight: 4, directed: false },
  { id: 'bc', from: 'b', to: 'c', weight: 2, directed: false },
  { id: 'bd', from: 'b', to: 'd', weight: 5, directed: false },
  { id: 'cd', from: 'c', to: 'd', weight: 3, directed: false },
  { id: 'ce', from: 'c', to: 'e', weight: 6, directed: false },
  { id: 'de', from: 'd', to: 'e', weight: 4, directed: false },
]

function totalWeight(mstEdges: string[]) {
  return mstEdges.reduce((total, edgeId) => total + (edges.find((edge) => edge.id === edgeId)?.weight ?? 0), 0)
}

test('Prim and Kruskal produce minimum spanning trees with equal total weight', () => {
  const primSteps = primsMST(nodes, edges, 'a')
  const kruskalSteps = kruskalsMST(nodes, edges)
  const primResult = primSteps.at(-1)
  const kruskalResult = kruskalSteps.at(-1)

  assert.equal(primResult?.type, 'done')
  assert.equal(kruskalResult?.type, 'done')
  assert.equal(primResult?.mstEdges.length, nodes.length - 1)
  assert.equal(kruskalResult?.mstEdges.length, nodes.length - 1)
  assert.equal(totalWeight(primResult?.mstEdges ?? []), 10)
  assert.equal(totalWeight(kruskalResult?.mstEdges ?? []), 10)
  assert.equal(totalWeight(primResult?.mstEdges ?? []), totalWeight(kruskalResult?.mstEdges ?? []))
  assert.ok(primSteps.some((step) => step.type === 'consider' && step.message.startsWith('Cheapest available edge')))
  assert.ok(kruskalSteps.some((step) => step.type === 'reject'))
  assert.ok(primSteps.every((step) => step.mstEdges.length <= nodes.length - 1))
  assert.ok(kruskalSteps.every((step) => step.mstEdges.length <= nodes.length - 1))
})