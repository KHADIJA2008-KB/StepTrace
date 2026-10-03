import type { QuizQuestion } from './quizTypes'

export const sortingQuiz: QuizQuestion[] = [
  {
    id: 'sorting-bubble-worst',
    question: "What's the worst-case time complexity of Bubble Sort?",
    options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'In the worst case, Bubble Sort makes a quadratic number of adjacent comparisons and swaps.',
  },
  {
    id: 'sorting-bubble-best',
    question: 'Why can this Bubble Sort finish in O(n) time on already sorted input?',
    options: ['It uses a pivot', 'It exits after a pass with no swaps', 'It divides the array in half', 'It builds a heap'],
    correctIndex: 1,
    explanation: 'The implementation tracks whether a pass swapped anything and stops early when the array is already ordered.',
  },
  {
    id: 'sorting-merge-space',
    question: 'What auxiliary space does Merge Sort typically need for an array of n values?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctIndex: 2,
    explanation: 'Merging uses temporary storage proportional to the number of input values.',
  },
  {
    id: 'sorting-quick-worst',
    question: 'What is Quick Sort’s worst-case time complexity when partitions are consistently unbalanced?',
    options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n^2)'],
    correctIndex: 3,
    explanation: 'Repeatedly splitting off a tiny partition can require quadratic work overall.',
  },
  {
    id: 'sorting-insertion-best',
    question: 'Which input gives Insertion Sort its best-case O(n) time?',
    options: ['Already sorted values', 'Reverse-sorted values', 'All values are distinct primes', 'A random permutation only'],
    correctIndex: 0,
    explanation: 'When values are already ordered, each insertion needs only one comparison and no shifting.',
  },
  {
    id: 'sorting-selection',
    question: 'How many times does Selection Sort scan the unsorted suffix, regardless of input order?',
    options: ['Once total', 'About n times', 'About n^2 times', 'Only when values are reversed'],
    correctIndex: 1,
    explanation: 'It performs one linear minimum search for each position, for a total of O(n^2) comparisons.',
  },
]