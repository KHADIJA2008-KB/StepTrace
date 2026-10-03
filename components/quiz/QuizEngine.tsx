'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/lib/data/quizzes/quizTypes'

type QuizEngineProps = {
  questions: QuizQuestion[]
}

export function QuizEngine({ questions }: QuizEngineProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [complete, setComplete] = useState(false)
  const question = questions[questionIndex]

  function answer(index: number) {
    if (selectedAnswer !== null || complete) return
    setSelectedAnswer(index)
    if (index === question.correctIndex) setScore((currentScore) => currentScore + 1)
  }

  function advance() {
    if (selectedAnswer === null) return
    if (questionIndex === questions.length - 1) {
      setComplete(true)
      return
    }
    setQuestionIndex((currentIndex) => currentIndex + 1)
    setSelectedAnswer(null)
  }

  function retry() {
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setComplete(false)
  }

  if (questions.length === 0) {
    return <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">No quiz questions available.</p>
  }

  if (complete) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950" aria-labelledby="quiz-summary-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">Quiz complete</p>
        <h2 id="quiz-summary-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Your score: {score} / {questions.length}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{percentage}% correct</p>
        <button type="button" onClick={retry} className="mt-6 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Retry</button>
      </section>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-slate-800 dark:bg-slate-950" aria-labelledby="quiz-question-heading">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Question {questionIndex + 1} of {questions.length}</p>
        <p className="text-xs font-semibold tabular-nums text-teal-700 dark:text-teal-400">Score {score}</p>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        role="progressbar"
        aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={questionIndex + 1}
        aria-valuetext={`Question ${questionIndex + 1} of ${questions.length}`}
      >
        <div className="h-full rounded-full bg-teal-500 transition-[width]" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
      </div>

      <h2 id="quiz-question-heading" className="mt-6 text-xl font-semibold leading-7 text-slate-900 dark:text-white">{question.question}</h2>

      <fieldset className="mt-5 space-y-2" disabled={selectedAnswer !== null}>
        <legend className="sr-only">Answer options</legend>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = index === question.correctIndex
          const answerClass = selectedAnswer === null
            ? 'border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 dark:border-slate-800 dark:hover:bg-teal-950/30'
            : isCorrect
              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200'
              : isSelected
                ? 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-200'
                : 'border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400'
          return (
            <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition ${answerClass} ${selectedAnswer !== null ? 'cursor-default' : ''}`}>
              <input type="radio" name={`quiz-${question.id}`} value={index} checked={isSelected} onChange={() => answer(index)} className="mt-0.5 size-4 accent-teal-600" />
              <span>{option}</span>
            </label>
          )
        })}
      </fieldset>

      {selectedAnswer !== null && (
        <div className={`mt-5 rounded-lg border p-4 ${selectedAnswer === question.correctIndex ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40' : 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40'}`} role="status" aria-live="polite">
          <p className={`text-sm font-semibold ${selectedAnswer === question.correctIndex ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
            {selectedAnswer === question.correctIndex ? 'Correct' : 'Not quite'}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{question.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button type="button" onClick={advance} disabled={selectedAnswer === null} className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:opacity-40">
          {questionIndex === questions.length - 1 ? 'See results' : 'Next question'}
        </button>
      </div>
    </section>
  )
}