'use client'

import { useState } from 'react'

const questions = [
  {
    question: 'What is this tool?',
    answer: 'It is an interactive way to explore data structures and algorithms. Instead of only reading pseudocode, you can watch each step change the structure or data in front of you.',
  },
  {
    question: 'Is it good for beginners?',
    answer: 'That is who I had in mind. Start with familiar structures like stacks and queues, then move into trees and graph algorithms at your own pace.',
  },
  {
    question: 'Can I use it for interview prep?',
    answer: 'Yes. It is useful for building intuition around traversal, sorting, shortest paths, and complexity. Pair it with coding practice for writing solutions under interview conditions.',
  },
  {
    question: 'Will more topics be added?',
    answer: 'I am building this solo and plan to keep expanding it. The current collection covers sorting, searching, stacks, queues, linked lists, trees, and graphs.',
  },
  {
    question: 'Is it free?',
    answer: 'Yes. You can use the visualizers and quizzes without creating an account or paying.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="border-t border-[#203b30] bg-[#081510] px-6 py-16 text-[#f1f5eb] sm:px-10 sm:py-20" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9bb99b]">A few quick answers</p>
          <h2 id="faq-heading" className="mt-3 !text-2xl !font-semibold !tracking-tight !text-[#f1f5eb] sm:!text-3xl">Frequently asked questions</h2>
        </div>

        <div className="divide-y divide-[#29443a] border-y border-[#29443a]">
          {questions.map((item, index) => {
            const isOpen = openIndex === index
            const triggerId = `faq-question-${index}`
            const panelId = `faq-answer-${index}`
            return (
              <div key={item.question} className="py-1">
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-5 py-4 text-left text-sm font-semibold text-[#e4ede2] transition hover:text-lime-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 sm:text-base"
                  >
                    {item.question}
                    <span aria-hidden="true" className={`grid size-7 shrink-0 place-items-center rounded-full border border-[#365447] text-sm text-[#a8c2b0] transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-2xl pb-5 pr-10 text-sm leading-6 text-[#9bb0a3]">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}