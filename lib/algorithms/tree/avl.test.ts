import assert from 'node:assert/strict'
import test from 'node:test'
import { avlDelete, avlInsert } from './avl'
import type { TreeNode } from './treeTypes'

function rotations(steps: ReturnType<typeof avlInsert>) {
  return steps.filter((step) => step.type === 'rotate').map((step) => step.rotationType)
}

test('ascending inserts trigger a single left rotation', () => {
  const first = avlInsert([], 'root', 1).at(-1)?.treeAfter ?? []
  const second = avlInsert(first, 'root', 2).at(-1)?.treeAfter ?? []
  const steps = avlInsert(second, 'root', 3)
  assert.deepEqual(rotations(steps), ['left'])
  const finalTree = steps.at(-1)?.treeAfter ?? []
  assert.equal(steps.at(-1)?.nodeId, 'node-2')
  assert.deepEqual(finalTree.find((node) => node.id === 'node-2'), { id: 'node-2', value: 2, left: 'root', right: 'node-3', color: 'black' })
})

test('descending inserts trigger a single right rotation', () => {
  const first = avlInsert([], 'root', 3).at(-1)?.treeAfter ?? []
  const second = avlInsert(first, 'root', 2).at(-1)?.treeAfter ?? []
  assert.deepEqual(rotations(avlInsert(second, 'root', 1)), ['right'])
})

test('left-right imbalance triggers a double rotation', () => {
  const first = avlInsert([], 'root', 3).at(-1)?.treeAfter ?? []
  const second = avlInsert(first, 'root', 1).at(-1)?.treeAfter ?? []
  const steps = avlInsert(second, 'root', 2)
  assert.deepEqual(rotations(steps), ['left-right'])
  assert.equal(steps.at(-1)?.nodeId, 'node-2')
})

test('deletion can trigger rebalancing', () => {
  const nodes: TreeNode[] = [
    { id: 'root', value: 4, left: 'node-2', right: 'node-6', color: 'black' },
    { id: 'node-2', value: 2, left: null, right: null, color: 'black' },
    { id: 'node-6', value: 6, left: null, right: 'node-7', color: 'black' },
    { id: 'node-7', value: 7, left: null, right: 'node-8', color: 'black' },
    { id: 'node-8', value: 8, left: null, right: null, color: 'black' },
  ]
  const steps = avlDelete(nodes, 'root', 2)
  assert.ok(steps.some((step) => step.type === 'rotate'))
})