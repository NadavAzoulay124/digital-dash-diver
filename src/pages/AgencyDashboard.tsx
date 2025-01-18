import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { Users, TrendingUp, Mail, Share2, DollarSign } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const AgencyDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="agency" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Agency Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Revenue"
                value="$124.5K"
                change="+15.2%"
                isPositive={true}
                icon={DollarSign}
              />
              <MetricCard
                title="Active Clients"
                value="48"
                change="+4"
                isPositive={true}
                icon={Users}
              />
              <MetricCard
                title="Projects"
                value="156"
                change="+12"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Team Members"
                value="24"
                change="+2"
                isPositive={true}
                icon={Users}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CampaignChart />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>

            <TaskBoard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgencyDashboard;