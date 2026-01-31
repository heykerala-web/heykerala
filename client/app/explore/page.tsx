"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ExploreLayout from "@/components/explore/ExploreLayout";

export default function ExplorePage() {
  return (
    <main className="h-[calc(100vh-64px)] overflow-hidden">
      <ExploreLayout />
    </main>
  );
}
