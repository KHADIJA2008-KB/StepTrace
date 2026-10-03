import type { GraphEdge, GraphNode } from './graphTypes'

export type MSTStep = {
  type: 'visit' | 'consider' | 'accept' | 'reject' | 'done'
  nodeId: string
  edgeId?: string
  mstEdges: string[]
  message: string
}

type WeightedEdge = GraphEdge & { weight: number }

function validEdges(nodes: GraphNode[], edges: GraphEdge[]): WeightedEdge[] {
  const nodeIds = new Set(nodes.map((node) => node.id))
  return edges.flatMap((edge) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) return []
    const weight = edge.weight ?? 1
    if (!Number.isFinite(weight)) throw new RangeError('MST edges require finite weights.')
    return [{ ...edge, weight }]
  })
}

function compareEdges(left: WeightedEdge, right: WeightedEdge) {
  return left.weight - right.weight || left.id.localeCompare(right.id)
}

function edgeLabel(edge: WeightedEdge, labels: Map<string, string>) {
  const fromLabel = labels.get(edge.from) ?? edge.from
  const toLabel = labels.get(edge.to) ?? edge.to
  return `${fromLabel} — ${toLabel} (${edge.weight})`
}

function recordStep(
  steps: MSTStep[],
  mstEdges: string[],
  step: Omit<MSTStep, 'mstEdges'>,
) {
  steps.push({ ...step, mstEdges: [...mstEdges] })
}

export function primsMST(nodes: GraphNode[], edges: GraphEdge[], startId: string): MSTStep[] {
  if (nodes.length === 0 || !nodes.some((node) => node.id === startId)) return []

  const candidates = validEdges(nodes, edges)
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const steps: MSTStep[] = []
  const mstEdges: string[] = []
  const visited = new Set<string>()
  let componentStartId = startId
  let componentCount = 0

  while (visited.size < nodes.length) {
    if (visited.has(componentStartId)) {
      const nextNode = nodes.find((node) => !visited.has(node.id))
      if (!nextNode) break
      componentStartId = nextNode.id
    }

    visited.add(componentStartId)
    componentCount += 1
    recordStep(steps, mstEdges, {
      type: 'visit',
      nodeId: componentStartId,
      message: `Started a component at ${labels.get(componentStartId) ?? componentStartId}.`,
    })

    while (true) {
      const available = candidates.filter((edge) =>
        (visited.has(edge.from) && !visited.has(edge.to)) ||
        (visited.has(edge.to) && !visited.has(edge.from)),
      ).sort(compareEdges)
      if (available.length === 0) break

      for (let index = 0; index < available.length; index += 1) {
        const edge = available[index]
        recordStep(steps, mstEdges, {
          type: 'consider',
          nodeId: edge.from,
          edgeId: edge.id,
          message: `${index === 0 ? 'Cheapest available edge' : 'Available edge'}: ${edgeLabel(edge, labels)}.`,
        })
      }

      const cheapest = available[0]
      const addedNodeId = visited.has(cheapest.from) ? cheapest.to : cheapest.from
      mstEdges.push(cheapest.id)
      visited.add(addedNodeId)
      recordStep(steps, mstEdges, {
        type: 'accept',
        nodeId: addedNodeId,
        edgeId: cheapest.id,
        message: `Added ${edgeLabel(cheapest, labels)} to the MST.`,
      })
    }
  }

  recordStep(steps, mstEdges, {
    type: 'done',
    nodeId: startId,
    message: componentCount > 1 ? 'Minimum spanning forest complete.' : 'Minimum spanning tree complete.',
  })
  return steps
}

export function kruskalsMST(nodes: GraphNode[], edges: GraphEdge[]): MSTStep[] {
  if (nodes.length === 0) return []

  const candidates = validEdges(nodes, edges).sort(compareEdges)
  const labels = new Map(nodes.map((node) => [node.id, node.label]))
  const parent = new Map(nodes.map((node) => [node.id, node.id]))
  const rank = new Map(nodes.map((node) => [node.id, 0]))
  const steps: MSTStep[] = []
  const mstEdges: string[] = []

  function find(nodeId: string): string {
    const parentId = parent.get(nodeId)
    if (parentId === undefined || parentId === nodeId) return nodeId
    const rootId = find(parentId)
    parent.set(nodeId, rootId)
    return rootId
  }

  function union(leftId: string, rightId: string) {
    let leftRoot = find(leftId)
    let rightRoot = find(rightId)
    if (leftRoot === rightRoot) return false

    const leftRank = rank.get(leftRoot) ?? 0
    const rightRank = rank.get(rightRoot) ?? 0
    if (leftRank < rightRank) {
      ;[leftRoot, rightRoot] = [rightRoot, leftRoot]
    }
    parent.set(rightRoot, leftRoot)
    if (leftRank === rightRank) rank.set(leftRoot, leftRank + 1)
    return true
  }

  for (const edge of candidates) {
    recordStep(steps, mstEdges, {
      type: 'consider',
      nodeId: edge.from,
      edgeId: edge.id,
      message: `Considering ${edgeLabel(edge, labels)} in weight order.`,
    })

    if (union(edge.from, edge.to)) {
      mstEdges.push(edge.id)
      recordStep(steps, mstEdges, {
        type: 'accept',
        nodeId: edge.to,
        edgeId: edge.id,
        message: `Accepted ${edgeLabel(edge, labels)}; it connects two components.`,
      })
    } else {
      recordStep(steps, mstEdges, {
        type: 'reject',
        nodeId: edge.to,
        edgeId: edge.id,
        message: `Rejected ${edgeLabel(edge, labels)}; it would create a cycle.`,
      })
    }
  }

  recordStep(steps, mstEdges, {
    type: 'done',
    nodeId: nodes[0].id,
    message: mstEdges.length === nodes.length - 1 ? 'Minimum spanning tree complete.' : 'Minimum spanning forest complete.',
  })
  return steps
}