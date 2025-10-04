"use client";

import { apiClient } from "@/lib/api-client";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    async function fetchData() {
      const result = await apiClient.get("/rooms");
      console.log(result.data)
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <h1 className="text-2xl font-bold text-primary">About Page</h1>
    </div>
  );
}
