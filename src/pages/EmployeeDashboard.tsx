import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { ClientContactLog } from "@/components/dashboard/ClientContactLog";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { ConversationSummary } from "@/components/dashboard/ConversationSummary";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EmployeeDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="employee" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Employee Dashboard</h1>
            
            <Tabs defaultValue="tasks" className="space-y-6">
              <TabsList>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="contacts">Client Contacts</TabsTrigger>
                <TabsTrigger value="conversations">Conversation Summary</TabsTrigger>
                <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <TaskBoard />
              </TabsContent>

              <TabsContent value="contacts">
                <ClientContactLog />
              </TabsContent>

              <TabsContent value="conversations">
                <ConversationSummary />
              </TabsContent>

              <TabsContent value="assistant">
                <AIAssistant />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EmployeeDashboard;