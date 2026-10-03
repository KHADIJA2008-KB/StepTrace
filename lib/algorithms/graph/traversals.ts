import type { GraphEdge, GraphNode } from './graphTypes'

export type GraphStep = {
  type: 'visit' | 'enqueue' | 'dequeue' | 'push' | 'pop' | 'done'
  nodeId: string
  message: string
}

function createAdjacency(nodes: GraphNode[], edges: GraphEdge[]) {
  const nodeIds = new Set(nodes.map((node) => node.id))
  const adjacency = new Map(nodes.map((node) => [node.id, [] as string[]]))

  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue
    adjacency.get(edge.from)?.push(edge.to)
    if (!edge.directed && edge.from !== edge.to) adjacency.get(edge.to)?.push(edge.from)
  }

  for (const node of nodes) {
    const neighbors = adjacency.get(node.id) ?? []
    adjacency.set(node.id, Array.from(new Set(neighbors)))
  }

  return adjacency
}

function labelFor(nodeId: string, labels: Map<string, string>) {
  return labels.get(nodeId) ?? nodeId
}

function formatState(nodeIds: string[], labels: Map<string, string>) {
  return `[${nodeIds.map((nodeId) => labelFor(nodeId, labels)).join(', ')}]`
}

export function bfs(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  if (!nodes.some((node) => node.id === startId)) return []

  const adjacency = createAdjacency(nodes, edges)
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const steps: GraphStep[] = []
  const queue = [startId]
  const discovered = new Set([startId])
  let front = 0

  steps.push({ type: 'enqueue', nodeId: startId, message: `Enqueued ${labelFor(startId, labels)}. Queue: ${formatState(queue, labels)}` })

  while (front < queue.length) {
    const nodeId = queue[front]
    front += 1
    const remainingQueue = queue.slice(front)
    steps.push({ type: 'dequeue', nodeId, message: `Dequeued ${labelFor(nodeId, labels)}. Queue: ${formatState(remainingQueue, labels)}` })
    steps.push({ type: 'visit', nodeId, message: `Visited ${labelFor(nodeId, labels)}.` })

    for (const neighborId of adjacency.get(nodeId) ?? []) {
      if (discovered.has(neighborId)) continue
      discovered.add(neighborId)
      queue.push(neighborId)
      steps.push({
        type: 'enqueue',
        nodeId: neighborId,
        message: `Enqueued ${labelFor(neighborId, labels)}. Queue: ${formatState(queue.slice(front), labels)}`,
      })
    }
  }

  steps.push({ type: 'done', nodeId: startId, message: 'BFS traversal complete.' })
  return steps
}

export function dfs(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  if (!nodes.some((node) => node.id === startId)) return []

  const adjacency = createAdjacency(nodes, edges)
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const steps: GraphStep[] = []
  const stack = [startId]
  const discovered = new Set([startId])

  steps.push({ type: 'push', nodeId: startId, message: `Pushed ${labelFor(startId, labels)}. Stack: ${formatState(stack, labels)}` })

  while (stack.length > 0) {
    const nodeId = stack.pop()
    if (!nodeId) continue
    steps.push({ type: 'pop', nodeId, message: `Popped ${labelFor(nodeId, labels)}. Stack: ${formatState(stack, labels)}` })
    steps.push({ type: 'visit', nodeId, message: `Visited ${labelFor(nodeId, labels)}.` })

    const neighbors = adjacency.get(nodeId) ?? []
    for (let index = neighbors.length - 1; index >= 0; index -= 1) {
      const neighborId = neighbors[index]
      if (discovered.has(neighborId)) continue
      discovered.add(neighborId)
      stack.push(neighborId)
      steps.push({
        type: 'push',
        nodeId: neighborId,
        message: `Pushed ${labelFor(neighborId, labels)}. Stack: ${formatState(stack, labels)}`,
      })
    }
  }

  steps.push({ type: 'done', nodeId: startId, message: 'DFS traversal complete.' })
  return steps
}