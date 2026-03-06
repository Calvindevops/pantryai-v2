"use client";

import { useState } from "react";
import { usePantry, useDeletePantryItem } from "@/hooks/usePantry";
import { Search, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";

const CATEGORIES = ["all", "produce", "dairy", "protein", "grain", "spice", "condiment", "other"];

export default function PantryPage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { data, isLoading } = usePantry(
    category === "all" ? undefined : category,
    search || undefined
  );
  const deleteMut = useDeletePantryItem();

  const items: any[] = data?.items || [];
  const summary = data?.summary;

  const now = new Date();
  function daysUntilExpiry(expiresAt: string | null) {
    if (!expiresAt) return Infinity;
    return Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / 86400_000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pantry</h1>
          <p className="mt-1 text-gray-500">
            {summary?.total || 0} items{" "}
            {summary?.expiringSoon ? (
              <span className="text-amber-600">
                ({summary.expiringSoon} expiring soon)
              </span>
            ) : null}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition",
              category === cat
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Items */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading pantry...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          No items found. Scan your fridge to add some!
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item: any) => {
            const days = daysUntilExpiry(item.expiresAt);
            return (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-block h-2.5 w-2.5 rounded-full",
                      days <= 1 ? "bg-red-500" : days <= 3 ? "bg-amber-400" : "bg-green-400"
                    )}
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.ingredient?.name || item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {item.quantity} {item.unit}
                      {item.ingredient?.category && (
                        <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-gray-500">
                          {item.ingredient.category}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {days <= 3 && days !== Infinity && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {days <= 0 ? "Expired" : `${days}d left`}
                    </span>
                  )}
                  <button
                    onClick={() => deleteMut.mutate(item.id)}
                    className="rounded p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
