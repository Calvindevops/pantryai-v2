"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useRecipe } from "@/hooks/useRecipes";
import { Clock, Users, ChefHat, ArrowLeft } from "lucide-react";

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading } = useRecipe(id);

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading recipe...</div>;
  }

  if (!recipe) {
    return <div className="py-12 text-center text-gray-400">Recipe not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to recipes
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
        {recipe.description && (
          <p className="mt-2 text-gray-600">{recipe.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            {recipe.skillLevel}
          </span>
        </div>

        {recipe.calories && (
          <div className="mt-4 flex gap-6 rounded-lg bg-gray-50 px-4 py-3 text-sm">
            <span><strong>{recipe.calories}</strong> kcal</span>
            <span><strong>{recipe.protein}g</strong> protein</span>
            <span><strong>{recipe.carbs}g</strong> carbs</span>
            <span><strong>{recipe.fat}g</strong> fat</span>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients?.map((ri: any) => (
            <li key={ri.id} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              <span>
                {ri.quantity} {ri.unit} {ri.ingredient?.name || ""}
              </span>
              {ri.isOptional && (
                <span className="text-xs text-gray-400">(optional)</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-semibold text-gray-900">Steps</h2>
        <ol className="space-y-4">
          {recipe.steps?.map((step: any) => (
            <li key={step.id} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                {step.stepNumber}
              </span>
              <div>
                <p className="text-sm text-gray-800">{step.instruction}</p>
                {step.tip && (
                  <p className="mt-1 text-xs text-brand-600">Tip: {step.tip}</p>
                )}
                {step.durationMin && (
                  <p className="mt-1 text-xs text-gray-400">~{step.durationMin} min</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Link
        href={`/cook/${recipe.id}`}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition hover:bg-brand-600"
      >
        <ChefHat className="h-5 w-5" />
        Start Cook Mode
      </Link>
    </div>
  );
}
