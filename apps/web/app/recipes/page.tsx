"use client";

import Link from "next/link";
import { useRecipes, useGenerateRecipe } from "@/hooks/useRecipes";
import { Clock, Users, Sparkles, Loader2 } from "lucide-react";

export default function RecipesPage() {
  const { data, isLoading } = useRecipes();
  const generateMut = useGenerateRecipe();

  const recipes: any[] = data?.recipes || [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="mt-1 text-gray-500">{data?.total || 0} recipes</p>
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
          Generate Recipe
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No recipes yet. Generate one from your pantry!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-brand-600">
                {recipe.title}
              </h3>
              {recipe.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {recipe.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes}min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {recipe.servings}
                </span>
                {recipe.calories && <span>{recipe.calories} kcal</span>}
              </div>
              {recipe.tags?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
