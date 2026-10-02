import assert from 'node:assert/strict'
import test from 'node:test'
import { buildFenwickTree, fenwickQuery, fenwickRangeQuery, fenwickUpdate } from './fenwickTree'

function result(steps: ReturnType<typeof fenwickQuery>) {
  return steps.at(-1)?.value
}

test('Fenwick prefix and range sums match brute-force sums', () => {
  const values = [3, 1, 4, 1, 5, 9, 2]
  const { tree } = buildFenwickTree(values)

  for (let end = 0; end < values.length; end += 1) {
    assert.equal(result(fenwickQuery(tree, end)), values.slice(0, end + 1).reduce((sum, value) => sum + value, 0))
  }
  for (const [start, end] of [[0, 6], [1, 3], [2, 5], [4, 4]]) {
    assert.equal(result(fenwickRangeQuery(tree, start, end)), values.slice(start, end + 1).reduce((sum, value) => sum + value, 0))
  }
})

test('updates propagate through internal Fenwick positions and keep sums correct', () => {
  const values = [2, 7, 1, 8, 2, 8]
  const { tree } = buildFenwickTree(values)

  for (const [index, newValue] of [[1, 10], [4, -3], [0, 6]]) {
    const delta = newValue - values[index]
    const steps = fenwickUpdate(tree, index, delta)
    values[index] = newValue
    assert.equal(steps[0].index, index + 1)
    assert.equal(result(fenwickQuery(tree, values.length - 1)), values.reduce((sum, value) => sum + value, 0))
    for (let end = 0; end < values.length; end += 1) {
      assert.equal(result(fenwickQuery(tree, end)), values.slice(0, end + 1).reduce((sum, value) => sum + value, 0))
    }
  }
})

test('build emits repeated update steps using 1-based internal positions', () => {
  const built = buildFenwickTree([5, 8, 3])
  assert.equal(built.tree.length, 4)
  assert.equal(built.tree[0], 0)
  assert.equal(built.steps.some((step) => step.type === 'update' && step.index === 1), true)
  assert.equal(result(fenwickQuery(built.tree, -1)), 0)
})