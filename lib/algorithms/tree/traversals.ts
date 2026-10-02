import type { TreeNode } from './treeTypes'

export type TreeStep = {
  type: 'visit' | 'backtrack' | 'done' | 'compare' | 'insert' | 'rotate' | 'found' | 'not-found'
  nodeId: string
  message: string
}

function nodeMap(nodes: TreeNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
}

function visit(node: TreeNode): TreeStep {
  return { type: 'visit', nodeId: node.id, message: `Visited ${node.id}.` }
}

function backtrack(node: TreeNode): TreeStep {
  return { type: 'backtrack', nodeId: node.id, message: `Backtracked from ${node.id}.` }
}

function done(rootId: string, traversal: string): TreeStep {
  return { type: 'done', nodeId: rootId, message: `${traversal} traversal complete.` }
}

export function preorderTraversal(nodes: TreeNode[], rootId: string): TreeStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeStep[] = []
  const visited = new Set<string>()

  function traverse(nodeId: string | null) {
    if (nodeId === null || visited.has(nodeId)) return
    const node = byId.get(nodeId)
    if (!node) return

    visited.add(nodeId)
    steps.push(visit(node))
    traverse(node.left)
    traverse(node.right)
    steps.push(backtrack(node))
  }

  traverse(rootId)
  steps.push(done(rootId, 'Preorder'))
  return steps
}

export function inorderTraversal(nodes: TreeNode[], rootId: string): TreeStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeStep[] = []
  const visited = new Set<string>()

  function traverse(nodeId: string | null) {
    if (nodeId === null || visited.has(nodeId)) return
    const node = byId.get(nodeId)
    if (!node) return

    visited.add(nodeId)
    traverse(node.left)
    steps.push(visit(node))
    traverse(node.right)
    steps.push(backtrack(node))
  }

  traverse(rootId)
  steps.push(done(rootId, 'Inorder'))
  return steps
}

export function postorderTraversal(nodes: TreeNode[], rootId: string): TreeStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeStep[] = []
  const visited = new Set<string>()

  function traverse(nodeId: string | null) {
    if (nodeId === null || visited.has(nodeId)) return
    const node = byId.get(nodeId)
    if (!node) return

    visited.add(nodeId)
    traverse(node.left)
    traverse(node.right)
    steps.push(visit(node))
    steps.push(backtrack(node))
  }

  traverse(rootId)
  steps.push(done(rootId, 'Postorder'))
  return steps
}

export function levelOrderTraversal(nodes: TreeNode[], rootId: string): TreeStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeStep[] = []
  const queue = [rootId]
  const visited = new Set<string>()

  while (queue.length > 0) {
    const nodeId = queue.shift()
    if (!nodeId || visited.has(nodeId)) continue
    const node = byId.get(nodeId)
    if (!node) continue

    visited.add(nodeId)
    steps.push(visit(node))
    if (node.left !== null) queue.push(node.left)
    if (node.right !== null) queue.push(node.right)
  }

  steps.push(done(rootId, 'Level-order'))
  return steps
}

export function morrisInorderTraversal(nodes: TreeNode[], rootId: string): TreeStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeStep[] = []
  const threads = new Map<string, string>()
  let currentId: string | null = rootId

  while (currentId !== null) {
    const node = byId.get(currentId)
    if (!node) break

    if (node.left === null) {
      steps.push(visit(node))
      currentId = threads.get(node.id) ?? node.right
      continue
    }

    let predecessorId = node.left
    let predecessor = byId.get(predecessorId)
    let predecessorRight = predecessor
      ? predecessor.right ?? threads.get(predecessor.id) ?? null
      : null
    while (predecessor && predecessorRight !== null && predecessorRight !== currentId) {
      predecessorId = predecessorRight
      predecessor = byId.get(predecessorId)
      predecessorRight = predecessor
        ? predecessor.right ?? threads.get(predecessor.id) ?? null
        : null
    }

    if (!predecessor) break

    if (predecessorRight === currentId) {
      threads.delete(predecessor.id)
      steps.push(visit(node))
      steps.push(backtrack(node))
      currentId = node.right
    } else {
      threads.set(predecessor.id, currentId)
      currentId = node.left
    }
  }

  steps.push(done(rootId, 'Morris inorder'))
  return steps
}