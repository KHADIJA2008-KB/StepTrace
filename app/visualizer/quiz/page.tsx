import Link from 'next/link'
import { quizCategories } from '@/lib/data/quizzes'

export default function QuizIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-16">
      <Link href="/visualizer" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All visualizers</Link>
      <header className="mt-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">Knowledge check</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">Pick a topic to quiz.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">Test your understanding of the algorithms and data structures in the learning lab.</p>
      </header>

      <section className="mt-12" aria-labelledby="quiz-categories-heading">
        <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-slate-800">
          <h2 id="quiz-categories-heading" className="text-2xl font-bold text-slate-900 dark:text-white">Quiz categories</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">Choose a category to begin a short set of questions with immediate explanations.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quizCategories.map((category, index) => (
            <Link key={category.slug} href={`/visualizer/quiz/${category.slug}`} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-teal-700 dark:hover:shadow-black/20">
              <div className="h-1.5 w-10 rounded-full bg-teal-500" />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
                <span aria-hidden="true" className="mt-4 text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-500">→</span>
              </div>
              <p className="mt-5 border-t border-slate-100 pt-3 text-xs font-semibold text-teal-700 dark:border-slate-900 dark:text-teal-400">{category.questions.length} questions</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}