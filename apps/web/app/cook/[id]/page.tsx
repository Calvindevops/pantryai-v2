"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useRecipe } from "@/hooks/useRecipes";
import { ChevronLeft, ChevronRight, Check, Timer, Loader2 } from "lucide-react";

export default function CookModePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: recipe } = useRecipe(id);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [timerSec, setTimerSec] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    api.post<any>("/api/cook/start", { recipeId: id }).then((s) => {
      setSessionId(s.id);
    });
  }, [id]);

  useEffect(() => {
    if (!timerRunning || timerSec <= 0) return;
    const interval = setInterval(() => {
      setTimerSec((s) => {
        if (s <= 1) { setTimerRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, timerSec]);

  if (!recipe?.steps) {
    return <div className="py-12 text-center text-gray-400">Loading cook mode...</div>;
  }

  const steps = recipe.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  async function goNext() {
    if (isLast) {
      setCompleting(true);
      await api.post(`/api/cook/${sessionId}/complete`);
      router.push(`/recipes/${id}`);
    } else {
      const next = step + 1;
      setStep(next);
      if (sessionId) {
        api.patch(`/api/cook/${sessionId}/step`, { currentStep: next });
      }
      const nextStep = steps[next];
      if (nextStep?.durationMin) {
        setTimerSec(nextStep.durationMin * 60);
        setTimerRunning(false);
      }
    }
  }

  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-12">
      <p className="text-sm text-gray-400">
        Step {step + 1} of {steps.length}
      </p>

      <div className="h-1 w-full rounded-full bg-gray-200">
        <div
          className="h-1 rounded-full bg-brand-500 transition-all"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-lg font-medium text-gray-800">{current.instruction}</p>
        {current.tip && (
          <p className="mt-3 text-sm text-brand-600">Tip: {current.tip}</p>
        )}
      </div>

      {current.durationMin && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl font-mono font-bold text-gray-800">
            {timerRunning ? fmtTime(timerSec) : `${current.durationMin}:00`}
          </span>
          <button
            onClick={() => {
              if (!timerRunning && timerSec === 0) {
                setTimerSec(current.durationMin! * 60);
              }
              setTimerRunning(!timerRunning);
            }}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <Timer className="h-4 w-4" />
            {timerRunning ? "Pause" : "Start Timer"}
          </button>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <button
          onClick={goNext}
          disabled={completing}
          className="flex items-center gap-1 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {completing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isLast ? (
            <>
              <Check className="h-4 w-4" /> Complete
            </>
          ) : (
            <>
              Next <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
