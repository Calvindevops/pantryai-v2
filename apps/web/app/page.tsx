"use client";

import Link from "next/link";
import { useDailyNutrition } from "@/hooks/useNutrition";
import { usePantry } from "@/hooks/usePantry";
import { ScanLine, ChefHat, CalendarRange, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: nutrition } = useDailyNutrition();
  const { data: pantry } = usePantry();

  const totals = nutrition?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const goals = nutrition?.goals || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
  const expiring = pantry?.summary?.expiringSoon || 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Your daily overview</p>
      </div>

      {/* Nutrition Progress */}
      <section className="rounded-xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Today&apos;s Nutrition
        </h2>
        <div className="grid grid-cols-4 gap-6">
          {([
            { label: "Calories", value: totals.calories, goal: goals.calories, unit: "kcal", color: "bg-orange-500" },
            { label: "Protein", value: totals.protein, goal: goals.protein, unit: "g", color: "bg-red-500" },
            { label: "Carbs", value: totals.carbs, goal: goals.carbs, unit: "g", color: "bg-blue-500" },
            { label: "Fat", value: totals.fat, goal: goals.fat, unit: "g", color: "bg-yellow-500" },
          ] as const).map((m) => {
            const pct = Math.min((m.value / m.goal) * 100, 100);
            return (
              <div key={m.label}>
                <div className="flex items-end justify-between">
                  <span className="text-sm text-gray-600">{m.label}</span>
                  <span className="text-xs text-gray-400">
                    {Math.round(m.value)}/{m.goal}{m.unit}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${m.color} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Expiring Soon */}
      {expiring > 0 && (
        <Link
          href="/pantry"
          className="flex items-center gap-3 rounded-xl border border-amber-200/60 bg-amber-50/70 p-4 backdrop-blur-sm transition hover:bg-amber-100/80"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-lg font-bold">
            {expiring}
          </div>
          <div>
            <p className="font-medium text-amber-800">Items expiring soon</p>
            <p className="text-sm text-amber-600">Check your pantry to use them up</p>
          </div>
        </Link>
      )}

      {/* Quick Actions */}
      <section className="grid grid-cols-4 gap-4">
        {([
          { href: "/scan", label: "Scan Fridge", icon: ScanLine, desc: "Upload a photo", color: "bg-brand-50/70 text-brand-700 border-brand-200/60 backdrop-blur-sm" },
          { href: "/recipes", label: "Recipes", icon: ChefHat, desc: "Find what to cook", color: "bg-purple-50/70 text-purple-700 border-purple-200/60 backdrop-blur-sm" },
          { href: "/meal-plan", label: "Meal Plan", icon: CalendarRange, desc: "Plan your week", color: "bg-sky-50/70 text-sky-700 border-sky-200/60 backdrop-blur-sm" },
          { href: "/recipes?generate=1", label: "AI Suggest", icon: Sparkles, desc: "Get a recipe idea", color: "bg-pink-50/70 text-pink-700 border-pink-200/60 backdrop-blur-sm" },
        ] as const).map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`flex flex-col items-center gap-2 rounded-xl border p-6 transition hover:shadow-md ${a.color}`}
          >
            <a.icon className="h-8 w-8" />
            <span className="font-semibold">{a.label}</span>
            <span className="text-xs opacity-70">{a.desc}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
