import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GeolocationProvider } from "@/context/GeolocationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminUnits from "./pages/AdminUnits";
import AdminCareers from "./pages/AdminCareers";
import Careers from "./pages/Careers";
import InvestorPage from "./pages/Investor";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <HelmetProvider>
            <GeolocationProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin/units" element={<AdminUnits />} />
                <Route path="/admin/careers" element={<AdminCareers />} />
                <Route path="/trabalhe-conosco" element={<Careers />} />
                <Route path="/seja-um-investidor" element={<InvestorPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </GeolocationProvider>
          </HelmetProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
