import assert from 'node:assert/strict'
import test from 'node:test'
import { graphQuiz } from './graphQuiz'
import { linkedListQuiz } from './linkedListQuiz'
import { queueQuiz } from './queueQuiz'
import { searchingQuiz } from './searchingQuiz'
import { sortingQuiz } from './sortingQuiz'
import { stackQuiz } from './stackQuiz'
import { treeQuiz } from './treeQuiz'
import type { QuizQuestion } from './quizTypes'

const quizBanks: Array<{ category: string; questions: QuizQuestion[] }> = [
  { category: 'sorting', questions: sortingQuiz },
  { category: 'searching', questions: searchingQuiz },
  { category: 'stack', questions: stackQuiz },
  { category: 'queue', questions: queueQuiz },
  { category: 'linked list', questions: linkedListQuiz },
  { category: 'tree', questions: treeQuiz },
  { category: 'graph', questions: graphQuiz },
]

test('each category quiz has 5-8 well-formed questions', () => {
  for (const { category, questions } of quizBanks) {
    assert.ok(questions.length >= 5 && questions.length <= 8, `${category} quiz should have 5-8 questions`)
    assert.equal(new Set(questions.map((question) => question.id)).size, questions.length, `${category} question IDs should be unique`)

    for (const question of questions) {
      assert.ok(question.question.trim(), `${question.id} should have a prompt`)
      assert.ok(question.options.length >= 2, `${question.id} should have answer options`)
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${question.id} should point to a valid answer`)
      assert.ok(question.explanation.trim(), `${question.id} should have an explanation`)
    }
  }
})