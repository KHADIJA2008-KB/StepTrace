import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSegmentTree, querySegmentTree, updateSegmentTree, type SegmentTreeStep } from './segmentTree'

function querySum(steps: SegmentTreeStep[]) {
  return steps.at(-1)?.querySum
}

test('segment tree range sums match brute-force sums', () => {
  const values = [2, 4, 6, 8, 10, 12, 14]
  const built = buildSegmentTree(values)

  for (const [start, end] of [[0, 6], [1, 3], [2, 5], [4, 4], [0, 2]]) {
    assert.equal(querySum(querySegmentTree(built.nodes, built.rootId, start, end)), values.slice(start, end + 1).reduce((sum, value) => sum + value, 0))
  }

  const types = querySegmentTree(built.nodes, built.rootId, 1, 3).map((step) => step.type)
  assert.ok(types.includes('partial'))
  assert.ok(types.includes('in-range'))
  assert.ok(types.includes('out-of-range'))
})

test('updates change the leaf and recalculate every ancestor sum', () => {
  const built = buildSegmentTree([3, 5, 7, 9])
  const steps = updateSegmentTree(built.nodes, built.rootId, 1, 11)
  const finalNodes = steps.at(-1)?.treeAfter ?? []
  const byId = new Map(finalNodes.map((node) => [node.id, node]))

  assert.equal(byId.get('segment-1-1')?.value, 11)
  assert.equal(byId.get('segment-0-1')?.value, 14)
  assert.equal(byId.get('segment-0-3')?.value, 30)
  assert.deepEqual(steps.filter((step) => step.type === 'recalculate').map((step) => step.nodeId), ['segment-0-1', 'segment-0-3'])
})