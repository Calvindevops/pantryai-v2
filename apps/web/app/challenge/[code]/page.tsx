"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Trophy } from "lucide-react";

export default function ChallengePage() {
  const { code } = useParams<{ code: string }>();
  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ["challenge", code],
    queryFn: () => api.get<any>(`/api/social/challenge/${code}`),
    enabled: !!code,
  });

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading challenge...</div>;
  }

  if (error || !challenge) {
    return <div className="py-12 text-center text-gray-400">Challenge not found</div>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-purple-100 p-4">
          <Trophy className="h-10 w-10 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Fridge Challenge</h1>
        {challenge.user && (
          <p className="text-gray-500">{challenge.user.name}&apos;s fridge</p>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
        <p className="text-5xl font-bold text-purple-600">{challenge.itemCount}</p>
        <p className="mt-1 text-sm text-gray-500">items detected</p>
      </div>

      {challenge.topItems?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">Top Items</h2>
          <div className="flex flex-wrap gap-2">
            {challenge.topItems.map((item: string, i: number) => (
              <span
                key={i}
                className="rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {challenge.stats?.healthScore && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-500">Health Score</p>
          <p className="text-4xl font-bold text-brand-600">
            {challenge.stats.healthScore}/10
          </p>
        </div>
      )}
    </div>
  );
}
