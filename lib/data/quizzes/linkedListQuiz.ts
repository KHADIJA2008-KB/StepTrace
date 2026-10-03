import type { QuizQuestion } from './quizTypes'

export const linkedListQuiz: QuizQuestion[] = [
  {
    id: 'list-singly-link',
    question: 'Which link does each node in a singly linked list store?',
    options: ['A next link only', 'A next and previous link', 'A parent and two children', 'An index into a matrix'],
    correctIndex: 0,
    explanation: 'A singly linked node points forward to its successor.',
  },
  {
    id: 'list-doubly-links',
    question: 'What extra link does a doubly linked node have?',
    options: ['A root link', 'A previous link', 'A priority link', 'A color link'],
    correctIndex: 1,
    explanation: 'Doubly linked nodes store both next and previous references.',
  },
  {
    id: 'list-circular-tail',
    question: 'In a circular singly linked list, where does the tail point?',
    options: ['To null', 'Back to the head', 'To the middle node', 'To itself in every list'],
    correctIndex: 1,
    explanation: 'The tail-to-head link closes the cycle in a non-empty circular list.',
  },
  {
    id: 'list-head-insert',
    question: 'What is the standard time complexity of inserting at the head of a linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 0,
    explanation: 'Only the new node and head link need to be updated.',
  },
  {
    id: 'list-search',
    question: 'What is the worst-case time complexity of searching an unsorted linked list?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctIndex: 2,
    explanation: 'The target may be at the tail or absent, requiring a scan of every node.',
  },
  {
    id: 'list-merge',
    question: 'How does merging two sorted lists choose the next output node?',
    options: ['Compare the two current heads', 'Choose a random node', 'Reverse both lists first', 'Choose the longer list'],
    correctIndex: 0,
    explanation: 'Repeatedly appending the smaller current head produces a sorted result in O(m + n) time.',
  },
]