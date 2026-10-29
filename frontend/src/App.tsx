import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import TripInputs from "./pages/TripInputs";
import Suggestions from "./pages/Suggestions";
import TripPlan from "./pages/TripPlan";
import NotFound from "./pages/NotFound";
import Destinations from "./pages/Destinations";
import Activities from "./pages/Activities";
import Reviews from "./pages/Reviews";
import MyTrips from "./pages/MyTrips";
import ErrorBoundary from "./components/ErrorBoundary";
import AiConciergeDrawer from "./components/agent/AiConciergeDrawer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/plan" element={<TripInputs />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/trip-plan" element={<TripPlan />} />
            <Route path="/trip/:id" element={<TripPlan />} />
            <Route path="/trip/share/:shareId" element={<TripPlan />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/my-trips" element={<MyTrips />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
        {/* Global 24/7 AI Concierge Drawer available on all pages */}
        <AiConciergeDrawer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
