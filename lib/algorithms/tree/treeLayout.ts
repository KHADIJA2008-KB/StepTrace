import type { TreeNode } from './treeTypes'

export type TreeLayoutPosition = {
  id: string
  x: number
  y: number
}

const levelHeight = 100

export function computeHierarchyLayout<T>(
  nodes: T[],
  rootId: string,
  getChildren: (node: T) => string[],
  getId: (node: T) => string = (node) => (node as { id: string }).id,
): TreeLayoutPosition[] {
  const nodesById = new Map(nodes.map((node) => [getId(node), node]))
  const positions: TreeLayoutPosition[] = []
  const visited = new Set<string>()
  let nextX = 0

  function layoutNode(nodeId: string, depth: number): TreeLayoutPosition | null {
    const node = nodesById.get(nodeId)
    if (!node || visited.has(nodeId)) return null

    visited.add(nodeId)
    const childPositions = getChildren(node)
      .map((childId) => layoutNode(childId, depth + 1))
      .filter((position): position is TreeLayoutPosition => position !== null)
    const x = childPositions.length > 0
      ? (childPositions[0].x + childPositions[childPositions.length - 1].x) / 2
      : nextX++
    const position = { id: getId(node), x, y: depth * levelHeight }

    positions.push(position)
    return position
  }

  layoutNode(rootId, 0)
  return positions
}

export function computeTreeLayout(nodes: TreeNode[], rootId: string): TreeLayoutPosition[] {
  return computeHierarchyLayout(nodes, rootId, (node) => [node.left, node.right].filter((id): id is string => id !== null))
}