
import { Routes, Route } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { ClientContactDashboard } from "@/components/dashboard/ClientContactDashboard";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { ClientInsights } from "@/components/dashboard/ClientInsights";
import { ABTestingDashboard } from "@/components/dashboard/ABTestingDashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ignoredTasks } from "@/data/mockTasks";
import { FacebookConnectForm } from "@/components/dashboard/facebook/FacebookConnectForm";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";

const EmployeeDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="employee" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">Client Contact Management</h1>
                  <div className="space-y-8">
                    <FacebookConnectForm />
                    <MetricsOverview />
                  </div>
                  <ClientContactDashboard />
                </>
              } />
              <Route path="/tasks" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">Task Management</h1>
                  <TaskBoard tasks={ignoredTasks} />
                </>
              } />
              <Route path="/schedule" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">Lead Schedule</h1>
                  <LeadsBoard />
                </>
              } />
              <Route path="/messages" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">AI Chat Assistant</h1>
                  <AIAssistant />
                </>
              } />
              <Route path="/settings" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">Client Analytics & Settings</h1>
                  <ClientInsights />
                </>
              } />
              <Route path="/ab-testing" element={
                <>
                  <h1 className="text-2xl font-bold mb-8">A/B Testing Dashboard</h1>
                  <ABTestingDashboard />
                </>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;
