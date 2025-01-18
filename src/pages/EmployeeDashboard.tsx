import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";

const EmployeeDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="employee" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">My Workspace</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Hours Logged"
                value="164h"
                change="+8h"
                isPositive={true}
                icon={Clock}
              />
              <MetricCard
                title="Tasks Completed"
                value="24"
                change="+6"
                isPositive={true}
                icon={CheckCircle2}
              />
              <MetricCard
                title="Pending Reviews"
                value="5"
                change="-2"
                isPositive={true}
                icon={AlertCircle}
              />
              <MetricCard
                title="Upcoming Deadlines"
                value="8"
                change="+1"
                isPositive={false}
                icon={Calendar}
              />
            </div>

            <TaskBoard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;