import { graphQuiz } from './graphQuiz'
import { linkedListQuiz } from './linkedListQuiz'
import { queueQuiz } from './queueQuiz'
import { searchingQuiz } from './searchingQuiz'
import { sortingQuiz } from './sortingQuiz'
import { stackQuiz } from './stackQuiz'
import { treeQuiz } from './treeQuiz'
import type { QuizQuestion } from './quizTypes'

export type QuizCategory = {
  slug: string
  name: string
  description: string
  questions: QuizQuestion[]
}

export const quizCategories: QuizCategory[] = [
  { slug: 'sorting', name: 'Sorting', description: 'Compare classic sorting strategies, their tradeoffs, and how input order affects their work.', questions: sortingQuiz },
  { slug: 'searching', name: 'Searching', description: 'Test when to scan a sequence and when sorted data makes halving the search space possible.', questions: searchingQuiz },
  { slug: 'stack', name: 'Stack', description: 'Review LIFO behavior and evaluate prefix and postfix expressions.', questions: stackQuiz },
  { slug: 'queue', name: 'Queue', description: 'Explore FIFO queues, circular buffers, deques, and priority ordering.', questions: queueQuiz },
  { slug: 'linked-list', name: 'Linked List', description: 'Check node links, circular structures, traversal, and common list operations.', questions: linkedListQuiz },
  { slug: 'tree', name: 'Tree', description: 'Review search trees, balancing, traversals, range structures, and tree algorithms.', questions: treeQuiz },
  { slug: 'graph', name: 'Graph', description: 'Test graph representations, traversal, shortest paths, spanning trees, and ordering.', questions: graphQuiz },
]