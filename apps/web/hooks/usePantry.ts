import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function usePantry(category?: string, search?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  const qs = params.toString();

  return useQuery({
    queryKey: ["pantry", category, search],
    queryFn: () => api.get<any>(`/api/pantry${qs ? `?${qs}` : ""}`),
  });
}

export function useBulkAddPantry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: any[]) => api.post("/api/pantry/bulk", items),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry"] }),
  });
}

export function useDeletePantryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/pantry/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pantry"] }),
  });
}
