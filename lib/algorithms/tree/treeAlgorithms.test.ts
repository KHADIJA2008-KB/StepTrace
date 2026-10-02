import assert from 'node:assert/strict'
import test from 'node:test'
import { checkIsomorphic, deserializeTree, lowestCommonAncestor, serializeTree, treeDiameter } from './treeAlgorithms'
import type { TreeNode } from './treeTypes'

const sampleTree: TreeNode[] = [
  { id: 'n10', value: 10, left: 'n5', right: 'n15', color: 'black' },
  { id: 'n5', value: 5, left: 'n3', right: 'n7', color: 'black' },
  { id: 'n15', value: 15, left: 'n12', right: 'n20', color: 'black' },
  { id: 'n3', value: 3, left: 'n1', right: 'n4', color: 'black' },
  { id: 'n7', value: 7, left: null, right: null, color: 'black' },
  { id: 'n12', value: 12, left: null, right: null, color: 'black' },
  { id: 'n20', value: 20, left: null, right: null, color: 'black' },
  { id: 'n1', value: 1, left: null, right: null, color: 'black' },
  { id: 'n4', value: 4, left: null, right: null, color: 'black' },
]

test('lowest common ancestor finds ancestors within and across subtrees', () => {
  assert.equal(lowestCommonAncestor(sampleTree, 'n10', 1, 4).at(-1)?.value, 3)
  assert.equal(lowestCommonAncestor(sampleTree, 'n10', 3, 7).at(-1)?.value, 5)
  assert.equal(lowestCommonAncestor(sampleTree, 'n10', 4, 12).at(-1)?.value, 10)
})

test('lowest common ancestor reports a missing value', () => {
  assert.equal(lowestCommonAncestor(sampleTree, 'n10', 4, 99).at(-1)?.type, 'not-found')
})

test('tree diameter reports the correct edge length and end-to-end path', () => {
  const steps = treeDiameter(sampleTree, 'n10')
  const result = steps.at(-1)
  assert.equal(result?.type, 'diameter')
  assert.equal(result?.diameter, 5)
  assert.deepEqual(result?.pathNodeIds, ['n1', 'n3', 'n5', 'n10', 'n15', 'n12'])
})

test('isomorphism compares structure in parallel and reports the first mismatch', () => {
  const simpleTree: TreeNode[] = [
    { id: 'r', value: 10, left: 'l', right: 'r-child', color: 'black' },
    { id: 'l', value: 5, left: null, right: null, color: 'black' },
    { id: 'r-child', value: 15, left: null, right: null, color: 'black' },
  ]
  const structurallyMatching: TreeNode[] = [
    { id: 'a', value: 100, left: 'b', right: 'c', color: 'black' },
    { id: 'b', value: 200, left: null, right: null, color: 'black' },
    { id: 'c', value: 300, left: null, right: null, color: 'black' },
  ]
  const matchingSteps = checkIsomorphic(simpleTree, 'r', structurallyMatching, 'a')
  assert.equal(matchingSteps.at(-1)?.type, 'found')
  assert.equal(matchingSteps.filter((step) => step.type === 'match').length, 3)

  const mismatch = checkIsomorphic(simpleTree, 'r', structurallyMatching.slice(0, 2), 'a')
  assert.equal(mismatch.find((step) => step.type === 'mismatch')?.nodeId, 'r-child')
  assert.equal(mismatch.at(-1)?.type, 'not-found')
})

test('preorder serialization appends null markers and deserialization rebuilds the tree', () => {
  const smallTree: TreeNode[] = [
    { id: 's-root', value: 10, left: 's-left', right: 's-right', color: 'black' },
    { id: 's-left', value: 5, left: null, right: null, color: 'black' },
    { id: 's-right', value: 15, left: null, right: null, color: 'black' },
  ]
  const serializedSteps = serializeTree(smallTree, 's-root')
  const serialized = serializedSteps.at(-1)?.serialized
  assert.equal(serialized, '10,5,null,null,15,null,null')
  assert.equal(serializedSteps.at(-2)?.serialized, serialized)

  const rebuiltSteps = deserializeTree(serialized ?? '')
  const rebuiltNodes = rebuiltSteps.at(-1)?.nodesAfter ?? []
  const rebuiltRoot = rebuiltSteps.at(-1)?.rootId ?? ''
  assert.equal(rebuiltSteps.at(-1)?.type, 'found')
  assert.equal(serializeTree(rebuiltNodes, rebuiltRoot).at(-1)?.serialized, serialized)
  assert.ok(rebuiltSteps.some((step) => step.type === 'parse' && (step.nodesAfter?.length ?? 0) > 1))
})