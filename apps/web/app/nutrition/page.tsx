"use client";

import { useDailyNutrition, useWeeklyNutrition } from "@/hooks/useNutrition";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

export default function NutritionPage() {
  const { data: daily } = useDailyNutrition();
  const { data: weekly } = useWeeklyNutrition();

  const logs: any[] = daily?.logs || [];
  const days: any[] = weekly?.days || [];

  const chartData = days.map((d: any) => ({
    date: d.date.slice(5),
    Calories: d.calories,
    Protein: d.protein,
    Carbs: d.carbs,
    Fat: d.fat,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nutrition</h1>
        <p className="mt-1 text-gray-500">Track your daily intake</p>
      </div>

      {/* Weekly chart */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Weekly Calories
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Calories" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-8 text-center text-gray-400">No data this week</p>
        )}
      </section>

      {/* Macro breakdown chart */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Weekly Macros
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Protein" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Carbs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Fat" fill="#eab308" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-8 text-center text-gray-400">No data this week</p>
        )}
      </section>

      {/* Today's meals */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
          Today&apos;s Meals
        </h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No meals logged today</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{log.label}</p>
                  <p className="text-xs text-gray-400">{log.mealType}</p>
                </div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <span>{log.calories} kcal</span>
                  <span>{log.protein}g P</span>
                  <span>{log.carbs}g C</span>
                  <span>{log.fat}g F</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
