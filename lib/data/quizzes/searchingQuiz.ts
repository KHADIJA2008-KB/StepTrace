import type { QuizQuestion } from './quizTypes'

export const searchingQuiz: QuizQuestion[] = [
  {
    id: 'search-linear-worst',
    question: 'What is Linear Search’s worst-case time complexity for n items?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'If the target is last or absent, Linear Search checks every item.',
  },
  {
    id: 'search-linear-best',
    question: 'When does Linear Search take O(1) time?',
    options: ['The target is the first item', 'The target is absent', 'The array is sorted', 'The array has even length'],
    correctIndex: 0,
    explanation: 'The first comparison succeeds immediately when the target is at the start.',
  },
  {
    id: 'search-binary-prerequisite',
    question: 'What must be true before applying Binary Search?',
    options: ['The list must be linked', 'The values must be sorted', 'The list length must be a power of two', 'All values must be unique'],
    correctIndex: 1,
    explanation: 'Binary Search uses ordering to discard half of the remaining range at each step.',
  },
  {
    id: 'search-binary-time',
    question: 'What is Binary Search’s worst-case time complexity?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctIndex: 1,
    explanation: 'Each comparison halves the remaining search interval, producing logarithmic time.',
  },
  {
    id: 'search-binary-progress',
    question: 'If a sorted search range has 64 items, how many halvings reduce it to one candidate?',
    options: ['6', '8', '32', '64'],
    correctIndex: 0,
    explanation: 'Since 64 is 2^6, six halvings reduce the range to one item.',
  },
]