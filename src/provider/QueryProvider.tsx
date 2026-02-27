"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Non-aggressive defaults to prevent Fail2Ban blocks
            retry: 1, // Only retry once on failure
            refetchOnWindowFocus: false, // Don't refetch when switching tabs
            staleTime: 0, // Data is considered stale immediately
            gcTime: 1000 * 60 * 5, // Cache is kept for 5 minutes
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
  );
}
