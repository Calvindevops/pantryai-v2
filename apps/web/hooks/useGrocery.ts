import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useGroceryList() {
  return useQuery({
    queryKey: ["grocery"],
    queryFn: () => api.get<any>("/api/grocery"),
  });
}

export function useAddGroceryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: { name: string; quantity?: number; unit?: string }) =>
      api.post("/api/grocery/items", item),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grocery"] }),
  });
}

export function useToggleGroceryItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: boolean }) =>
      api.patch(`/api/grocery/items/${id}`, { checked }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["grocery"] }),
  });
}
