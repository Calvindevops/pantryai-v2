import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function RecipesScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/api/recipes").then(setData).catch(() => {});
  }, []);

  const recipes: any[] = data?.recipes || [];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Recipes</Text>

      {recipes.length === 0 ? (
        <Text style={s.empty}>No recipes yet</Text>
      ) : (
        recipes.map((r: any) => (
          <TouchableOpacity
            key={r.id}
            style={s.card}
            onPress={() => router.push(`/recipe/${r.id}`)}
          >
            <Text style={s.recipeTitle}>{r.title}</Text>
            {r.description && (
              <Text style={s.desc} numberOfLines={2}>
                {r.description}
              </Text>
            )}
            <Text style={s.meta}>
              {r.prepTimeMinutes + r.cookTimeMinutes} min · {r.servings} servings
              {r.calories ? ` · ${r.calories} kcal` : ""}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recipeTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  desc: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  meta: { fontSize: 12, color: "#9ca3af", marginTop: 8 },
});
