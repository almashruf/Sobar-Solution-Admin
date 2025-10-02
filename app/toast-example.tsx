"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ToastExample() {
  const { toast } = useToast();

  const showToast = () => {
    toast({
      title: "Success!",
      description: "Your action was completed successfully.",
      variant: "default",
    });
  };

  const showErrorToast = () => {
    toast({
      title: "Error!",
      description: "Something went wrong.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold mb-4">Toast Example</h1>
      <Button onClick={showToast}>Show Success Toast</Button>
      <Button variant="destructive" onClick={showErrorToast}>
        Show Error Toast
      </Button>
    </div>
  );
}