"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { tokenManager } from "@/lib/api";
import toast from "react-hot-toast";

export default function AuthSuccess() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      tokenManager.set(token);
      toast.success("Login successful!");
      router.push("/profile");  // redirect destination
    } else {
      toast.error("Google Login Failed. Please try again.");
      router.push("/login?error=Google+Login+Failed");
    }
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      Logging you in... Please wait...
    </div>
  );
}
