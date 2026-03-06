import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  async function handleLogout() {
    await SecureStore.deleteItemAsync("pantryai_token");
    // In a full app, navigate to login screen
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Profile</Text>

      <View style={s.card}>
        <Text style={s.label}>Skill Level</Text>
        <Text style={s.value}>Beginner</Text>
      </View>

      <View style={s.card}>
        <Text style={s.label}>Calorie Goal</Text>
        <Text style={s.value}>2,000 kcal/day</Text>
      </View>

      <View style={s.card}>
        <Text style={s.label}>Appliances</Text>
        <Text style={s.value}>Oven, Stovetop, Microwave</Text>
      </View>

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  label: { fontSize: 12, color: "#6b7280", textTransform: "uppercase", fontWeight: "600" },
  value: { fontSize: 15, color: "#374151", marginTop: 4 },
  logoutBtn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ef4444",
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: { color: "#ef4444", fontWeight: "600" },
});
