import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useRecipes(page = 1, filters?: { cuisine?: string; skill?: string }) {
  const params = new URLSearchParams({ page: String(page) });
  if (filters?.cuisine) params.set("cuisine", filters.cuisine);
  if (filters?.skill) params.set("skill", filters.skill);

  return useQuery({
    queryKey: ["recipes", page, filters],
    queryFn: () => api.get<any>(`/api/recipes?${params}`),
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => api.get<any>(`/api/recipes/${id}`),
    enabled: !!id,
  });
}

export function useGenerateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post<any>("/api/recipes/generate"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}
