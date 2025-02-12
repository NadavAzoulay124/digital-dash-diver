
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LeadStatusSummary } from "@/components/dashboard/LeadStatusSummary";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";

const AgencyDashboard = () => {
  const [currentView, setCurrentView] = useState('tasks');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <aside className="w-64 bg-card border-r border-border">
          <DashboardNavigation currentView={currentView} setCurrentView={setCurrentView} />
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Agency Overview</h1>
            </div>
            
            <MetricsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LeadStatusSummary />
              </div>
              <div>
                <ClientLeadStats />
              </div>
            </div>

            <DashboardView currentView={currentView} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgencyDashboard;
