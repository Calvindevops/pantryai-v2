"use client";

import { useState } from "react";
import {
  useGroceryList,
  useAddGroceryItem,
  useToggleGroceryItem,
} from "@/hooks/useGrocery";
import { Plus, ShoppingCart, Check } from "lucide-react";

export default function GroceryPage() {
  const { data: list, isLoading } = useGroceryList();
  const addMut = useAddGroceryItem();
  const toggleMut = useToggleGroceryItem();
  const [newItem, setNewItem] = useState("");

  const items: any[] = list?.items || [];
  const unchecked = items.filter((i) => !i.checked);
  const checked = items.filter((i) => i.checked);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.trim()) return;
    addMut.mutate({ name: newItem.trim() });
    setNewItem("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
        <p className="mt-1 text-gray-500">
          {unchecked.length} item{unchecked.length !== 1 ? "s" : ""} to buy
        </p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Add an item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {isLoading ? (
        <div className="py-12 text-center text-gray-400">Loading list...</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-gray-400">
          <ShoppingCart className="h-12 w-12" />
          <p>Your grocery list is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Unchecked */}
          <div className="space-y-2">
            {unchecked.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleMut.mutate({ id: item.id, checked: true })}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition hover:bg-gray-50"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-gray-300" />
                <span className="text-sm font-medium text-gray-800">
                  {item.name}
                </span>
                <span className="text-xs text-gray-400">
                  {item.quantity} {item.unit}
                </span>
              </button>
            ))}
          </div>

          {/* Checked */}
          {checked.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-gray-400">Purchased</p>
              {checked.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleMut.mutate({ id: item.id, checked: false })}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:bg-white"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded border-2 border-brand-500 bg-brand-500">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
