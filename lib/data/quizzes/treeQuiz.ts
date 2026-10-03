import type { QuizQuestion } from './quizTypes'

export const treeQuiz: QuizQuestion[] = [
  {
    id: 'tree-bst-worst',
    question: 'What is the worst-case search time in an unbalanced Binary Search Tree?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'An unbalanced BST can become a chain, making search proportional to the number of nodes.',
  },
  {
    id: 'tree-avl-balance',
    question: 'What balance-factor range does an AVL node allow after rebalancing?',
    options: ['Only 0', 'From -1 through 1', 'From -2 through 2', 'Any integer'],
    correctIndex: 1,
    explanation: 'AVL rotations restore every node to a balance factor of -1, 0, or 1.',
  },
  {
    id: 'tree-red-black-new',
    question: 'In a Red-Black tree, what color is assigned to a newly inserted leaf before fix-up?',
    options: ['Red', 'Black', 'Alternating red and black', 'The parent color'],
    correctIndex: 0,
    explanation: 'A new node is inserted red; recoloring and rotations then restore the Red-Black invariants.',
  },
  {
    id: 'tree-inorder',
    question: 'What does an inorder traversal of a valid Binary Search Tree produce?',
    options: ['Values in sorted order', 'Values in reverse insertion order', 'Only leaf values', 'The tree height'],
    correctIndex: 0,
    explanation: 'Inorder visits left subtree, node, then right subtree, which yields ascending BST values. Morris inorder achieves O(1) auxiliary space.',
  },
  {
    id: 'tree-trie-prefix',
    question: 'When does trie prefix search succeed?',
    options: ['Only when the prefix ends a stored word', 'When the path for every prefix character exists', 'Only for a one-character prefix', 'When the trie is balanced'],
    correctIndex: 1,
    explanation: 'A prefix can exist without being a complete word; the full-word search also checks the end-of-word marker.',
  },
  {
    id: 'tree-segment-range',
    question: 'What is the typical time for a segment-tree range query or point update?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctIndex: 1,
    explanation: 'The tree height is logarithmic, so a range query or point update visits O(log n) nodes.',
  },
  {
    id: 'tree-fenwick',
    question: 'What is the time complexity of a Fenwick tree prefix-sum query?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'The query follows indices obtained by subtracting the lowest set bit, taking O(log n) steps. Tree diameter, LCA, isomorphism, and serialization in this project use O(n) traversals.',
  },
  {
    id: 'tree-heap-huffman',
    question: 'What is Heap Sort’s worst-case time complexity?',
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    correctIndex: 2,
    explanation: 'Heap construction is O(n), followed by n extractions that each restore the heap in O(log n). Huffman coding repeatedly combines the two lowest-frequency nodes.',
  },
]