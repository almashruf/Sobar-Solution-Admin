"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useRooms, Room } from "@/hooks/use-rooms";

export default function RoomsPage() {
  const { data: rooms = [], isLoading } = useRooms();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "inactive":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-balance">
        Welcome back
      </h1>
      <p className="text-muted-foreground">
        Here's what's happening with your business today.
      </p>
    </div>
  );
}
