import assert from 'node:assert/strict'
import test from 'node:test'
import { heapSort } from './heapSort'

test('heap sort builds a max-heap and sorts the array in ascending order', () => {
  const input = [7, 2, 9, 1, 5, 8, 3]
  const steps = heapSort(input)
  const result = steps.at(-1)

  assert.deepEqual(result?.array, [1, 2, 3, 5, 7, 8, 9])
  assert.ok(steps.some((step) => step.type === 'compare'))
  assert.ok(steps.some((step) => step.type === 'extract'))
  assert.equal(input[0], 7)

  const completedHeap = steps.find((step) => step.type === 'heapify' && step.message === 'Max-heap construction complete.')
  assert.ok(completedHeap)
  assert.ok(completedHeap.treeNodes[0].value >= completedHeap.treeNodes[1].value)
  assert.ok(completedHeap.treeNodes[0].value >= completedHeap.treeNodes[2].value)
})

test('heap sort handles empty and single-element arrays', () => {
  assert.deepEqual(heapSort([]).at(-1)?.array, [])
  assert.deepEqual(heapSort([4]).at(-1)?.array, [4])
})