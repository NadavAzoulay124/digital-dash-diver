import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
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
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `hover:text-primary-foreground/80 ${isActive ? 'font-bold' : ''}`
              }
            >
              Agency Dashboard
            </NavLink>
            <NavLink 
              to="/client" 
              className={({ isActive }) => 
                `hover:text-primary-foreground/80 ${isActive ? 'font-bold' : ''}`
              }
            >
              Client Dashboard
            </NavLink>
            <NavLink 
              to="/employee" 
              className={({ isActive }) => 
                `hover:text-primary-foreground/80 ${isActive ? 'font-bold' : ''}`
              }
            >
              Employee Dashboard
            </NavLink>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<AgencyDashboard />} />
          <Route path="/client/*" element={<ClientDashboard />} />
          <Route path="/employee/*" element={<EmployeeDashboard />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;