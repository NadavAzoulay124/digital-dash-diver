
import { Home, BarChart2, Users, Mail, Settings, ListChecks, Calendar, FileText, Target, Briefcase, TestTube } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = {
  agency: [
    { icon: Home, label: "Overview", path: "/agency" },
    { icon: Users, label: "Clients", path: "/agency/clients" },
    { icon: Briefcase, label: "Projects", path: "/agency/projects" },
    { icon: BarChart2, label: "Analytics", path: "/agency/analytics" },
    { icon: Settings, label: "Settings", path: "/agency/settings" },
  ],
  client: [
    { icon: Home, label: "Overview", path: "/client" },
    { icon: Target, label: "Campaigns", path: "/client/campaigns" },
    { icon: BarChart2, label: "Performance", path: "/client/performance" },
    { icon: FileText, label: "Reports", path: "/client/reports" },
    { icon: Settings, label: "Settings", path: "/client/settings" },
  ],
  employee: [
    { icon: Home, label: "Client Contact Management", path: "/employee" },
    { icon: ListChecks, label: "Task Management", path: "/employee/tasks" },
    { icon: Calendar, label: "Lead Schedule", path: "/employee/schedule" },
    { icon: Mail, label: "AI Chat Assistant", path: "/employee/messages" },
    { icon: TestTube, label: "A/B Testing", path: "/employee/ab-testing" },
    { icon: Settings, label: "Client Analytics & Settings", path: "/employee/settings" },
  ],
};

interface DashboardSidebarProps {
  role: "agency" | "client" | "employee";
}

export const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const items = menuItems[role];
  const navigate = useNavigate();
  const location = useLocation();
  const titles = {
    agency: "Agency Hub",
    client: "Client Portal",
    employee: "Employee Portal"
  };

  const isPathActive = (path: string) => {
    if (path === `/${role}` && location.pathname === path) {
      return true;
    }
    if (path !== `/${role}` && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-6">
          <h1 className="text-xl font-bold">{titles[role]}</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton 
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "transition-colors hover:text-primary",
                      isPathActive(item.path) && "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
