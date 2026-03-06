"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const profile = user?.profile;

  const [form, setForm] = useState({
    skillLevel: profile?.skillLevel || "beginner",
    dietaryRestrictions: (profile?.dietaryRestrictions || []).join(", "),
    allergies: (profile?.allergies || []).join(", "),
    appliances: (profile?.appliances || []).join(", "),
    cuisinePreferences: (profile?.cuisinePreferences || []).join(", "),
    calorieGoal: profile?.calorieGoal || 2000,
    proteinGoal: profile?.proteinGoal || 150,
    carbGoal: profile?.carbGoal || 200,
    fatGoal: profile?.fatGoal || 65,
    householdSize: profile?.householdSize || 1,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        skillLevel: profile.skillLevel || "beginner",
        dietaryRestrictions: (profile.dietaryRestrictions || []).join(", "),
        allergies: (profile.allergies || []).join(", "),
        appliances: (profile.appliances || []).join(", "),
        cuisinePreferences: (profile.cuisinePreferences || []).join(", "),
        calorieGoal: profile.calorieGoal || 2000,
        proteinGoal: profile.proteinGoal || 150,
        carbGoal: profile.carbGoal || 200,
        fatGoal: profile.fatGoal || 65,
        householdSize: profile.householdSize || 1,
      });
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Profile update endpoint not yet wired — this stores locally for now
      const updated = {
        ...user,
        profile: {
          ...profile,
          skillLevel: form.skillLevel,
          dietaryRestrictions: form.dietaryRestrictions.split(",").map((s: string) => s.trim()).filter(Boolean),
          allergies: form.allergies.split(",").map((s: string) => s.trim()).filter(Boolean),
          appliances: form.appliances.split(",").map((s: string) => s.trim()).filter(Boolean),
          cuisinePreferences: form.cuisinePreferences.split(",").map((s: string) => s.trim()).filter(Boolean),
          calorieGoal: Number(form.calorieGoal),
          proteinGoal: Number(form.proteinGoal),
          carbGoal: Number(form.carbGoal),
          fatGoal: Number(form.fatGoal),
          householdSize: Number(form.householdSize),
        },
      };
      localStorage.setItem("pantryai_user", JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Log out
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Skill Level</label>
          <select
            value={form.skillLevel}
            onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}
            className={inputCls}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Dietary Restrictions</label>
          <input
            type="text"
            placeholder="vegetarian, gluten-free, ..."
            value={form.dietaryRestrictions}
            onChange={(e) => setForm({ ...form, dietaryRestrictions: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Allergies</label>
          <input
            type="text"
            placeholder="peanuts, shellfish, ..."
            value={form.allergies}
            onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Kitchen Appliances</label>
          <input
            type="text"
            placeholder="oven, stovetop, air fryer, ..."
            value={form.appliances}
            onChange={(e) => setForm({ ...form, appliances: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cuisine Preferences</label>
          <input
            type="text"
            placeholder="italian, mexican, asian, ..."
            value={form.cuisinePreferences}
            onChange={(e) => setForm({ ...form, cuisinePreferences: e.target.value })}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {([
            { key: "calorieGoal", label: "Calorie Goal (kcal)" },
            { key: "proteinGoal", label: "Protein Goal (g)" },
            { key: "carbGoal", label: "Carb Goal (g)" },
            { key: "fatGoal", label: "Fat Goal (g)" },
          ] as const).map(({ key, label }) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={inputCls}
              />
            </div>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Household Size</label>
          <input
            type="number"
            min={1}
            value={form.householdSize}
            onChange={(e) => setForm({ ...form, householdSize: Number(e.target.value) })}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
