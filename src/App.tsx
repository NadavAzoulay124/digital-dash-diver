import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
        <nav className="bg-primary p-4 text-white">
          <div className="max-w-7xl mx-auto flex gap-4">
            <Link to="/agency" className="hover:text-primary-foreground/80">
              Agency Dashboard
            </Link>
            <Link to="/client" className="hover:text-primary-foreground/80">
              Client Dashboard
            </Link>
            <Link to="/employee" className="hover:text-primary-foreground/80">
              Employee Dashboard
            </Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AgencyDashboard />} />
          <Route path="/agency/*" element={<AgencyDashboard />} />
          <Route path="/client/*" element={<ClientDashboard />} />
          <Route path="/employee/*" element={<EmployeeDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;