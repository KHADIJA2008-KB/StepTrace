import type { GraphEdge, GraphNode } from './graphTypes'

export type GraphStep = {
  type: 'visit' | 'relax' | 'update-distance' | 'finalize' | 'done'
  nodeId: string
  edgeId?: string
  distances: Record<string, number>
  message: string
}

type QueueEntry = { nodeId: string; distance: number }
type Neighbor = { edge: GraphEdge; nodeId: string }

function compareEntries(left: QueueEntry, right: QueueEntry) {
  return left.distance - right.distance || left.nodeId.localeCompare(right.nodeId)
}

function enqueue(queue: QueueEntry[], entry: QueueEntry) {
  queue.push(entry)
  let index = queue.length - 1

  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2)
    if (compareEntries(queue[parentIndex], queue[index]) <= 0) break
    ;[queue[parentIndex], queue[index]] = [queue[index], queue[parentIndex]]
    index = parentIndex
  }
}

function dequeue(queue: QueueEntry[]): QueueEntry | undefined {
  const minimum = queue[0]
  const last = queue.pop()
  if (queue.length === 0 || last === undefined) return minimum

  queue[0] = last
  let index = 0
  while (true) {
    const leftIndex = index * 2 + 1
    const rightIndex = leftIndex + 1
    let minimumIndex = index
    if (leftIndex < queue.length && compareEntries(queue[leftIndex], queue[minimumIndex]) < 0) minimumIndex = leftIndex
    if (rightIndex < queue.length && compareEntries(queue[rightIndex], queue[minimumIndex]) < 0) minimumIndex = rightIndex
    if (minimumIndex === index) break
    ;[queue[index], queue[minimumIndex]] = [queue[minimumIndex], queue[index]]
    index = minimumIndex
  }

  return minimum
}

function formatDistance(distance: number) {
  return Number.isFinite(distance) ? String(distance) : 'Infinity'
}

export function dijkstra(nodes: GraphNode[], edges: GraphEdge[], startId: string): GraphStep[] {
  if (!nodes.some((node) => node.id === startId)) return []

  const nodeIds = new Set(nodes.map((node) => node.id))
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const adjacency = new Map<string, Neighbor[]>(nodes.map((node) => [node.id, []]))

  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue
    const weight = edge.weight ?? 1
    if (!Number.isFinite(weight) || weight < 0) {
      throw new RangeError('Dijkstra requires finite, non-negative edge weights.')
    }

    adjacency.get(edge.from)?.push({ edge, nodeId: edge.to })
    if (!edge.directed && edge.from !== edge.to) adjacency.get(edge.to)?.push({ edge, nodeId: edge.from })
  }

  const distances = Object.fromEntries(nodes.map((node) => [node.id, Infinity])) as Record<string, number>
  const steps: GraphStep[] = []
  const priorityQueue: QueueEntry[] = []
  const finalized = new Set<string>()
  distances[startId] = 0
  enqueue(priorityQueue, { nodeId: startId, distance: 0 })

  while (priorityQueue.length > 0) {
    const entry = dequeue(priorityQueue)
    if (!entry || finalized.has(entry.nodeId) || entry.distance !== distances[entry.nodeId]) continue

    finalized.add(entry.nodeId)
    const nodeLabel = labels.get(entry.nodeId) ?? entry.nodeId
    steps.push({
      type: 'finalize',
      nodeId: entry.nodeId,
      distances: { ...distances },
      message: `Finalized ${nodeLabel} at distance ${formatDistance(entry.distance)}.`,
    })
    steps.push({ type: 'visit', nodeId: entry.nodeId, distances: { ...distances }, message: `Visited ${nodeLabel}.` })

    for (const neighbor of adjacency.get(entry.nodeId) ?? []) {
      const currentDistance = distances[neighbor.nodeId]
      const candidateDistance = entry.distance + (neighbor.edge.weight ?? 1)
      const neighborLabel = labels.get(neighbor.nodeId) ?? neighbor.nodeId
      steps.push({
        type: 'relax',
        nodeId: entry.nodeId,
        edgeId: neighbor.edge.id,
        distances: { ...distances },
        message: `Checked edge ${nodeLabel} → ${neighborLabel}: candidate ${formatDistance(candidateDistance)}, current ${formatDistance(currentDistance)}.`,
      })

      if (finalized.has(neighbor.nodeId) || candidateDistance >= currentDistance) continue

      distances[neighbor.nodeId] = candidateDistance
      enqueue(priorityQueue, { nodeId: neighbor.nodeId, distance: candidateDistance })
      steps.push({
        type: 'update-distance',
        nodeId: neighbor.nodeId,
        edgeId: neighbor.edge.id,
        distances: { ...distances },
        message: `Updated ${neighborLabel} distance to ${formatDistance(candidateDistance)}.`,
      })
    }
  }

  steps.push({ type: 'done', nodeId: startId, distances: { ...distances }, message: 'Dijkstra traversal complete.' })
  return steps
}