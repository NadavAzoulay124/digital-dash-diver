
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { LeadManagement } from "@/components/dashboard/LeadManagement";
import { ContractCreation } from "@/components/dashboard/ContractCreation";
import { InvoiceManagement } from "@/components/dashboard/InvoiceManagement";
import { LeadStatusSummary } from "@/components/dashboard/LeadStatusSummary";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { ClientOnboarding } from "@/components/dashboard/ClientOnboarding";
import { OnboardingProgress } from "@/components/dashboard/OnboardingProgress";
import { Users, DollarSign, Target, ListChecks, ClipboardList, UserPlus, FileText, Receipt, AlertTriangle } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Mock data for ignored tasks
const ignoredTasks = [
  {
    id: 1,
    employee: "John Doe",
    task: "Client feedback implementation",
    lastUpdated: "2024-02-15",
    daysIgnored: 10,
  },
  {
    id: 2,
    employee: "Jane Smith",
    task: "Website optimization",
    lastUpdated: "2024-02-20",
    daysIgnored: 8,
  },
  {
    id: 3,
    employee: "Mike Johnson",
    task: "Social media content calendar",
    lastUpdated: "2024-02-18",
    daysIgnored: 9,
  }
];

const AgencyDashboard = () => {
  const [currentView, setCurrentView] = useState('tasks');
  const [showIgnoredTasks, setShowIgnoredTasks] = useState(false);

  useEffect(() => {
    // Check for ignored tasks and show notification
    const significantlyIgnoredTasks = ignoredTasks.filter(task => task.daysIgnored > 14);
    
    if (significantlyIgnoredTasks.length > 0) {
      toast.warning(`${significantlyIgnoredTasks.length} tasks have been ignored for over 2 weeks`, {
        action: {
          label: "View Tasks",
          onClick: () => setShowIgnoredTasks(true),
        },
      });
    }
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'tasks':
        return (
          <>
            {showIgnoredTasks && (
              <div className="mb-8">
                <Alert variant="warning" className="bg-warning/10 border-warning">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <AlertTitle>Ignored Tasks Requiring Attention</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      {ignoredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white p-4 rounded-lg border border-warning/20"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{task.task}</h4>
                              <p className="text-sm text-muted-foreground">
                                Assigned to: {task.employee}
                              </p>
                            </div>
                            <span className="text-warning text-sm font-medium">
                              {task.daysIgnored} days without updates
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <TaskBoard />
          </>
        );
      case 'leads':
        return <LeadManagement />;
      case 'contracts':
        return (
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
        );
      case 'invoices':
        return (
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
        );
      case 'onboarding':
        return (
          <div className="space-y-8">
            <ClientOnboarding />
            <OnboardingProgress />
          </div>
        );
      default:
        return <TaskBoard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <aside className="w-64 bg-card border-r border-border">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setCurrentView('tasks')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'tasks' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              Task Management
            </button>
            <button
              onClick={() => setCurrentView('leads')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'leads' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <Target className="w-4 h-4" />
              Lead Management
            </button>
            <button
              onClick={() => setCurrentView('contracts')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'contracts' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <FileText className="w-4 h-4" />
              Contracts
            </button>
            <button
              onClick={() => setCurrentView('invoices')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'invoices' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <Receipt className="w-4 h-4" />
              Invoices
            </button>
            <button
              onClick={() => setCurrentView('onboarding')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'onboarding' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Client Onboarding
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Agency Overview</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <LeadStatusSummary />
              </div>
              <div>
                <ClientLeadStats />
              </div>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgencyDashboard;
