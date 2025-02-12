
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
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-dashboard-background">
          <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-primary">Agency OS</span>
                </div>
                <div className="flex items-center space-x-4">
                  <NavLink 
                    to="/agency" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-primary bg-primary/5' 
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                    end
                  >
                    Agency Dashboard
                  </NavLink>
                  <NavLink 
                    to="/client" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-primary bg-primary/5' 
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                    end
                  >
                    Client Dashboard
                  </NavLink>
                  <NavLink 
                    to="/employee" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-primary bg-primary/5' 
                          : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`
                    }
                    end
                  >
                    Employee Dashboard
                  </NavLink>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<AgencyDashboard />} />
              <Route path="/agency/*" element={<AgencyDashboard />} />
              <Route path="/client/*" element={<ClientDashboard />} />
              <Route path="/employee/*" element={<EmployeeDashboard />} />
            </Routes>
          </main>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
