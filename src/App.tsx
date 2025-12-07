import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/Tooltip";
import { router } from "./router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "./features/auth/store";
import { setAccessToken } from "./api/client";

const App: React.FC = () => {
  // Restore accessToken from persisted store on app load
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, [accessToken]);
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="coffee-theme">
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <TooltipProvider>
              <RouterProvider router={router} />
              <Toaster />
            </TooltipProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
