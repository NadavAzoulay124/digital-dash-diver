import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { Users, DollarSign, Target, ListChecks } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks">Task Management</TabsTrigger>
                <TabsTrigger value="invoices">Invoices & Payments</TabsTrigger>
                <TabsTrigger value="leads">Lead Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tasks">
                <TaskBoard />
              </TabsContent>

              <TabsContent value="invoices">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoices & Payments</CardTitle>
                    <CardDescription>Manage your client invoices and track payments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        Invoice management features are currently in development
                      </p>
                      <Button variant="outline">Create New Invoice</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leads">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Management</CardTitle>
                    <CardDescription>Track and manage incoming leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-8">
                      <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                      <p className="text-muted-foreground mb-4">
                        CRM features are currently in development
                      </p>
                      <Button variant="outline">Add New Lead</Button>
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