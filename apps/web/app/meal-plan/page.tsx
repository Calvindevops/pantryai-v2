"use client";

import { useMealPlan, useGenerateMealPlan } from "@/hooks/useMealPlan";
import { CalendarRange, Sparkles, Loader2 } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS = ["breakfast", "lunch", "dinner"];

export default function MealPlanPage() {
  const { data: plan, isLoading } = useMealPlan();
  const generateMut = useGenerateMealPlan();

  const items: any[] = plan?.items || [];

  function getSlot(day: number, meal: string) {
    return items.find((i: any) => i.dayOfWeek === day && i.mealType === meal);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
          <p className="mt-1 text-gray-500">Your weekly meal schedule</p>
        </div>
        <button
          onClick={() => generateMut.mutate()}
          disabled={generateMut.isPending}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {generateMut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate Plan
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading plan...</div>
      ) : !plan ? (
        <div className="flex flex-col items-center gap-4 py-16 text-gray-400">
          <CalendarRange className="h-12 w-12" />
          <p>No meal plan yet. Generate one to get started!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[800px] grid-cols-7 gap-3">
            {DAYS.map((day, dayIdx) => (
              <div key={day} className="space-y-2">
                <h3 className="text-center text-sm font-semibold text-gray-600">
                  {day}
                </h3>
                {MEALS.map((meal) => {
                  const slot = getSlot(dayIdx, meal);
                  return (
                    <div
                      key={meal}
                      className="rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                        {meal}
                      </p>
                      {slot?.recipe ? (
                        <p className="text-sm font-medium text-gray-800">
                          {slot.recipe.title}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-300">—</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
