import assert from 'node:assert/strict'
import test from 'node:test'
import {
  inorderTraversal,
  levelOrderTraversal,
  morrisInorderTraversal,
  postorderTraversal,
  preorderTraversal,
} from './traversals'
import type { TreeNode } from './treeTypes'

const sampleTree: TreeNode[] = [
  { id: 'a', value: 4, left: 'b', right: 'c', color: 'black' },
  { id: 'b', value: 2, left: 'd', right: 'e', color: 'black' },
  { id: 'c', value: 6, left: 'f', right: 'g', color: 'black' },
  { id: 'd', value: 1, left: null, right: null, color: 'black' },
  { id: 'e', value: 3, left: null, right: null, color: 'black' },
  { id: 'f', value: 5, left: null, right: null, color: 'black' },
  { id: 'g', value: 7, left: null, right: null, color: 'black' },
]

function visitOrder(steps: ReturnType<typeof preorderTraversal>) {
  return steps.filter((step) => step.type === 'visit').map((step) => step.nodeId)
}

test('preorder traversal visits root, left subtree, then right subtree', () => {
  assert.deepEqual(visitOrder(preorderTraversal(sampleTree, 'a')), ['a', 'b', 'd', 'e', 'c', 'f', 'g'])
})

test('inorder traversal visits left subtree, root, then right subtree', () => {
  assert.deepEqual(visitOrder(inorderTraversal(sampleTree, 'a')), ['d', 'b', 'e', 'a', 'f', 'c', 'g'])
})

test('postorder traversal visits children before their parent', () => {
  assert.deepEqual(visitOrder(postorderTraversal(sampleTree, 'a')), ['d', 'e', 'b', 'f', 'g', 'c', 'a'])
})

test('level-order traversal visits nodes one level at a time', () => {
  assert.deepEqual(visitOrder(levelOrderTraversal(sampleTree, 'a')), ['a', 'b', 'c', 'd', 'e', 'f', 'g'])
})

test('Morris inorder traversal matches recursive inorder traversal', () => {
  const steps = morrisInorderTraversal(sampleTree, 'a')
  assert.deepEqual(visitOrder(steps), ['d', 'b', 'e', 'a', 'f', 'c', 'g'])
  assert.equal(steps.at(-1)?.type, 'done')
})