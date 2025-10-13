"use client";

import { RampProvider } from "@/components/RampProvider";
import { CDPHooksProvider } from "@coinbase/cdp-hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <CDPHooksProvider
        config={{
          projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID!,
          ethereum: {
            createOnLogin: "smart",
          },
          debugging: false,
        }}
      >
         <RampProvider>{children}</RampProvider>
      </CDPHooksProvider>
    </QueryClientProvider>
  );
}
