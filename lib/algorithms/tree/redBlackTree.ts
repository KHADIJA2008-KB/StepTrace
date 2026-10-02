import { rotateTree } from './avl'
import type { TreeStep } from './traversals'
import type { TreeNode } from './treeTypes'

export type RBColor = 'red' | 'black'

export type RBStep = Omit<TreeStep, 'type'> & {
  type: TreeStep['type'] | 'recolor'
  treeAfter: TreeNode[]
  colorChanges?: { nodeId: string; from: RBColor; to: RBColor }[]
  rotationType?: 'left' | 'right'
}

function copyTree(nodes: TreeNode[]) {
  return nodes.map((node) => ({ ...node }))
}

function snapshot(type: RBStep['type'], nodeId: string, message: string, nodes: TreeNode[], extra: Pick<RBStep, 'colorChanges' | 'rotationType'> = {}): RBStep {
  return { type, nodeId, message, treeAfter: copyTree(nodes), ...extra }
}

function color(nodes: Map<string, TreeNode>, nodeId: string | null): RBColor {
  return nodeId ? nodes.get(nodeId)?.color ?? 'black' : 'black'
}

function parentOf(nodes: TreeNode[], nodeId: string): string | null {
  return nodes.find((node) => node.left === nodeId || node.right === nodeId)?.id ?? null
}

function changeColor(node: TreeNode, to: RBColor, changes: { nodeId: string; from: RBColor; to: RBColor }[]) {
  if (node.color === to) return
  changes.push({ nodeId: node.id, from: node.color, to })
  node.color = to
}

export function rbInsert(nodes: TreeNode[], rootId: string | null, value: number): RBStep[] {
  const tree = copyTree(nodes)
  const byId = new Map(tree.map((node) => [node.id, node]))
  const steps: RBStep[] = []
  let currentId = rootId
  let parentId: string | null = null

  while (currentId) {
    const current = byId.get(currentId)
    if (!current) break
    steps.push(snapshot('compare', current.id, `Compared ${value} with ${current.value}.`, tree))
    parentId = current.id
    if (value === current.value) {
      steps.push(snapshot('done', current.id, `${value} already exists.`, tree))
      return steps
    }
    currentId = value < current.value ? current.left : current.right
  }

  const inserted: TreeNode = {
    id: `node-${value}-${tree.length}`,
    value,
    left: null,
    right: null,
    color: 'red',
  }
  tree.push(inserted)
  byId.set(inserted.id, inserted)
  if (parentId) {
    const parent = byId.get(parentId) as TreeNode
    if (value < parent.value) parent.left = inserted.id
    else parent.right = inserted.id
  } else {
    rootId = inserted.id
  }
  steps.push(snapshot('insert', inserted.id, `Inserted ${value} as a red leaf.`, tree))

  let root = rootId as string
  let z = inserted.id
  while (true) {
    const parent = parentOf(tree, z)
    if (!parent || color(byId, parent) === 'black') break
    const grandparent = parentOf(tree, parent)
    if (!grandparent) break
    const grand = byId.get(grandparent) as TreeNode
    const parentNode = byId.get(parent) as TreeNode
    const parentIsLeft = grand.left === parent
    const uncleId = parentIsLeft ? grand.right : grand.left

    if (color(byId, uncleId) === 'red') {
      const changes: { nodeId: string; from: RBColor; to: RBColor }[] = []
      changeColor(parentNode, 'black', changes)
      const uncle = uncleId ? byId.get(uncleId) : undefined
      if (uncle) changeColor(uncle, 'black', changes)
      changeColor(grand, 'red', changes)
      steps.push(snapshot('recolor', grand.id, 'Uncle is red → recolored parent and uncle to black, grandparent to red.', tree, { colorChanges: changes }))
      z = grand.id
      continue
    }

    if (parentIsLeft) {
      if (parentNode.right === z) {
        root = rotateTree(tree, root, parent, 'left')
        steps.push(snapshot('rotate', parent, 'Rotated left around the parent.', tree, { rotationType: 'left' }))
        z = parent
      }
      const newParentId = parentOf(tree, z)
      const newGrandparentId = newParentId ? parentOf(tree, newParentId) : null
      const newParent = newParentId ? byId.get(newParentId) : undefined
      const newGrandparent = newGrandparentId ? byId.get(newGrandparentId) : undefined
      if (newParent && newGrandparent) {
        const changes: { nodeId: string; from: RBColor; to: RBColor }[] = []
        changeColor(newParent, 'black', changes)
        changeColor(newGrandparent, 'red', changes)
        steps.push(snapshot('recolor', newGrandparent.id, 'Uncle is black → recolored parent black and grandparent red.', tree, { colorChanges: changes }))
        root = rotateTree(tree, root, newGrandparent.id, 'right')
        steps.push(snapshot('rotate', newGrandparent.id, 'Rotated right around the grandparent.', tree, { rotationType: 'right' }))
      }
    } else {
      if (parentNode.left === z) {
        root = rotateTree(tree, root, parent, 'right')
        steps.push(snapshot('rotate', parent, 'Rotated right around the parent.', tree, { rotationType: 'right' }))
        z = parent
      }
      const newParentId = parentOf(tree, z)
      const newGrandparentId = newParentId ? parentOf(tree, newParentId) : null
      const newParent = newParentId ? byId.get(newParentId) : undefined
      const newGrandparent = newGrandparentId ? byId.get(newGrandparentId) : undefined
      if (newParent && newGrandparent) {
        const changes: { nodeId: string; from: RBColor; to: RBColor }[] = []
        changeColor(newParent, 'black', changes)
        changeColor(newGrandparent, 'red', changes)
        steps.push(snapshot('recolor', newGrandparent.id, 'Uncle is black → recolored parent black and grandparent red.', tree, { colorChanges: changes }))
        root = rotateTree(tree, root, newGrandparent.id, 'left')
        steps.push(snapshot('rotate', newGrandparent.id, 'Rotated left around the grandparent.', tree, { rotationType: 'left' }))
      }
    }
  }

  const rootNode = byId.get(root)
  if (rootNode && rootNode.color !== 'black') {
    const changes: { nodeId: string; from: RBColor; to: RBColor }[] = []
    changeColor(rootNode, 'black', changes)
    steps.push(snapshot('recolor', root, 'Confirmed the root is black.', tree, { colorChanges: changes }))
  }
  steps.push(snapshot('done', root, `Inserted ${value} and confirmed a black root.`, tree))
  return steps
}