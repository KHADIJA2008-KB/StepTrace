export type SegNode = {
  id: string
  left: string | null
  right: string | null
  rangeStart: number
  rangeEnd: number
  value: number
}

export type SegmentTreeStep = {
  type: 'visit' | 'create' | 'in-range' | 'partial' | 'out-of-range' | 'update' | 'recalculate' | 'done'
  nodeId: string
  message: string
  treeAfter: SegNode[]
  querySum?: number
}

type BuiltSegmentTree = {
  nodes: SegNode[]
  rootId: string
  steps: SegmentTreeStep[]
}

function copyNodes(nodes: SegNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function step(type: SegmentTreeStep['type'], node: SegNode, message: string, nodes: SegNode[], querySum?: number): SegmentTreeStep {
  return { type, nodeId: node.id, message, treeAfter: copyNodes(nodes), querySum }
}

function nodeMap(nodes: SegNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
}

function segmentId(start: number, end: number) {
  return `segment-${start}-${end}`
}

export function buildSegmentTree(arr: number[]): BuiltSegmentTree {
  const nodes: SegNode[] = []
  const steps: SegmentTreeStep[] = []

  if (arr.length === 0) {
    steps.push({ type: 'done', nodeId: '', message: 'Cannot build a segment tree from an empty array.', treeAfter: [] })
    return { nodes, rootId: '', steps }
  }

  function build(start: number, end: number): SegNode {
    const id = segmentId(start, end)
    steps.push({
      type: 'visit',
      nodeId: id,
      message: `Building range [${start}, ${end}].`,
      treeAfter: copyNodes(nodes),
    })

    let left: SegNode | null = null
    let right: SegNode | null = null
    let value: number
    if (start === end) {
      value = arr[start]
    } else {
      const middle = Math.floor((start + end) / 2)
      left = build(start, middle)
      right = build(middle + 1, end)
      value = left.value + right.value
    }

    const node: SegNode = {
      id,
      left: left?.id ?? null,
      right: right?.id ?? null,
      rangeStart: start,
      rangeEnd: end,
      value,
    }
    nodes.push(node)
    steps.push(step('create', node, `Created range [${start}, ${end}] with sum ${value}.`, nodes))
    return node
  }

  const root = build(0, arr.length - 1)
  steps.push(step('done', root, 'Segment tree built.', nodes))
  return { nodes: copyNodes(nodes), rootId: root.id, steps }
}

export function querySegmentTree(nodes: SegNode[], rootId: string, queryStart: number, queryEnd: number): SegmentTreeStep[] {
  const byId = nodeMap(nodes)
  const steps: SegmentTreeStep[] = []
  let querySum = 0
  const root = byId.get(rootId)

  function query(nodeId: string | null) {
    if (!nodeId) return
    const node = byId.get(nodeId)
    if (!node) return

    if (queryEnd < node.rangeStart || queryStart > node.rangeEnd) {
      steps.push(step('out-of-range', node, `Range [${node.rangeStart}, ${node.rangeEnd}] is outside the query.`, nodes))
      return
    }
    if (queryStart <= node.rangeStart && node.rangeEnd <= queryEnd) {
      querySum += node.value
      steps.push(step('in-range', node, `Range [${node.rangeStart}, ${node.rangeEnd}] contributes ${node.value}.`, nodes, node.value))
      return
    }

    steps.push(step('partial', node, `Range [${node.rangeStart}, ${node.rangeEnd}] is partially covered; descend.`, nodes))
    query(node.left)
    query(node.right)
  }

  if (root && queryStart <= queryEnd) query(rootId)
  steps.push({
    type: 'done',
    nodeId: rootId,
    message: `Query sum for [${queryStart}, ${queryEnd}] is ${querySum}.`,
    treeAfter: copyNodes(nodes),
    querySum,
  })
  return steps
}

export function updateSegmentTree(nodes: SegNode[], rootId: string, index: number, newValue: number): SegmentTreeStep[] {
  const updatedNodes = copyNodes(nodes)
  const byId = nodeMap(updatedNodes)
  const steps: SegmentTreeStep[] = []
  const root = byId.get(rootId)

  if (!root || !Number.isInteger(index) || index < root.rangeStart || index > root.rangeEnd) {
    steps.push({
      type: 'done',
      nodeId: rootId,
      message: `Index ${index} is outside the segment tree.`,
      treeAfter: copyNodes(nodes),
    })
    return steps
  }

  function update(node: SegNode): number {
    steps.push(step('visit', node, `Descending to index ${index} in [${node.rangeStart}, ${node.rangeEnd}].`, updatedNodes))
    if (node.rangeStart === node.rangeEnd) {
      const previousValue = node.value
      node.value = newValue
      steps.push(step('update', node, `Updated index ${index} from ${previousValue} to ${newValue}.`, updatedNodes))
      return node.value
    }

    const left = node.left ? byId.get(node.left) : undefined
    const right = node.right ? byId.get(node.right) : undefined
    if (left && index <= left.rangeEnd) update(left)
    else if (right) update(right)

    const previousSum = node.value
    node.value = (left?.value ?? 0) + (right?.value ?? 0)
    steps.push(step('recalculate', node, `Recalculated [${node.rangeStart}, ${node.rangeEnd}]: ${previousSum} → ${node.value}.`, updatedNodes))
    return node.value
  }

  const updatedSum = update(root)
  steps.push(step('done', root, `Updated index ${index}; root sum is ${updatedSum}.`, updatedNodes))
  return steps
}