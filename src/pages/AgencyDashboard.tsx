import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { LeadManagement } from "@/components/dashboard/LeadManagement";
import { ContractCreation } from "@/components/dashboard/ContractCreation";
import { InvoiceManagement } from "@/components/dashboard/InvoiceManagement";
import { LeadStatusSummary } from "@/components/dashboard/LeadStatusSummary";
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AgencyDashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="agency" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Agency Overview</h1>
              <div className="space-x-4">
                <ContractCreation />
                <InvoiceManagement />
              </div>
            </div>
            
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
                title="New Leads"
                value="156"
                change="+12"
                isPositive={true}
                icon={Target}
              />
              <MetricCard
                title="Open Tasks"
                value="24"
                change="+2"
                isPositive={false}
                icon={ListChecks}
              />
            </div>

            <div className="mb-8">
              <LeadStatusSummary />
            </div>

            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks">Task Management</TabsTrigger>
                <TabsTrigger value="leads">Lead Management</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <TaskBoard />
              </TabsContent>

              <TabsContent value="leads">
                <LeadManagement />
              </TabsContent>

              <TabsContent value="contracts">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Management</CardTitle>
                    <CardDescription>Create and manage client contracts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <ContractCreation />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Management</CardTitle>
                    <CardDescription>Create and manage client invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <InvoiceManagement />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgencyDashboard;