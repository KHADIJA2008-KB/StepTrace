import type { QuizQuestion } from './quizTypes'

export const stackQuiz: QuizQuestion[] = [
  {
    id: 'stack-order',
    question: 'Which rule describes a stack?',
    options: ['FIFO: first in, first out', 'LIFO: last in, first out', 'Smallest value out first', 'Random removal'],
    correctIndex: 1,
    explanation: 'A stack removes the most recently pushed item first.',
  },
  {
    id: 'stack-push',
    question: 'Where is a value added by push in the array stack?',
    options: ['At the top/end', 'At the bottom only', 'At the middle', 'At a random index'],
    correctIndex: 0,
    explanation: 'The end of the array represents the stack top in this visualizer.',
  },
  {
    id: 'stack-postfix',
    question: 'In postfix evaluation, when is an operator applied?',
    options: ['Before reading its operands', 'After popping its operands from the stack', 'Only after all operators are read', 'When the stack is empty'],
    correctIndex: 1,
    explanation: 'Operands are pushed as they are read; an operator pops two operands, computes, and pushes the result.',
  },
  {
    id: 'stack-prefix',
    question: 'In the prefix evaluator, in which direction are tokens scanned?',
    options: ['Left to right', 'Right to left', 'Alternating from both ends', 'In sorted order'],
    correctIndex: 1,
    explanation: 'Prefix evaluation scans from right to left so operands are available before their operator.',
  },
  {
    id: 'stack-expression-result',
    question: 'How many values should remain on the stack after a valid expression is evaluated?',
    options: ['Zero', 'One', 'Two', 'One per operator'],
    correctIndex: 1,
    explanation: 'A valid expression reduces to exactly one final result.',
  },
  {
    id: 'stack-linked-list',
    question: 'Where can a linked-list stack perform both push and pop in O(1) time?',
    options: ['At the head', 'At the tail after a full scan', 'At the middle', 'Only after sorting'],
    correctIndex: 0,
    explanation: 'Using the head as the top lets push and pop update a constant number of links.',
  },
]