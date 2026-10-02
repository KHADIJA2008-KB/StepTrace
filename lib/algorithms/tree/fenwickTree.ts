export type FenwickStep = {
  type: 'visit' | 'update' | 'sum-accumulate' | 'done'
  index: number
  value?: number
  runningSum?: number
  message: string
}

type BuiltFenwickTree = {
  tree: number[]
  steps: FenwickStep[]
}

function doneStep(index: number, message: string, value?: number, runningSum?: number): FenwickStep {
  return { type: 'done', index, value, runningSum, message }
}

export function buildFenwickTree(arr: number[]): BuiltFenwickTree {
  // Fenwick trees reserve slot 0; public array indices are 0-based and updates add one internally.
  const tree = new Array<number>(arr.length + 1).fill(0)
  const steps: FenwickStep[] = []

  arr.forEach((value, index) => {
    steps.push(...fenwickUpdate(tree, index, value))
  })

  steps.push(doneStep(0, 'Fenwick tree built.'))
  return { tree, steps }
}

export function fenwickUpdate(tree: number[], index: number, delta: number): FenwickStep[] {
  // Convert the 0-based array index to the BIT's 1-based internal position.
  const firstInternalIndex = index + 1
  const steps: FenwickStep[] = []
  if (!Number.isInteger(index) || index < 0 || firstInternalIndex >= tree.length) {
    steps.push(doneStep(firstInternalIndex, `Array index ${index} is outside the Fenwick tree.`))
    return steps
  }

  for (let internalIndex = firstInternalIndex; internalIndex < tree.length; internalIndex += internalIndex & -internalIndex) {
    steps.push({
      type: 'visit',
      index: internalIndex,
      value: tree[internalIndex],
      message: `Visited internal position ${internalIndex}.`,
    })
    tree[internalIndex] += delta
    steps.push({
      type: 'update',
      index: internalIndex,
      value: tree[internalIndex],
      message: `Added ${delta}; position ${internalIndex} now stores ${tree[internalIndex]}.`,
    })
  }

  steps.push(doneStep(firstInternalIndex, `Applied update at array index ${index}.`))
  return steps
}

export function fenwickQuery(tree: number[], index: number): FenwickStep[] {
  // Query index is inclusive and 0-based. Index -1 represents an empty prefix.
  let internalIndex = index + 1
  let runningSum = 0
  const steps: FenwickStep[] = []
  if (!Number.isInteger(index) || index < -1 || internalIndex >= tree.length) {
    steps.push(doneStep(internalIndex, `Array index ${index} is outside the Fenwick tree.`, 0, 0))
    return steps
  }

  while (internalIndex > 0) {
    steps.push({
      type: 'visit',
      index: internalIndex,
      value: tree[internalIndex],
      message: `Visited internal position ${internalIndex}.`,
    })
    runningSum += tree[internalIndex]
    steps.push({
      type: 'sum-accumulate',
      index: internalIndex,
      value: tree[internalIndex],
      runningSum,
      message: `Added ${tree[internalIndex]}; running sum is ${runningSum}.`,
    })
    internalIndex -= internalIndex & -internalIndex
  }

  steps.push(doneStep(index + 1, `Prefix sum through array index ${index} is ${runningSum}.`, runningSum, runningSum))
  return steps
}

export function fenwickRangeQuery(tree: number[], start: number, end: number): FenwickStep[] {
  const throughEnd = fenwickQuery(tree, end)
  const beforeStart = fenwickQuery(tree, start - 1)
  const endSum = throughEnd.at(-1)?.value ?? 0
  const beforeSum = beforeStart.at(-1)?.value ?? 0
  const rangeSum = endSum - beforeSum

  return [
    ...throughEnd,
    ...beforeStart,
    doneStep(end + 1, `Range sum for [${start}, ${end}] is ${rangeSum}.`, rangeSum, rangeSum),
  ]
}