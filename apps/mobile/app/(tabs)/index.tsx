import { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function HomeScreen() {
  const router = useRouter();
  const [nutrition, setNutrition] = useState<any>(null);
  const [pantry, setPantry] = useState<any>(null);

  useEffect(() => {
    api.get("/api/nutrition/daily").then(setNutrition).catch(() => {});
    api.get("/api/pantry").then(setPantry).catch(() => {});
  }, []);

  const totals = nutrition?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const goals = nutrition?.goals || { calories: 2000, protein: 150, carbs: 200, fat: 65 };
  const expiring = pantry?.summary?.expiringSoon || 0;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Dashboard</Text>

      <View style={s.card}>
        <Text style={s.cardTitle}>Today&apos;s Nutrition</Text>
        {(["calories", "protein", "carbs", "fat"] as const).map((key) => (
          <View key={key} style={s.row}>
            <Text style={s.rowLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Text style={s.rowValue}>
              {Math.round(totals[key])} / {goals[key]}
            </Text>
          </View>
        ))}
      </View>

      {expiring > 0 && (
        <TouchableOpacity
          style={[s.card, { backgroundColor: "#fef3c7" }]}
          onPress={() => router.push("/(tabs)/pantry")}
        >
          <Text style={{ fontWeight: "600", color: "#92400e" }}>
            {expiring} items expiring soon
          </Text>
        </TouchableOpacity>
      )}

      <View style={s.actions}>
        {([
          { label: "Scan", route: "/(tabs)/scan" as const },
          { label: "Recipes", route: "/(tabs)/recipes" as const },
          { label: "Pantry", route: "/(tabs)/pantry" as const },
        ] as const).map((a) => (
          <TouchableOpacity
            key={a.label}
            style={s.actionBtn}
            onPress={() => router.push(a.route)}
          >
            <Text style={s.actionText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  rowLabel: { fontSize: 14, color: "#374151" },
  rowValue: { fontSize: 14, color: "#6b7280" },
  actions: { flexDirection: "row", gap: 12 },
  actionBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});
