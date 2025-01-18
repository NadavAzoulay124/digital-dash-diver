import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AgencyDashboard from "./pages/AgencyDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AgencyDashboard />} />
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;