import { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/lib/api";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<"camera" | "gallery">("gallery");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled && res.assets[0]) {
      uploadImage(res.assets[0].uri);
    }
  }

  async function uploadImage(uri: string) {
    setLoading(true);
    setResult(null);
    setPreview(uri);

    const fd = new FormData();
    fd.append("image", {
      uri,
      name: "fridge.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const data = await api.upload<any>("/api/scan/fridge", fd);
      setResult(data);
    } catch (err: any) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Scan Your Fridge</Text>

      <View style={s.btnRow}>
        <TouchableOpacity style={s.primaryBtn} onPress={pickImage}>
          <Text style={s.primaryBtnText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      {preview && (
        <Image source={{ uri: preview }} style={s.preview} resizeMode="cover" />
      )}

      {loading && (
        <View style={s.loadingRow}>
          <ActivityIndicator color="#22c55e" />
          <Text style={{ color: "#6b7280", marginLeft: 8 }}>Analyzing...</Text>
        </View>
      )}

      {result && !result.error && (
        <View style={s.card}>
          <Text style={s.cardTitle}>
            Detected {result.items?.length || 0} items
          </Text>
          {result.stats?.summary && (
            <Text style={s.summary}>{result.stats.summary}</Text>
          )}
          {result.items?.map((item: any, i: number) => (
            <View key={i} style={s.itemRow}>
              <Text style={s.itemName}>{item.name}</Text>
              {item.estimatedQuantity && (
                <Text style={s.itemQty}>{item.estimatedQuantity}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {result?.error && (
        <Text style={{ color: "#ef4444", textAlign: "center" }}>
          {result.error}
        </Text>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  btnRow: { flexDirection: "row", gap: 12 },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "600" },
  preview: { width: "100%", height: 200, borderRadius: 12 },
  loadingRow: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTitle: { fontWeight: "600", fontSize: 16, color: "#111827", marginBottom: 8 },
  summary: { fontSize: 13, color: "#6b7280", marginBottom: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemName: { fontSize: 14, color: "#374151" },
  itemQty: { fontSize: 13, color: "#9ca3af" },
});
