import Link from 'next/link'
import { notFound } from 'next/navigation'
import { QuizEngine } from '@/components/quiz/QuizEngine'
import { quizCategories } from '@/lib/data/quizzes'

export function generateStaticParams() {
  return quizCategories.map((category) => ({ category: category.slug }))
}

export default function QuizCategoryPage({ params }: { params: { category: string } }) {
  const category = quizCategories.find((entry) => entry.slug === params.category)
  if (!category) notFound()

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-14">
      <Link href="/visualizer/quiz" className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400">← All quizzes</Link>
      <header className="mt-8 mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">{category.name} quiz</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Check your understanding.</h1>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">{category.description}</p>
      </header>
      <QuizEngine key={category.slug} questions={category.questions} />
    </div>
  )
}