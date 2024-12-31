import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Users, TrendingUp, Mail, Share2 } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Marketing Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Visitors"
                value="24.7K"
                change="+12.5%"
                isPositive={true}
                icon={Users}
              />
              <MetricCard
                title="Conversion Rate"
                value="3.2%"
                change="+2.1%"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Email Opens"
                value="8.9K"
                change="-0.4%"
                isPositive={false}
                icon={Mail}
              />
              <MetricCard
                title="Social Shares"
                value="1.2K"
                change="+8.1%"
                isPositive={true}
                icon={Share2}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignChart />
              </div>
              <div>
                <RecentActivity />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;