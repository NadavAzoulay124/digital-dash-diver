import { Home, BarChart2, Users, Mail, Settings, ListChecks, Calendar, FileText, Target, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
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
    { icon: Home, label: "Overview", path: "/agency", active: true },
    { icon: Users, label: "Clients", path: "/clients" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  client: [
    { icon: Home, label: "Overview", path: "/client", active: true },
    { icon: Target, label: "Campaigns", path: "/campaigns" },
    { icon: BarChart2, label: "Performance", path: "/performance" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
  employee: [
    { icon: Home, label: "Overview", path: "/employee", active: true },
    { icon: ListChecks, label: "Tasks", path: "/tasks" },
    { icon: Calendar, label: "Schedule", path: "/schedule" },
    { icon: Mail, label: "Messages", path: "/messages" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ],
};

interface DashboardSidebarProps {
  role: "agency" | "client" | "employee";
}

export const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const items = menuItems[role];
  const titles = {
    agency: "Agency Hub",
    client: "Client Portal",
    employee: "Employee Portal"
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
                  <SidebarMenuButton className={cn(
                    item.active && "bg-primary/10 text-primary"
                  )}>
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