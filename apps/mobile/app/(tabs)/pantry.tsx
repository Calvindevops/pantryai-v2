import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "@/lib/api";

export default function PantryScreen() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/api/pantry").then(setData).catch(() => {});
  }, []);

  const items: any[] = data?.items || [];

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Pantry</Text>
      <Text style={s.subtitle}>
        {data?.summary?.total || 0} items
        {data?.summary?.expiringSoon
          ? ` · ${data.summary.expiringSoon} expiring soon`
          : ""}
      </Text>

      {items.length === 0 ? (
        <Text style={s.empty}>No items yet. Scan your fridge to add some!</Text>
      ) : (
        items.map((item: any) => (
          <View key={item.id} style={s.card}>
            <View>
              <Text style={s.itemName}>{item.ingredient?.name}</Text>
              <Text style={s.itemMeta}>
                {item.quantity} {item.unit} · {item.ingredient?.category}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  empty: { textAlign: "center", color: "#9ca3af", marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  itemName: { fontSize: 15, fontWeight: "600", color: "#374151" },
  itemMeta: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
});
