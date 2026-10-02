import type { TreeNode } from './treeTypes'

export type TreeAnalysisStep = {
  type: 'visit' | 'diverge' | 'found' | 'not-found' | 'height' | 'diameter' | 'match' | 'mismatch' | 'append' | 'serialize' | 'parse'
  nodeId: string
  message: string
  pathNodeIds: string[]
  otherNodeId?: string | null
  matchedPairs?: Array<{ nodeId: string; otherNodeId: string }>
  mismatchSide?: 'a' | 'b'
  token?: string
  serialized?: string
  nodesAfter?: TreeNode[]
  rootId?: string
  value?: number
  height?: number
  leftHeight?: number
  rightHeight?: number
  diameter?: number
}

function nodeMap(nodes: TreeNode[]) {
  return new Map(nodes.map((node) => [node.id, node]))
}

export function lowestCommonAncestor(
  nodes: TreeNode[],
  rootId: string,
  valueA: number,
  valueB: number,
): TreeAnalysisStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeAnalysisStep[] = []

  function findPath(nodeId: string | null, target: number, path: string[], active: Set<string>): string[] | null {
    if (!nodeId || active.has(nodeId)) return null
    const node = byId.get(nodeId)
    if (!node) return null
    const nextPath = [...path, node.id]
    steps.push({
      type: 'visit',
      nodeId: node.id,
      message: `Searching for ${target} at ${node.value}.`,
      pathNodeIds: nextPath,
    })
    if (node.value === target) return nextPath

    const nextActive = new Set(active)
    nextActive.add(node.id)
    return findPath(node.left, target, nextPath, nextActive)
      ?? findPath(node.right, target, nextPath, nextActive)
  }

  const pathA = findPath(rootId, valueA, [], new Set())
  const pathB = findPath(rootId, valueB, [], new Set())
  if (!pathA || !pathB) {
    const missingValue = pathA ? valueB : valueA
    steps.push({
      type: 'not-found',
      nodeId: rootId,
      message: `Could not find node ${missingValue}.`,
      pathNodeIds: pathA ?? pathB ?? [],
    })
    return steps
  }

  let commonLength = 0
  while (commonLength < pathA.length && commonLength < pathB.length && pathA[commonLength] === pathB[commonLength]) {
    commonLength += 1
  }
  const ancestorId = pathA[commonLength - 1]
  const ancestor = byId.get(ancestorId)
  if (!ancestor) return steps

  const combinedPath = Array.from(new Set([...pathA, ...pathB]))
  steps.push({
    type: 'diverge',
    nodeId: ancestor.id,
    message: `The search paths diverge below ${ancestor.value}.`,
    pathNodeIds: combinedPath,
  })
  steps.push({
    type: 'found',
    nodeId: ancestor.id,
    value: ancestor.value,
    message: `Lowest common ancestor of ${valueA} and ${valueB} is ${ancestor.value}.`,
    pathNodeIds: combinedPath,
  })
  return steps
}

export function treeDiameter(nodes: TreeNode[], rootId: string): TreeAnalysisStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeAnalysisStep[] = []
  const visited = new Set<string>()
  let longestPath: string[] = []
  let longestEdges = -1

  type Branch = { height: number; path: string[] }

  function height(nodeId: string | null): Branch {
    if (!nodeId || visited.has(nodeId)) return { height: 0, path: [] }
    const node = byId.get(nodeId)
    if (!node) return { height: 0, path: [] }

    visited.add(node.id)
    const left = height(node.left)
    const right = height(node.right)
    const leftPath = left.path.length > 0 ? [...left.path].reverse() : []
    const candidatePath = [...leftPath, node.id, ...right.path]
    const candidateEdges = candidatePath.length - 1
    if (candidateEdges > longestEdges) {
      longestEdges = candidateEdges
      longestPath = candidatePath
    }

    const nodeHeight = Math.max(left.height, right.height) + 1
    steps.push({
      type: 'height',
      nodeId: node.id,
      message: `Height at ${node.value}: 1 + max(${left.height}, ${right.height}) = ${nodeHeight}. Longest path so far: ${Math.max(0, longestEdges)} edges.`,
      pathNodeIds: [...longestPath],
      height: nodeHeight,
      leftHeight: left.height,
      rightHeight: right.height,
      diameter: Math.max(0, longestEdges),
    })

    const deepestBranch = left.height >= right.height ? left : right
    return { height: nodeHeight, path: [node.id, ...deepestBranch.path] }
  }

  const root = byId.get(rootId)
  if (!root) {
    steps.push({ type: 'diameter', nodeId: rootId, message: 'The tree is empty; diameter is 0.', pathNodeIds: [], diameter: 0 })
    return steps
  }

  height(rootId)
  steps.push({
    type: 'diameter',
    nodeId: rootId,
    message: `Tree diameter is ${Math.max(0, longestEdges)} edges.`,
    pathNodeIds: [...longestPath],
    diameter: Math.max(0, longestEdges),
  })
  return steps
}

export function checkIsomorphic(
  nodesA: TreeNode[],
  rootA: string,
  nodesB: TreeNode[],
  rootB: string,
): TreeAnalysisStep[] {
  const byA = nodeMap(nodesA)
  const byB = nodeMap(nodesB)
  const steps: TreeAnalysisStep[] = []
  const matchedPairs: Array<{ nodeId: string; otherNodeId: string }> = []
  let mismatch: TreeAnalysisStep | undefined

  function compare(idA: string | null, idB: string | null, pathA: string[], pathB: string[]): boolean {
    if (idA === null && idB === null) return true
    const nodeA = idA ? byA.get(idA) : undefined
    const nodeB = idB ? byB.get(idB) : undefined
    if (!nodeA || !nodeB) {
      const mismatchId = nodeA?.id ?? nodeB?.id ?? rootA
      mismatch = {
        type: 'mismatch',
        nodeId: mismatchId,
        otherNodeId: nodeA ? null : nodeB?.id ?? null,
        mismatchSide: nodeA ? 'b' : 'a',
        message: nodeA ? 'Tree B is missing a matching node.' : 'Tree A is missing a matching node.',
        pathNodeIds: nodeA ? pathA : pathB,
        matchedPairs: [...matchedPairs],
      }
      steps.push(mismatch)
      return false
    }

    const nextPathA = [...pathA, nodeA.id]
    const nextPathB = [...pathB, nodeB.id]
    matchedPairs.push({ nodeId: nodeA.id, otherNodeId: nodeB.id })
    steps.push({
      type: 'match',
      nodeId: nodeA.id,
      otherNodeId: nodeB.id,
      message: `Matched structure at ${nodeA.value} and ${nodeB.value}.`,
      pathNodeIds: nextPathA,
      matchedPairs: [...matchedPairs],
    })

    return compare(nodeA.left, nodeB.left, nextPathA, nextPathB)
      && compare(nodeA.right, nodeB.right, nextPathA, nextPathB)
  }

  const isomorphic = compare(rootA || null, rootB || null, [], [])
  if (isomorphic) {
    steps.push({
      type: 'found',
      nodeId: rootA,
      otherNodeId: rootB,
      message: 'The trees have matching structure.',
      pathNodeIds: [],
      matchedPairs: [...matchedPairs],
    })
  } else {
    steps.push({
      type: 'not-found',
      nodeId: mismatch?.nodeId ?? rootA,
      otherNodeId: mismatch?.otherNodeId,
      mismatchSide: mismatch?.mismatchSide,
      message: 'The trees are not isomorphic.',
      pathNodeIds: mismatch?.pathNodeIds ?? [],
      matchedPairs: [...matchedPairs],
    })
  }
  return steps
}

export function serializeTree(nodes: TreeNode[], rootId: string): TreeAnalysisStep[] {
  const byId = nodeMap(nodes)
  const steps: TreeAnalysisStep[] = []
  const tokens: string[] = []

  function append(token: string, nodeId: string, pathNodeIds: string[], value?: number) {
    tokens.push(token)
    steps.push({
      type: 'append',
      nodeId,
      token,
      value,
      serialized: tokens.join(','),
      message: `Appended ${token}: ${tokens.join(',')}`,
      pathNodeIds,
    })
  }

  function walk(nodeId: string | null, parentId: string, path: string[]) {
    if (!nodeId) {
      append('null', parentId || rootId, path)
      return
    }
    const node = byId.get(nodeId)
    if (!node) {
      append('null', parentId || rootId, path)
      return
    }
    const nextPath = [...path, node.id]
    append(String(node.value), node.id, nextPath, node.value)
    walk(node.left, node.id, nextPath)
    walk(node.right, node.id, nextPath)
  }

  walk(rootId || null, '', [])
  const serialized = tokens.join(',')
  steps.push({
    type: 'serialize',
    nodeId: rootId,
    serialized,
    message: `Serialization complete: ${serialized}`,
    pathNodeIds: [],
  })
  return steps
}

export function deserializeTree(serialized: string): TreeAnalysisStep[] {
  const tokens = serialized.split(',').map((token) => token.trim())
  const nodes: TreeNode[] = []
  const steps: TreeAnalysisStep[] = []
  let tokenIndex = 0
  let rootId = ''
  let invalidToken: string | undefined

  function parse(parentId: string | null, side: 'left' | 'right' | null, path: string[]): string | null {
    if (tokenIndex >= tokens.length) {
      invalidToken = 'missing token'
      return null
    }
    const currentIndex = tokenIndex
    const token = tokens[tokenIndex++]
    if (token === 'null') {
      steps.push({
        type: 'parse',
        nodeId: parentId ?? rootId,
        token,
        message: `Parsed null at token ${currentIndex + 1}.`,
        pathNodeIds: [...path],
        nodesAfter: nodes.map((node) => ({ ...node })),
        rootId,
      })
      return null
    }

    const value = Number(token)
    if (!Number.isFinite(value)) {
      invalidToken = token
      steps.push({
        type: 'not-found',
        nodeId: parentId ?? rootId,
        token,
        message: `Invalid tree token: ${token}.`,
        pathNodeIds: [...path],
        nodesAfter: nodes.map((node) => ({ ...node })),
        rootId,
      })
      return null
    }

    const id = `decoded-${currentIndex}-${value}`
    const node: TreeNode = { id, value, left: null, right: null, color: 'black' }
    nodes.push(node)
    if (!parentId) rootId = id
    else {
      const parent = nodes.find((item) => item.id === parentId)
      if (parent && side) parent[side] = id
    }
    const nextPath = [...path, id]
    steps.push({
      type: 'parse',
      nodeId: id,
      token,
      value,
      message: `Created node ${value} from token ${currentIndex + 1}.`,
      pathNodeIds: nextPath,
      nodesAfter: nodes.map((item) => ({ ...item })),
      rootId,
    })
    node.left = parse(node.id, 'left', nextPath)
    node.right = parse(node.id, 'right', nextPath)
    return id
  }

  parse(null, null, [])
  if (invalidToken) {
    steps.push({
      type: 'not-found',
      nodeId: rootId,
      token: invalidToken,
      message: `Could not deserialize tree: ${invalidToken}.`,
      pathNodeIds: [],
      nodesAfter: nodes.map((node) => ({ ...node })),
      rootId,
    })
    return steps
  }

  steps.push({
    type: 'found',
    nodeId: rootId,
    message: `Deserialized ${nodes.length} nodes.`,
    pathNodeIds: [],
    nodesAfter: nodes.map((node) => ({ ...node })),
    rootId,
  })
  return steps
}