import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useMealPlan() {
  return useQuery({
    queryKey: ["mealPlan"],
    queryFn: () => api.get<any>("/api/meal-plan/current"),
  });
}

export function useGenerateMealPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<any>("/api/meal-plan/generate"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["mealPlan"] }),
  });
}
