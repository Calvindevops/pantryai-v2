import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "@/lib/api";

export default function CookModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (id) {
      api.get(`/api/recipes/${id}`).then(setRecipe).catch(() => {});
      api.post<any>("/api/cook/start", { recipeId: id }).then((s) => setSessionId(s.id)).catch(() => {});
    }
  }, [id]);

  if (!recipe?.steps) {
    return (
      <View style={s.center}>
        <Text style={{ color: "#9ca3af" }}>Loading...</Text>
      </View>
    );
  }

  const steps = recipe.steps;
  const current = steps[step];
  const isLast = step === steps.length - 1;

  async function handleNext() {
    if (isLast) {
      if (sessionId) await api.post(`/api/cook/${sessionId}/complete`);
      router.back();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.progress}>
        Step {step + 1} of {steps.length}
      </Text>

      <View style={s.card}>
        <Text style={s.instruction}>{current.instruction}</Text>
        {current.tip && <Text style={s.tip}>Tip: {current.tip}</Text>}
        {current.durationMin && (
          <Text style={s.duration}>~{current.durationMin} min</Text>
        )}
      </View>

      <View style={s.btnRow}>
        <TouchableOpacity
          style={[s.btn, s.btnSecondary]}
          onPress={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
        >
          <Text style={s.btnSecondaryText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={handleNext}>
          <Text style={s.btnPrimaryText}>
            {isLast ? "Complete" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 20, justifyContent: "center", gap: 24 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  progress: { textAlign: "center", fontSize: 14, color: "#9ca3af" },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 24,
    borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center",
  },
  instruction: { fontSize: 17, color: "#111827", textAlign: "center", lineHeight: 26 },
  tip: { fontSize: 13, color: "#22c55e", marginTop: 12 },
  duration: { fontSize: 13, color: "#9ca3af", marginTop: 8 },
  btnRow: { flexDirection: "row", gap: 12 },
  btn: { flex: 1, borderRadius: 12, padding: 16, alignItems: "center" },
  btnPrimary: { backgroundColor: "#22c55e" },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },
  btnSecondary: { backgroundColor: "#f3f4f6" },
  btnSecondaryText: { color: "#6b7280", fontWeight: "600" },
});
