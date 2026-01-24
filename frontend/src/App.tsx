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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plan" element={<TripInputs />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/trip-plan" element={<TripPlan />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/activities" element={<Activities />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
