// app/login/page.tsx  (or components/LoginPage.tsx — wherever you mount it)
"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/lib/auth-api"; // your existing function
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { delay } from "@/utils/delay";
import { LoginInput, LoginResponse } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const setCredentials = useAuthStore((s) => s.setCredentials);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  // mutation typed to match loginRequest
  const mutation = useMutation<LoginResponse, any, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      // store token & user in Zustand (persist should keep it across reloads)
      setCredentials({ token: data.access_token, user: data.session });
      toast({
        title: "Login successful",
        description: "Welcome back to Sobar Solution!",
      });
      // small delay for UX
      await delay(250);
      router.push("/rooms");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description:
          error?.response?.data?.message || "Invalid email/phone or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (vals: LoginInput) => mutation.mutate(vals);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-balance">
                Sobar Solution
              </h1>
            </div>
            <p className="text-muted-foreground text-center text-balance">
              Admin Portal
            </p>
          </div>

          {/* Card Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Phone</Label>
                  <Input
                    id="identifier"
                    placeholder="admin@sobarsolution.com"
                    {...register("identifier", {
                      required: "Email or phone is required",
                    })}
                    className="bg-secondary border-border"
                  />
                  {errors.identifier && (
                    <p className="text-sm text-red-500">
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "Password required" })}
                    className="bg-secondary border-border"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isLoading || isSubmitting}
                >
                  {mutation.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
