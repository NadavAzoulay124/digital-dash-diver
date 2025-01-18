import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { Target, TrendingUp, Mail, Share2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const ClientDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="client" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Project Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Campaign ROI"
                value="324%"
                change="+12.5%"
                isPositive={true}
                icon={Target}
              />
              <MetricCard
                title="Engagement Rate"
                value="8.2%"
                change="+2.1%"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Email Performance"
                value="42%"
                change="+5.4%"
                isPositive={true}
                icon={Mail}
              />
              <MetricCard
                title="Social Reach"
                value="45.2K"
                change="+8.1%"
                isPositive={true}
                icon={Share2}
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

export default ClientDashboard;