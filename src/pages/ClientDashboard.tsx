import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { ClientTaskRequest } from "@/components/dashboard/ClientTaskRequest";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const ClientDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="client" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Client Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Spent"
                value="$12,450"
                change="+8.1%"
                isPositive={true}
                icon={DollarSign}
              />
              <MetricCard
                title="ROAS"
                value="3.2x"
                change="+0.4x"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Leads"
                value="145"
                change="+12"
                isPositive={true}
                icon={Users}
              />
              <MetricCard
                title="Conversion Rate"
                value="2.8%"
                change="+0.3%"
                isPositive={true}
                icon={Target}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CampaignChart />
              </div>
              <div>
                <ClientLeadStats />
              </div>
            </div>

            <ClientTaskRequest />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;