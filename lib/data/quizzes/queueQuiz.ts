import type { QuizQuestion } from './quizTypes'

export const queueQuiz: QuizQuestion[] = [
  {
    id: 'queue-order',
    question: 'Which rule describes a standard queue?',
    options: ['LIFO', 'FIFO', 'Largest first', 'Last priority first'],
    correctIndex: 1,
    explanation: 'A standard queue removes items in the order they were enqueued.',
  },
  {
    id: 'queue-circular-wrap',
    question: 'How does a circular queue wrap its rear index at the end of the buffer?',
    options: ['Set it to -1', 'Use (rear + 1) modulo capacity', 'Double the buffer every time', 'Move the front backward'],
    correctIndex: 1,
    explanation: 'Modulo capacity maps the next index back to the start of the fixed-size buffer.',
  },
  {
    id: 'queue-deque',
    question: 'What operation is a deque designed to support?',
    options: ['Insert and remove at both ends', 'Remove only the largest item', 'Search only from the front', 'Sort values on every read'],
    correctIndex: 0,
    explanation: 'Deque means double-ended queue: both front and back support insertion and removal.',
  },
  {
    id: 'queue-priority',
    question: 'In the project’s priority queue, which item is dequeued first?',
    options: ['The newest item', 'The smallest value', 'The item with the highest priority', 'The item with the lowest priority'],
    correctIndex: 2,
    explanation: 'Items are ordered by descending priority, so the highest-priority item is at the front.',
  },
  {
    id: 'queue-linked-complexity',
    question: 'With head and tail references, what is the time for enqueue and dequeue in a linked-list queue?',
    options: ['O(1) each', 'O(log n) each', 'O(n) each', 'O(n^2) each'],
    correctIndex: 0,
    explanation: 'A tail reference supports enqueue and a head reference supports dequeue without scanning.',
  },
  {
    id: 'queue-underflow',
    question: 'What should dequeue report when a queue is empty?',
    options: ['Overflow', 'Underflow or empty state', 'A sorted result', 'A wrapped index'],
    correctIndex: 1,
    explanation: 'Removing an item from an empty queue is an empty/underflow condition.',
  },
]