import type { GraphEdge, GraphNode } from './graphTypes'

export type TopologicalSortStep = {
  type: 'in-degree' | 'enqueue' | 'dequeue' | 'process' | 'done' | 'cycle-detected'
  nodeId: string
  indegrees: Record<string, number>
  queue: string[]
  order: string[]
  message: string
}

function labelFor(nodeId: string, labels: Map<string, string>) {
  return labels.get(nodeId) ?? nodeId
}

function snapshot(
  type: TopologicalSortStep['type'],
  nodeId: string,
  indegrees: Record<string, number>,
  queue: string[],
  order: string[],
  message: string,
): TopologicalSortStep {
  return { type, nodeId, indegrees: { ...indegrees }, queue: [...queue], order: [...order], message }
}

export function topologicalSort(nodes: GraphNode[], edges: GraphEdge[]): TopologicalSortStep[] {
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const validNodeIds = new Set(nodes.map((node) => node.id))
  const adjacency = new Map(nodes.map((node) => [node.id, [] as string[]]))
  const indegrees = Object.fromEntries(nodes.map((node) => [node.id, 0])) as Record<string, number>

  for (const edge of edges) {
    if (!validNodeIds.has(edge.from) || !validNodeIds.has(edge.to)) continue
    adjacency.get(edge.from)?.push(edge.to)
    indegrees[edge.to] += 1
    if (!edge.directed && edge.from !== edge.to) {
      adjacency.get(edge.to)?.push(edge.from)
      indegrees[edge.from] += 1
    }
  }

  const steps: TopologicalSortStep[] = []
  const queue: string[] = []
  const order: string[] = []

  for (const node of nodes) {
    steps.push(snapshot(
      'in-degree',
      node.id,
      indegrees,
      queue,
      order,
      `In-degree of ${labelFor(node.id, labels)}: ${indegrees[node.id]}.`,
    ))
  }

  for (const node of nodes) {
    if (indegrees[node.id] !== 0) continue
    queue.push(node.id)
    steps.push(snapshot(
      'enqueue',
      node.id,
      indegrees,
      queue,
      order,
      `Added ${labelFor(node.id, labels)} to the queue: [${queue.map((nodeId) => labelFor(nodeId, labels)).join(', ')}].`,
    ))
  }

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (nodeId === undefined) break
    steps.push(snapshot(
      'dequeue',
      nodeId,
      indegrees,
      queue,
      order,
      `Removed ${labelFor(nodeId, labels)} from the queue.`,
    ))

    order.push(nodeId)
    steps.push(snapshot(
      'process',
      nodeId,
      indegrees,
      queue,
      order,
      `Added ${labelFor(nodeId, labels)} to the topological order: [${order.map((id) => labelFor(id, labels)).join(' → ')}].`,
    ))

    for (const neighborId of adjacency.get(nodeId) ?? []) {
      indegrees[neighborId] -= 1
      steps.push(snapshot(
        'in-degree',
        neighborId,
        indegrees,
        queue,
        order,
        `Reduced in-degree of ${labelFor(neighborId, labels)} to ${indegrees[neighborId]}.`,
      ))
      if (indegrees[neighborId] !== 0) continue

      queue.push(neighborId)
      steps.push(snapshot(
        'enqueue',
        neighborId,
        indegrees,
        queue,
        order,
        `Added ${labelFor(neighborId, labels)} to the queue: [${queue.map((id) => labelFor(id, labels)).join(', ')}].`,
      ))
    }
  }

  if (order.length !== nodes.length) {
    const remainingNodes = nodes.filter((node) => !order.includes(node.id))
    const nodeId = remainingNodes[0]?.id ?? ''
    steps.push(snapshot(
      'cycle-detected',
      nodeId,
      indegrees,
      queue,
      order,
      `Cycle detected. No topological order exists; blocked nodes: ${remainingNodes.map((node) => labelFor(node.id, labels)).join(', ')}.`,
    ))
    return steps
  }

  steps.push(snapshot(
    'done',
    nodes[0]?.id ?? '',
    indegrees,
    queue,
    order,
    `Topological order complete: ${order.map((nodeId) => labelFor(nodeId, labels)).join(' → ')}.`,
  ))
  return steps
}