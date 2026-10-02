import type { TreeNode } from './treeTypes'

export type HeapSortStep = {
  type: 'compare' | 'swap' | 'heapify' | 'extract' | 'done'
  indices: number[]
  array: number[]
  treeNodes: TreeNode[]
  rootId: string
  heapSize: number
  message: string
}

function heapSnapshot(values: number[], heapSize: number): TreeNode[] {
  return values.slice(0, heapSize).map((value, index) => ({
    id: `heap-${index}`,
    value,
    left: 2 * index + 1 < heapSize ? `heap-${2 * index + 1}` : null,
    right: 2 * index + 2 < heapSize ? `heap-${2 * index + 2}` : null,
    color: 'black',
  }))
}

export function heapSort(arr: number[]): HeapSortStep[] {
  const values = [...arr]
  const steps: HeapSortStep[] = []

  function record(type: HeapSortStep['type'], indices: number[], heapSize: number, message: string) {
    steps.push({
      type,
      indices,
      array: [...values],
      treeNodes: heapSnapshot(values, heapSize),
      rootId: heapSize > 0 ? 'heap-0' : '',
      heapSize,
      message,
    })
  }

  function siftDown(start: number, heapSize: number, phase: 'build' | 'sort') {
    let parent = start
    while (true) {
      const left = 2 * parent + 1
      const right = left + 1
      let largest = parent

      if (left < heapSize) {
        record('compare', [largest, left], heapSize, `Compare parent ${values[largest]} with left child ${values[left]}.`)
        if (values[left] > values[largest]) largest = left
      }
      if (right < heapSize) {
        record('compare', [largest, right], heapSize, `Compare current largest ${values[largest]} with right child ${values[right]}.`)
        if (values[right] > values[largest]) largest = right
      }
      if (largest === parent) {
        record('heapify', [parent], heapSize, `${phase === 'build' ? 'Max-heap built at' : 'Heap restored at'} index ${parent}.`)
        return
      }

      ;[values[parent], values[largest]] = [values[largest], values[parent]]
      record('swap', [parent, largest], heapSize, `Swap indices ${parent} and ${largest} to preserve the max-heap.`)
      parent = largest
    }
  }

  for (let index = Math.floor(values.length / 2) - 1; index >= 0; index -= 1) {
    siftDown(index, values.length, 'build')
  }
  record('heapify', values.length > 0 ? [0] : [], values.length, 'Max-heap construction complete.')

  for (let end = values.length - 1; end > 0; end -= 1) {
    ;[values[0], values[end]] = [values[end], values[0]]
    record('extract', [0, end], end, `Move maximum ${values[end]} to sorted position ${end}.`)
    siftDown(0, end, 'sort')
  }

  record('done', [], Math.min(1, values.length), 'Heap sort complete.')
  return steps
}