
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { ClientContactDashboard } from "@/components/dashboard/ClientContactDashboard";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { ClientInsights } from "@/components/dashboard/ClientInsights";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ignoredTasks } from "@/data/mockTasks";

const EmployeeDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="employee" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Employee Dashboard</h1>
            
            <Tabs defaultValue="contacts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="contacts">Client Contacts</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="leads">Campaign Leads</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
                <TabsTrigger value="insights">Client Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts">
                <ClientContactDashboard />
              </TabsContent>

              <TabsContent value="tasks">
                <TaskBoard tasks={ignoredTasks} />
              </TabsContent>

              <TabsContent value="leads">
                <LeadsBoard />
              </TabsContent>

              <TabsContent value="assistant">
                <AIAssistant />
              </TabsContent>

              <TabsContent value="insights">
                <ClientInsights />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;
