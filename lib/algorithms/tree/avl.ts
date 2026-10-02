import { bstDelete, bstInsert } from './bst'
import type { TreeNode } from './treeTypes'

export type AVLRotationType = 'left' | 'right' | 'left-right' | 'right-left'

export type AVLStep = {
  type: 'visit' | 'rotate' | 'done'
  nodeId: string
  message: string
  treeAfter: TreeNode[]
  rotationType?: AVLRotationType
  height?: number
  balanceFactor?: number
}

function copyTree(nodes: TreeNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function metrics(nodes: TreeNode[]) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const heights = new Map<string, number>()
  const height = (nodeId: string | null): number => {
    if (!nodeId) return 0
    if (heights.has(nodeId)) return heights.get(nodeId) as number
    const node = byId.get(nodeId)
    if (!node) return 0
    const value = 1 + Math.max(height(node.left), height(node.right))
    heights.set(nodeId, value)
    return value
  }
  const balance = (node: TreeNode) => height(node.left) - height(node.right)
  return { byId, height, balance }
}

function step(type: AVLStep['type'], nodeId: string, message: string, treeAfter: TreeNode[], extra: Pick<AVLStep, 'rotationType' | 'height' | 'balanceFactor'> = {}): AVLStep {
  return { type, nodeId, message, treeAfter: copyTree(treeAfter), ...extra }
}

function replaceChild(nodes: TreeNode[], parentId: string | null, oldId: string, newId: string | null, rootId: string) {
  if (!parentId) return newId ?? rootId
  const parent = nodes.find((node) => node.id === parentId)
  if (!parent) return rootId
  if (parent.left === oldId) parent.left = newId
  else if (parent.right === oldId) parent.right = newId
  return rootId
}

export function rotateTree(nodes: TreeNode[], rootId: string, pivotId: string, rotationType: 'left' | 'right') {
  const { byId } = metrics(nodes)
  const pivot = byId.get(pivotId)
  if (!pivot) return rootId
  const parent = nodes.find((node) => node.left === pivotId || node.right === pivotId)
  if (rotationType === 'left') {
    const childId = pivot.right
    const child = childId ? byId.get(childId) : undefined
    if (!child) return rootId
    pivot.right = child.left
    child.left = pivot.id
    return replaceChild(nodes, parent?.id ?? null, pivot.id, child.id, rootId)
  }
  const childId = pivot.left
  const child = childId ? byId.get(childId) : undefined
  if (!child) return rootId
  pivot.left = child.right
  child.right = pivot.id
  return replaceChild(nodes, parent?.id ?? null, pivot.id, child.id, rootId)
}

function applyRotation(nodes: TreeNode[], rootId: string, pivotId: string, rotationType: AVLRotationType) {
  const { byId } = metrics(nodes)
  const pivot = byId.get(pivotId)
  if (!pivot) return rootId
  let nextRootId = rootId
  if (rotationType === 'left-right') {
    const leftId = pivot.left
    if (leftId) rotateTree(nodes, rootId, leftId, 'left')
    nextRootId = rotateTree(nodes, rootId, pivotId, 'right')
  } else if (rotationType === 'right-left') {
    const rightId = pivot.right
    if (rightId) rotateTree(nodes, rootId, rightId, 'right')
    nextRootId = rotateTree(nodes, rootId, pivotId, 'left')
  } else nextRootId = rotateTree(nodes, rootId, pivotId, rotationType)

  const rootIndex = nodes.findIndex((node) => node.id === nextRootId)
  if (rootIndex > 0) {
    const [newRoot] = nodes.splice(rootIndex, 1)
    nodes.unshift(newRoot)
  }
  return nextRootId
}

function rebalance(nodes: TreeNode[], rootId: string, path: string[], steps: AVLStep[]) {
  let currentRootId = rootId
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const nodeId = path[index]
    const { byId, balance } = metrics(nodes)
    const node = byId.get(nodeId)
    if (!node) continue
    const factor = balance(node)
    if (factor < -1 || factor > 1) {
      const left = node.left ? byId.get(node.left) : undefined
      const right = node.right ? byId.get(node.right) : undefined
      let rotationType: AVLRotationType
      if (factor > 1) rotationType = left && balance(left) < 0 ? 'left-right' : 'right'
      else rotationType = right && balance(right) > 0 ? 'right-left' : 'left'
      currentRootId = applyRotation(nodes, currentRootId, nodeId, rotationType)
      const updated = metrics(nodes)
      steps.push(step('rotate', nodeId, `Rebalanced ${nodeId} with a ${rotationType} rotation.`, nodes, {
        rotationType,
        height: updated.height(currentRootId),
        balanceFactor: updated.balance(updated.byId.get(currentRootId) as TreeNode),
      }))
    }
  }
  return currentRootId
}

function run(nodes: TreeNode[], rootId: string, operation: ReturnType<typeof bstInsert>) {
  const working = copyTree(operation.tree)
  const steps: AVLStep[] = operation.path.map((nodeId) => step('visit', nodeId, `Checked balance path at ${nodeId}.`, working))
  const newRoot = rebalance(working, rootId, operation.path, steps)
  steps.push(step('done', newRoot, operation.message, working))
  return steps
}

export function avlInsert(nodes: TreeNode[], rootId: string, value: number): AVLStep[] {
  return run(nodes, rootId, bstInsert(nodes, rootId, value))
}

export function avlDelete(nodes: TreeNode[], rootId: string, value: number): AVLStep[] {
  return run(nodes, rootId, bstDelete(nodes, rootId, value))
}