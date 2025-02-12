
import { ClipboardList, Target, FileText, Receipt, UserPlus } from "lucide-react";

interface DashboardNavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const DashboardNavigation = ({ currentView, setCurrentView }: DashboardNavigationProps) => {
  return (
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
  );
};
