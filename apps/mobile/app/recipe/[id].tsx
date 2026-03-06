import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);

  useEffect(() => {
    if (id) api.get(`/api/recipes/${id}`).then(setRecipe).catch(() => {});
  }, [id]);

  if (!recipe) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#9ca3af" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>{recipe.title}</Text>
      {recipe.description && <Text style={s.desc}>{recipe.description}</Text>}

      <Text style={s.meta}>
        {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min · {recipe.servings} servings · {recipe.skillLevel}
      </Text>

      {recipe.calories && (
        <View style={s.macros}>
          <Text style={s.macro}>{recipe.calories} kcal</Text>
          <Text style={s.macro}>{recipe.protein}g P</Text>
          <Text style={s.macro}>{recipe.carbs}g C</Text>
          <Text style={s.macro}>{recipe.fat}g F</Text>
        </View>
      )}

      <Text style={s.section}>Ingredients</Text>
      {recipe.ingredients?.map((ri: any) => (
        <Text key={ri.id} style={s.ingredient}>
          • {ri.quantity} {ri.unit} {ri.ingredient?.name}
        </Text>
      ))}

      <Text style={s.section}>Steps</Text>
      {recipe.steps?.map((step: any) => (
        <View key={step.id} style={s.step}>
          <Text style={s.stepNum}>{step.stepNumber}</Text>
          <Text style={s.stepText}>{step.instruction}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={s.cookBtn}
        onPress={() => router.push(`/cook/${recipe.id}`)}
      >
        <Text style={s.cookBtnText}>Start Cook Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  desc: { fontSize: 14, color: "#6b7280" },
  meta: { fontSize: 13, color: "#9ca3af", marginBottom: 8 },
  macros: { flexDirection: "row", gap: 16, marginBottom: 8 },
  macro: { fontSize: 13, color: "#374151", fontWeight: "600" },
  section: {
    fontSize: 16, fontWeight: "700", color: "#111827", marginTop: 12, marginBottom: 4,
  },
  ingredient: { fontSize: 14, color: "#374151", paddingVertical: 2 },
  step: { flexDirection: "row", gap: 12, marginBottom: 12 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: "#dcfce7",
    textAlign: "center", lineHeight: 24, fontWeight: "700", color: "#15803d",
  },
  stepText: { flex: 1, fontSize: 14, color: "#374151" },
  cookBtn: {
    backgroundColor: "#22c55e", borderRadius: 12, padding: 16,
    alignItems: "center", marginTop: 16,
  },
  cookBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
