export type TrieNode = {
  id: string
  char: string
  children: Record<string, string>
  isEndOfWord: boolean
}

export type TrieStep = {
  type: 'visit' | 'insert' | 'found' | 'not-found'
  nodeId: string
  message: string
  nodesAfter: TrieNode[]
}

function copyNodes(nodes: TrieNode[]) {
  return nodes.map((node) => ({ ...node, children: { ...node.children } }))
}

function step(type: TrieStep['type'], nodeId: string, message: string, nodes: TrieNode[]): TrieStep {
  return { type, nodeId, message, nodesAfter: copyNodes(nodes) }
}

function nodeMap(nodes: TrieNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
}

function walk(
  nodes: TrieNode[],
  rootId: string,
  text: string,
  steps: TrieStep[],
  onMissing: (nodeId: string, index: number) => void,
) {
  const byId = nodeMap(nodes)
  let current = byId.get(rootId)
  if (!current) {
    onMissing(rootId, 0)
    return undefined
  }

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const childId = current.children[char]
    if (!childId) {
      onMissing(current.id, index)
      return undefined
    }
    const child = byId.get(childId)
    if (!child) {
      onMissing(current.id, index)
      return undefined
    }
    current = child
    steps.push(step('visit', current.id, `Visited character ${char}.`, nodes))
  }

  return current
}

export function trieInsert(nodes: TrieNode[], rootId: string, word: string): TrieStep[] {
  const nextNodes = copyNodes(nodes)
  const byId = nodeMap(nextNodes)
  const steps: TrieStep[] = []
  let current = byId.get(rootId)

  if (!current) {
    current = { id: rootId, char: '', children: {}, isEndOfWord: false }
    nextNodes.push(current)
    byId.set(rootId, current)
  }

  if (word.length === 0) {
    current.isEndOfWord = true
    steps.push(step('insert', current.id, 'Marked the root as the end of the empty word.', nextNodes))
    return steps
  }

  for (const char of word) {
    const existingId = current.children[char]
    if (existingId) {
      const existing = byId.get(existingId)
      if (existing) {
        current = existing
        steps.push(step('visit', current.id, `Visited existing character ${char}.`, nextNodes))
        continue
      }
    }

    const child: TrieNode = {
      id: `${current.id}-${char}`,
      char,
      children: {},
      isEndOfWord: false,
    }
    current.children[char] = child.id
    nextNodes.push(child)
    byId.set(child.id, child)
    current = child
    steps.push(step('insert', current.id, `Created character ${char}.`, nextNodes))
  }

  current.isEndOfWord = true
  if (steps.length > 0) steps[steps.length - 1].nodesAfter = copyNodes(nextNodes)
  return steps
}

export function trieSearch(nodes: TrieNode[], rootId: string, word: string): TrieStep[] {
  const steps: TrieStep[] = []
  const current = walk(nodes, rootId, word, steps, (nodeId, index) => {
    steps.push(step('not-found', nodeId, `Word is missing at character ${word[index] ?? ''}.`, nodes))
  })

  if (!current) return steps
  if (current.isEndOfWord) steps.push(step('found', current.id, `Found the word ${word}.`, nodes))
  else steps.push(step('not-found', current.id, `${word} is only a prefix, not a complete word.`, nodes))
  return steps
}

export function trieStartsWith(nodes: TrieNode[], rootId: string, prefix: string): TrieStep[] {
  const steps: TrieStep[] = []
  const current = walk(nodes, rootId, prefix, steps, (nodeId, index) => {
    steps.push(step('not-found', nodeId, `Prefix is missing at character ${prefix[index] ?? ''}.`, nodes))
  })

  if (current) steps.push(step('found', current.id, `Found the prefix ${prefix}.`, nodes))
  return steps
}