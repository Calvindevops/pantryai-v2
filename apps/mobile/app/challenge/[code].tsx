import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { api } from "@/lib/api";

export default function ChallengeScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const [challenge, setChallenge] = useState<any>(null);

  useEffect(() => {
    if (code) {
      api.get(`/api/social/challenge/${code}`).then(setChallenge).catch(() => {});
    }
  }, [code]);

  if (!challenge) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#9ca3af" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Fridge Challenge</Text>
      {challenge.user && (
        <Text style={s.subtitle}>{challenge.user.name}&apos;s fridge</Text>
      )}

      <View style={s.bigCard}>
        <Text style={s.bigNum}>{challenge.itemCount}</Text>
        <Text style={s.bigLabel}>items detected</Text>
      </View>

      {challenge.topItems?.length > 0 && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Top Items</Text>
          {challenge.topItems.map((item: string, i: number) => (
            <Text key={i} style={s.topItem}>
              {item}
            </Text>
          ))}
        </View>
      )}

      {challenge.stats?.healthScore && (
        <View style={s.card}>
          <Text style={s.cardTitle}>Health Score</Text>
          <Text style={s.healthScore}>{challenge.stats.healthScore}/10</Text>
        </View>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 16, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  bigCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 32,
    alignItems: "center", borderWidth: 1, borderColor: "#e5e7eb", width: "100%",
  },
  bigNum: { fontSize: 48, fontWeight: "800", color: "#7c3aed" },
  bigLabel: { fontSize: 14, color: "#6b7280" },
  card: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: "#e5e7eb", width: "100%",
  },
  cardTitle: { fontSize: 12, color: "#6b7280", textTransform: "uppercase", fontWeight: "600", marginBottom: 8 },
  topItem: { fontSize: 14, color: "#374151", paddingVertical: 2 },
  healthScore: { fontSize: 32, fontWeight: "800", color: "#22c55e" },
});
