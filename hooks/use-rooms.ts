"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/axiosClient";

export interface Room {
  id: number;
  name: string;
  status: "active" | "inactive" | string;
}

export const useRooms = () => {
  const token = useAuthStore((state) => state.token);

  return useQuery<Room[], Error>({
    queryKey: ["rooms", token],
    queryFn: async () => {
      if (!token) throw new Error("Not authenticated");

      // Use the correct API endpoint with pagination and prevent caching
      const response = await api.get("/rooms/?page=1&limit=10", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      const data = response.data;

      // normalize response
      if (data?.data?.rooms) return data.data.rooms;
      if (data?.rooms) return data.rooms;
      if (Array.isArray(data)) return data;

      throw new Error("Unexpected rooms response format");
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled: !!token, // Only run the query if we have a token
  });
};
