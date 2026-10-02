import assert from 'node:assert/strict'
import test from 'node:test'
import { rbInsert, type RBStep } from './redBlackTree'
import type { TreeNode } from './treeTypes'

function insertSequence(values: number[]) {
  let nodes: TreeNode[] = []
  let rootId: string | null = null
  const allSteps: RBStep[] = []
  for (const value of values) {
    const steps = rbInsert(nodes, rootId, value)
    allSteps.push(...steps)
    const finalTree = steps.at(-1)?.treeAfter ?? nodes
    nodes = finalTree
    rootId = nodes.find((node) => !nodes.some((candidate) => candidate.left === node.id || candidate.right === node.id))?.id ?? null
  }
  return { nodes, allSteps }
}

function assertRedBlackProperties(nodes: TreeNode[], rootId: string) {
  const byId = new Map(nodes.map((node) => [node.id, node]))
  assert.equal(byId.get(rootId)?.color, 'black')
  for (const node of nodes) {
    if (node.color === 'red') {
      assert.notEqual(node.left ? byId.get(node.left)?.color : 'black', 'red')
      assert.notEqual(node.right ? byId.get(node.right)?.color : 'black', 'red')
    }
  }
}

test('every insert leaves the root black and avoids consecutive red nodes', () => {
  let nodes: TreeNode[] = []
  let rootId: string | null = null
  for (const value of [10, 20, 30, 15, 25, 5, 1, 7]) {
    const steps = rbInsert(nodes, rootId, value)
    nodes = steps.at(-1)?.treeAfter ?? nodes
    rootId = nodes.find((node) => !nodes.some((candidate) => candidate.left === node.id || candidate.right === node.id))?.id ?? null
    assert.ok(rootId)
    assertRedBlackProperties(nodes, rootId)
  }
})

test('inserting 10, 20, 30 recolors then rotates left', () => {
  const { allSteps } = insertSequence([10, 20, 30])
  const finalSteps = allSteps.slice(allSteps.findIndex((step) => step.type === 'insert' && step.treeAfter.some((node) => node.value === 30)))
  assert.deepEqual(finalSteps.filter((step) => step.type === 'rotate').map((step) => step.rotationType), ['left'])
  assert.ok(finalSteps.some((step) => step.type === 'recolor' && step.colorChanges?.some((change) => change.nodeId.includes('10'))))
})