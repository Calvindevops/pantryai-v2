"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { Upload, Camera, Loader2 } from "lucide-react";

export default function ScanPage() {
  const [mode, setMode] = useState<"fridge" | "item">("fridge");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setLoading(true);
    setError("");
    setResult(null);
    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("image", file);

    try {
      const data = await api.upload<any>(
        mode === "fridge" ? "/api/scan/fridge" : "/api/scan/item",
        fd
      );
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scan</h1>
        <p className="mt-1 text-gray-500">Upload a photo to identify items</p>
      </div>

      <div className="flex gap-3">
        {(["fridge", "item"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); setPreview(null); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === m
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {m === "fridge" ? "Full Fridge" : "Single Item"}
          </button>
        ))}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 transition hover:border-brand-400 hover:bg-brand-50"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
        ) : (
          <>
            <div className="rounded-full bg-gray-100 p-4">
              {mode === "fridge" ? <Camera className="h-8 w-8 text-gray-400" /> : <Upload className="h-8 w-8 text-gray-400" />}
            </div>
            <p className="text-gray-500">Click or drag a photo to scan</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-brand-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Analyzing image...
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold">
            Detected {result.items?.length || 0} items
          </h3>

          {result.stats?.summary && (
            <p className="text-sm text-gray-600">{result.stats.summary}</p>
          )}

          {result.stats?.healthScore && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Health Score:</span>
              <span className="font-bold text-brand-600">
                {result.stats.healthScore}/10
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {result.items?.map((item: any, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2"
              >
                <span className="text-sm font-medium">{item.name}</span>
                {item.estimatedQuantity && (
                  <span className="text-xs text-gray-400">
                    ({item.estimatedQuantity})
                  </span>
                )}
              </div>
            ))}
          </div>

          {result.challenge && (
            <div className="rounded-lg bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-700">
                Fridge Challenge created!
              </p>
              <p className="text-xs text-purple-500">
                Share code: {result.challenge.shareCode}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
