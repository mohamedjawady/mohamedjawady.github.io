"use client"

import { useState } from "react"
import { Check, X, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface TIDQuizProps {
  title: string
  questions: QuizQuestion[]
}

export function TIDQuiz({ title, questions }: TIDQuizProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = answers.every((a) => a !== null)
  const score = answers.reduce<number>((acc, a, i) => acc + (a === questions[i].correctIndex ? 1 : 0), 0)

  const select = (qIndex: number, optIndex: number) => {
    if (submitted) return
    setAnswers((prev) => {
      const next = [...prev]
      next[qIndex] = optIndex
      return next
    })
  }

  const reset = () => {
    setAnswers(Array(questions.length).fill(null))
    setSubmitted(false)
  }

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/40 border-b border-border px-4 py-2.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Check Your Understanding</span>
            <div className="text-sm font-medium mt-0.5">{title}</div>
          </div>
          {submitted && (
            <div
              className={cn(
                "text-sm font-mono font-semibold px-2.5 py-1 rounded-md border",
                score === questions.length
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
              )}
            >
              {score} / {questions.length}
            </div>
          )}
        </div>

        <div className="divide-y divide-border/60">
          {questions.map((q, qi) => {
            const selected = answers[qi]
            const isCorrect = submitted && selected === q.correctIndex
            const isWrong = submitted && selected !== null && selected !== q.correctIndex

            return (
              <div key={qi} className="px-4 py-4">
                <div className="text-sm font-medium mb-3">
                  {qi + 1}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selected === oi
                    const showCorrect = submitted && oi === q.correctIndex
                    const showWrongSelected = submitted && isSelected && oi !== q.correctIndex

                    return (
                      <button
                        key={oi}
                        onClick={() => select(qi, oi)}
                        disabled={submitted}
                        className={cn(
                          "w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-md border text-sm transition-colors",
                          !submitted && isSelected && "border-emerald-500/60 bg-emerald-500/10",
                          !submitted && !isSelected && "border-border hover:border-emerald-500/30",
                          showCorrect && "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                          showWrongSelected && "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
                          submitted && !isSelected && oi !== q.correctIndex && "opacity-50",
                        )}
                      >
                        <span
                          className={cn(
                            "shrink-0 w-4 h-4 rounded-full border flex items-center justify-center",
                            isSelected || showCorrect ? "border-current" : "border-muted-foreground/40",
                          )}
                        >
                          {showCorrect && <Check className="w-3 h-3" />}
                          {showWrongSelected && <X className="w-3 h-3" />}
                        </span>
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {(isCorrect || isWrong) && (
                  <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed border-l-2 border-border ml-0.5 pl-3">
                    {q.explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className="px-4 py-3 bg-muted/20 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {submitted
              ? "Scored locally in your browser. Nothing is sent anywhere."
              : `${answers.filter((a) => a !== null).length} / ${questions.length} answered`}
          </p>
          {submitted ? (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-border hover:border-emerald-500/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="text-sm font-medium px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
