"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, WashingMachine, Shirt } from "lucide-react";

export function DashboardBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg md:p-8">
      {/* Decorative Background Elements */}
      <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      {/* Floating Icons Animation */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 hidden md:block animate-pulse">
        <WashingMachine className="h-32 w-32 text-white" />
      </div>
      <div className="absolute right-32 top-10 opacity-10 hidden md:block animate-bounce duration-3000">
        <Sparkles className="h-16 w-16 text-white" />
      </div>
      <div className="absolute right-48 bottom-10 opacity-10 hidden md:block animate-pulse duration-4000">
        <Shirt className="h-20 w-20 text-white" />
      </div>

      <div className="relative z-10 flex max-w-2xl flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium w-fit backdrop-blur-md">
            <Sparkles className="h-3 w-3" />
            <span>Smart Laundry Management</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome back, Admin!
          </h1>
          <p className="text-blue-100 md:text-lg">
            Monitor your laundry business performance, track transactions, and
            manage inventory efficiently in one place.
          </p>
        </div>
      </div>
    </div>
  );
}
