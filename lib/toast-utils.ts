"use client";

import { toast } from "@/hooks/use-toast";

// Utility functions for common toast patterns
export const showToast = {
  success: (message: string, title = "Success") => {
    toast({
      title,
      description: message,
      variant: "default",
    });
  },
  
  error: (message: string, title = "Error") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    });
  },
  
  info: (message: string, title = "Information") => {
    toast({
      title,
      description: message,
    });
  },
  
  warning: (message: string, title = "Warning") => {
    toast({
      title,
      description: message,
      variant: "destructive",
      className: "bg-yellow-500 border-yellow-600",
    });
  }
};