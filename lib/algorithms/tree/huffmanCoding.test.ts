import assert from 'node:assert/strict'
import test from 'node:test'
import { huffmanEncode } from './huffmanCoding'

test('Huffman steps count frequencies, merge lowest priorities, and encode the input', () => {
  const text = 'abbccc'
  const steps = huffmanEncode(text)
  const result = steps.at(-1)
  const codes = result?.codes ?? {}
  const decoded = Array.from(text, (character) => codes[character]).join('')
  const codeValues = Object.values(codes)

  assert.equal(steps.filter((step) => step.type === 'frequency').length, 3)
  assert.ok(steps.some((step) => step.type === 'merge'))
  assert.deepEqual(result?.frequencies, [
    { character: 'a', frequency: 1 },
    { character: 'b', frequency: 2 },
    { character: 'c', frequency: 3 },
  ])
  assert.equal(result?.encoded, decoded)
  assert.equal(codeValues.some((code, index) => codeValues.some((other, otherIndex) => index !== otherIndex && other.startsWith(code))), false)
  assert.ok(result?.treeNodes.some((node) => node.id === result.rootId && node.value === text.length))
})

test('Huffman coding handles a single distinct character', () => {
  const result = huffmanEncode('xxxxx').at(-1)
  assert.equal(result?.codes?.x, '0')
  assert.equal(result?.encoded, '00000')
})