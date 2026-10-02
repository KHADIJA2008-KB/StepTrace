import assert from 'node:assert/strict'
import test from 'node:test'
import { trieInsert, trieSearch, trieStartsWith, type TrieNode, type TrieStep } from './trie'

function applyInsert(nodes: TrieNode[], word: string) {
  const steps = trieInsert(nodes, 'root', word)
  return steps.at(-1)?.nodesAfter ?? nodes
}

function types(steps: TrieStep[]) {
  return steps.map((step) => step.type)
}

test('inserting overlapping words reuses existing trie characters', () => {
  const afterCat = applyInsert([], 'cat')
  const carSteps = trieInsert(afterCat, 'root', 'car')
  const finalNodes = carSteps.at(-1)?.nodesAfter ?? afterCat

  assert.deepEqual(types(carSteps), ['visit', 'visit', 'insert'])
  assert.equal(finalNodes.filter((node) => node.char === 'a').length, 1)
  assert.equal(finalNodes.find((node) => node.id === 'root-c-a-t')?.isEndOfWord, true)
  assert.equal(finalNodes.find((node) => node.id === 'root-c-a-r')?.isEndOfWord, true)
})

test('search distinguishes a complete word from its prefix', () => {
  const nodes = applyInsert(applyInsert([], 'cat'), 'car')

  assert.equal(trieSearch(nodes, 'root', 'ca').at(-1)?.type, 'not-found')
  assert.equal(trieSearch(nodes, 'root', 'cat').at(-1)?.type, 'found')
  assert.equal(trieStartsWith(nodes, 'root', 'ca').at(-1)?.type, 'found')
})

test('search reports a missing word and missing prefix', () => {
  const nodes = applyInsert([], 'cat')

  assert.equal(trieSearch(nodes, 'root', 'cap').at(-1)?.type, 'not-found')
  assert.equal(trieStartsWith(nodes, 'root', 'do').at(-1)?.type, 'not-found')
})