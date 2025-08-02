import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Campaigns = lazy(() => import("./pages/Metrics"));
const Insights = lazy(() => import("./pages/Insights"));
const Performance = lazy(() => import("./pages/Alerts"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const PageSuspense = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardSkeleton />}>
    {children}
  </Suspense>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-gradient-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-14 flex items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-50">
                    <SidebarTrigger />
                    <ThemeToggle />
                  </header>
                  <main className="flex-1 p-6 overflow-auto scroll-smooth">
                    <Routes>
                      <Route path="/" element={
                        <PageSuspense>
                          <Index />
                        </PageSuspense>
                      } />
                      <Route path="/metrics" element={
                        <PageSuspense>
                          <Campaigns />
                        </PageSuspense>
                      } />
                      <Route path="/insights" element={
                        <PageSuspense>
                          <Insights />
                        </PageSuspense>
                      } />
                      <Route path="/alerts" element={
                        <PageSuspense>
                          <Performance />
                        </PageSuspense>
                      } />
                      <Route path="/settings" element={
                        <PageSuspense>
                          <Settings />
                        </PageSuspense>
                      } />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={
                        <PageSuspense>
                          <NotFound />
                        </PageSuspense>
                      } />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
