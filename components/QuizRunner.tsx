"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import type { QuizQuestion } from "@/lib/modules";

interface QuizRunnerProps {
  moduleLabel: string;
  questions: QuizQuestion[];
}

interface QuestionState {
  selected: number; // -1 = not selected yet
  submitted: boolean;
}

export default function QuizRunner({ moduleLabel, questions }: QuizRunnerProps) {
  const [states, setStates] = useState<QuestionState[]>(() =>
    questions.map(() => ({ selected: -1, submitted: false }))
  );

  const submittedCount = states.filter((s) => s.submitted).length;
  const correctCount = states.filter(
    (s, i) => s.submitted && s.selected === questions[i].correct
  ).length;

  function selectOption(qIndex: number, optIndex: number) {
    setStates((prev) => {
      const next = [...prev];
      if (next[qIndex].submitted) return prev; // locked after this question's own submit
      next[qIndex] = { ...next[qIndex], selected: optIndex };
      return next;
    });
  }

  function submitQuestion(qIndex: number) {
    setStates((prev) => {
      const next = [...prev];
      if (next[qIndex].selected === -1) return prev; // must pick an option first
      next[qIndex] = { ...next[qIndex], submitted: true };
      return next;
    });
  }

  return (
    <div dir="rtl" lang="fa" className="font-vazir">
      <div className="section-h">
        <div className="label">Quiz</div>
        <h2>آزمون {moduleLabel}</h2>
        <p>
          به هر سؤال یک گزینه انتخاب کن و «ثبت پاسخ» را بزن. پاسخ صحیح و توضیح آن
          سؤال فقط بعد از ثبت همان سؤال نمایش داده می‌شود.
        </p>
      </div>

      <div className="glass-card mb-6 px-5 py-3.5">
        <span className="text-sm text-slate-600 dark:text-[#94a3b8]">
          {submittedCount} از {questions.length} سؤال ثبت شده
          {submittedCount > 0 && ` — ${correctCount} پاسخ صحیح`}
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {questions.map((q, qi) => {
          const state = states[qi];
          const { selected, submitted } = state;

          return (
            <div key={qi} className="rich-card">
              <div className="head">
                <div className="icon">{qi + 1}</div>
                <div className="info">
                  <div className="title">{q.question}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrectOpt = oi === q.correct;

                  let stateClass =
                    "border-slate-200 dark:border-white/10 hover:border-[rgba(32,217,255,0.3)]";
                  if (submitted) {
                    if (isCorrectOpt) {
                      stateClass = "border-[#38E89A] bg-[rgba(56,232,154,0.08)]";
                    } else if (isSelected && !isCorrectOpt) {
                      stateClass = "border-[#f87171] bg-[rgba(248,113,113,0.08)]";
                    } else {
                      stateClass = "border-slate-200 dark:border-white/10 opacity-60";
                    }
                  } else if (isSelected) {
                    stateClass = "border-[#20D9FF] bg-[rgba(32,217,255,0.08)]";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => selectOption(qi, oi)}
                      disabled={submitted}
                      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-right text-sm text-slate-800 dark:text-[#e2e8f0] transition-all ${stateClass} ${submitted ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span>{opt}</span>
                      {submitted && isCorrectOpt && (
                        <Check size={16} className="shrink-0 text-[#38E89A]" />
                      )}
                      {submitted && isSelected && !isCorrectOpt && (
                        <X size={16} className="shrink-0 text-[#f87171]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!submitted && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => submitQuestion(qi)}
                    disabled={selected === -1}
                    className="rounded-full bg-gradient-to-r from-[#2477FF] via-[#20D9FF] to-[#38E89A] px-5 py-2 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_0_20px_rgba(32,217,255,0.3)]"
                  >
                    ثبت پاسخ
                  </button>
                </div>
              )}

              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <div
                      className={`callout ${selected === q.correct ? "callout-tip" : "callout-danger"}`}
                    >
                      <div className="callout-icon">{selected === q.correct ? "✓" : "✕"}</div>
                      <div className="callout-body">
                        <div className="callout-title">
                          {selected === q.correct ? "پاسخ درست" : "پاسخ نادرست"}
                        </div>
                        {q.explanation && <p>{q.explanation}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}