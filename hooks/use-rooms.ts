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

      // ✅ Correct API endpoint
      const response = await api.get("/api/v1/rooms/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const data = response.data;

      // ✅ Normalize response
      if (Array.isArray(data?.rooms)) return data.rooms;
      if (Array.isArray(data)) return data;

      throw new Error("Unexpected rooms response format");
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled: !!token,
  });
};
