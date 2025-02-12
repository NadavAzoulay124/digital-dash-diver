
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { LeadManagement } from "@/components/dashboard/LeadManagement";
import { ContractCreation } from "@/components/dashboard/ContractCreation";
import { InvoiceManagement } from "@/components/dashboard/InvoiceManagement";
import { ClientOnboarding } from "@/components/dashboard/ClientOnboarding";
import { OnboardingProgress } from "@/components/dashboard/OnboardingProgress";
import { ignoredTasks } from "@/data/mockTasks";

interface DashboardViewProps {
  currentView: string;
}

export const DashboardView = ({ currentView }: DashboardViewProps) => {
  switch (currentView) {
    case 'tasks':
      return <TaskBoard tasks={ignoredTasks} />;
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
      return <TaskBoard tasks={ignoredTasks} />;
  }
};
