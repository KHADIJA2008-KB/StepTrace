import type { TreeNode } from './treeTypes'

export type HuffmanQueueEntry = {
  id: string
  label: string
  frequency: number
}

export type HuffmanStep = {
  type: 'frequency' | 'merge' | 'code' | 'done'
  nodeId: string
  message: string
  character?: string
  code?: string
  frequency?: number
  frequencies: Array<{ character: string; frequency: number }>
  queue: HuffmanQueueEntry[]
  treeNodes: TreeNode[]
  rootId: string
  nodeLabels: Map<string, string>
  pathNodeIds: string[]
  codes?: Record<string, string>
  encoded?: string
}

type HuffmanNode = TreeNode & {
  character: string | null
  order: number
}

function snapshotNodes(nodes: HuffmanNode[]): TreeNode[] {
  return nodes.map(({ id, value, left, right, color }) => ({ id, value, left, right, color }))
}

export function huffmanEncode(text: string): HuffmanStep[] {
  const steps: HuffmanStep[] = []
  const frequencies = new Map<string, number>()
  for (const character of text) frequencies.set(character, (frequencies.get(character) ?? 0) + 1)

  const frequencyList = () => Array.from(frequencies, ([character, frequency]) => ({ character, frequency }))
  const nodes: HuffmanNode[] = []
  const nodeLabels = new Map<string, string>()
  const queue: HuffmanNode[] = []
  let nextOrder = 0
  const toQueue = () => [...queue]
    .sort((a, b) => a.value - b.value || a.order - b.order)
    .map((node) => ({ id: node.id, label: node.character ?? 'Σ', frequency: node.value }))

  if (text.length === 0) {
    steps.push({
      type: 'done', nodeId: '', message: 'Nothing to encode.', frequencies: [], queue: [], treeNodes: [],
      rootId: '', nodeLabels: new Map(), pathNodeIds: [], codes: {}, encoded: '',
    })
    return steps
  }

  for (const [character, frequency] of Array.from(frequencies.entries())) {
    const leaf: HuffmanNode = {
      id: `char-${character.codePointAt(0)}`,
      value: frequency,
      left: null,
      right: null,
      color: 'black',
      character,
      order: nextOrder++,
    }
    nodes.push(leaf)
    queue.push(leaf)
    nodeLabels.set(leaf.id, character === ' ' ? 'space' : character)
    steps.push({
      type: 'frequency',
      nodeId: leaf.id,
      character,
      frequency,
      message: `Counted ${character === ' ' ? 'space' : character}: frequency ${frequency}.`,
      frequencies: frequencyList(),
      queue: toQueue(),
      treeNodes: snapshotNodes(nodes),
      rootId: leaf.id,
      nodeLabels: new Map(nodeLabels),
      pathNodeIds: [leaf.id],
    })
  }

  while (queue.length > 1) {
    queue.sort((a, b) => a.value - b.value || a.order - b.order)
    const left = queue.shift() as HuffmanNode
    const right = queue.shift() as HuffmanNode
    const parent: HuffmanNode = {
      id: `merge-${nextOrder}`,
      value: left.value + right.value,
      left: left.id,
      right: right.id,
      color: 'black',
      character: null,
      order: nextOrder++,
    }
    nodes.push(parent)
    nodeLabels.set(parent.id, 'Σ')
    queue.push(parent)
    queue.sort((a, b) => a.value - b.value || a.order - b.order)
    steps.push({
      type: 'merge',
      nodeId: parent.id,
      frequency: parent.value,
      message: `Merged ${left.character === null ? 'node' : left.character} (${left.value}) and ${right.character === null ? 'node' : right.character} (${right.value}) into frequency ${parent.value}.`,
      frequencies: frequencyList(),
      queue: toQueue(),
      treeNodes: snapshotNodes(nodes),
      rootId: parent.id,
      nodeLabels: new Map(nodeLabels),
      pathNodeIds: [left.id, right.id, parent.id],
    })
  }

  const root = queue[0]
  const codes: Record<string, string> = {}
  function assignCodes(nodeId: string, prefix: string, path: string[]) {
    const node = nodes.find((item) => item.id === nodeId)
    if (!node) return
    const nextPath = [...path, node.id]
    if (node.character !== null) {
      codes[node.character] = prefix || '0'
      steps.push({
        type: 'code',
        nodeId: node.id,
        character: node.character,
        code: codes[node.character],
        message: `Code for ${node.character === ' ' ? 'space' : node.character}: ${codes[node.character]}.`,
        frequencies: frequencyList(),
        queue: toQueue(),
        treeNodes: snapshotNodes(nodes),
        rootId: root.id,
        nodeLabels: new Map(nodeLabels),
        pathNodeIds: nextPath,
      })
      return
    }
    if (node.left) assignCodes(node.left, `${prefix}0`, nextPath)
    if (node.right) assignCodes(node.right, `${prefix}1`, nextPath)
  }
  assignCodes(root.id, '', [])

  const encoded = Array.from(text, (character) => codes[character]).join('')
  steps.push({
    type: 'done',
    nodeId: root.id,
    message: `Encoded ${text.length} characters into ${encoded.length} bits.`,
    frequencies: frequencyList(),
    queue: toQueue(),
    treeNodes: snapshotNodes(nodes),
    rootId: root.id,
    nodeLabels: new Map(nodeLabels),
    pathNodeIds: [],
    codes: { ...codes },
    encoded,
  })
  return steps
}