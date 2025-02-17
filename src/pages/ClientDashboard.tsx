import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { ClientTaskRequest } from "@/components/dashboard/ClientTaskRequest";
import { ClientLeadStats } from "@/components/dashboard/ClientLeadStats";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LeadComment {
  id: string;
  comment: string;
  category: "distance" | "scheduling" | "pricing" | "other";
  date: string;
}

const ClientDashboard = () => {
  const [newComment, setNewComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("other");
  const { toast } = useToast();

  const handleDateChange = (startDate: Date | undefined, endDate: Date | undefined) => {
    console.log('Date range changed:', { startDate, endDate });
  };

  const handleAddComment = (leadId: string) => {
    if (!newComment) return;

    // In a real app, this would be an API call to save the comment
    console.log('Adding comment:', {
      leadId,
      comment: newComment,
      category: selectedCategory,
      date: new Date().toISOString()
    });

    toast({
      title: "Comment Added",
      description: "Your comment has been saved successfully.",
    });

    setNewComment("");
    setSelectedCategory("other");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-dashboard-background">
        <DashboardSidebar role="client" />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Client Overview</h1>
              <DateRangeFilter onDateChange={handleDateChange} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Spent"
                value="$12,450"
                change="+8.1%"
                isPositive={true}
                icon={DollarSign}
              />
              <MetricCard
                title="ROAS"
                value="3.2x"
                change="+0.4x"
                isPositive={true}
                icon={TrendingUp}
              />
              <MetricCard
                title="Total Leads"
                value="145"
                change="+12"
                isPositive={true}
                icon={Users}
              />
              <MetricCard
                title="Conversion Rate"
                value="2.8%"
                change="+0.3%"
                isPositive={true}
                icon={Target}
              />
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add Comment to Lead</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment about this lead..."
                      className="min-h-[100px]"
                    />
                    <div className="space-y-4">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select comment category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Distance Issue</SelectItem>
                          <SelectItem value="scheduling">Scheduling Problem</SelectItem>
                          <SelectItem value="pricing">Pricing Concern</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => handleAddComment("current-lead-id")} 
                        className="w-full"
                      >
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <CampaignChart />
              </div>
              <div>
                <ClientLeadStats />
              </div>
            </div>

            <div className="mb-8">
              <CampaignInsights />
            </div>

            <div className="mb-8">
              <LeadsBoard />
            </div>

            <ClientTaskRequest />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ClientDashboard;
