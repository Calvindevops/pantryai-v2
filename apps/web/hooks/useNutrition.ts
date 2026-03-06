import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useDailyNutrition(date?: string) {
  const params = date ? `?date=${date}` : "";
  return useQuery({
    queryKey: ["nutrition", "daily", date],
    queryFn: () => api.get<any>(`/api/nutrition/daily${params}`),
  });
}

export function useWeeklyNutrition() {
  return useQuery({
    queryKey: ["nutrition", "weekly"],
    queryFn: () => api.get<any>("/api/nutrition/weekly"),
  });
}
