import type { TreeNode } from './treeTypes'

export type BSTOperation = {
  tree: TreeNode[]
  path: string[]
  nodeId: string
  message: string
}

function copyTree(nodes: TreeNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function nextNodeId(nodes: TreeNode[], value: number) {
  const preferredId = `node-${value}`
  if (!nodes.some((node) => node.id === preferredId)) return preferredId
  let suffix = 2
  while (nodes.some((node) => node.id === `${preferredId}-${suffix}`)) suffix += 1
  return `${preferredId}-${suffix}`
}

export function bstInsert(nodes: TreeNode[], rootId: string, value: number): BSTOperation {
  const tree = copyTree(nodes)
  const byId = new Map(tree.map((node) => [node.id, node]))
  const path: string[] = []

  if (tree.length === 0) {
    const root: TreeNode = { id: rootId, value, left: null, right: null, color: 'black' }
    return { tree: [root], path: [], nodeId: root.id, message: `Inserted ${value} as the root.` }
  }

  let current = byId.get(rootId)
  while (current) {
    path.push(current.id)
    if (value === current.value) {
      return { tree: nodes, path, nodeId: current.id, message: `${value} already exists.` }
    }
    const direction = value < current.value ? 'left' : 'right'
    const childId = current[direction]
    if (!childId) {
      const inserted: TreeNode = { id: nextNodeId(tree, value), value, left: null, right: null, color: 'black' }
      current[direction] = inserted.id
      tree.push(inserted)
      return { tree, path: [...path, inserted.id], nodeId: inserted.id, message: `Inserted ${value} ${direction} of ${current.value}.` }
    }
    current = byId.get(childId)
  }

  return { tree: nodes, path, nodeId: rootId, message: `Could not find root ${rootId}.` }
}

export function bstDelete(nodes: TreeNode[], rootId: string, value: number): BSTOperation {
  const tree = copyTree(nodes)
  const byId = new Map(tree.map((node) => [node.id, node]))
  const path: string[] = []
  let current = byId.get(rootId)
  let parent: TreeNode | undefined

  while (current && current.value !== value) {
    path.push(current.id)
    parent = current
    current = byId.get(value < current.value ? current.left ?? '' : current.right ?? '')
  }
  if (!current) return { tree: nodes, path, nodeId: parent?.id ?? rootId, message: `${value} was not found.` }

  path.push(current.id)
  let removed = current
  let message = `Deleted ${value}.`
  if (current.left && current.right) {
    let successorParent = current
    let successor = byId.get(current.right)
    while (successor?.left) {
      successorParent = successor
      successor = byId.get(successor.left)
    }
    if (successor) {
      current.value = successor.value
      removed = successor
      message = `Deleted ${value} (replaced with successor ${successor.value}).`
      parent = successorParent
    }
  }

  const child = removed.left ?? removed.right
  if (!parent) {
    const index = tree.findIndex((node) => node.id === removed.id)
    if (child) {
      const childNode = byId.get(child)
      if (childNode && index >= 0) tree[index] = childNode
    } else if (index >= 0) tree.splice(index, 1)
  } else if (parent.left === removed.id) parent.left = child
  else if (parent.right === removed.id) parent.right = child
  const removedIndex = tree.findIndex((node) => node.id === removed.id)
  if (removedIndex >= 0 && removed.id !== tree[0]?.id) tree.splice(removedIndex, 1)

  return { tree, path, nodeId: removed.id, message }
}