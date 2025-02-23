
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { FacebookConnectForm } from "@/components/dashboard/facebook/FacebookConnectForm";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ClientOnboarding } from "@/components/dashboard/ClientOnboarding";
import { ContractCreation } from "@/components/dashboard/ContractCreation";
import { ContractsList } from "@/components/dashboard/contract/ContractsList";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { ignoredTasks } from "@/data/mockTasks";
import { GoogleConnectForm } from "@/components/dashboard/google/GoogleConnectForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const mockFinancialData = [
  { month: "Jan", income: 4000, expenses: 2400 },
  { month: "Feb", income: 3000, expenses: 1398 },
  { month: "Mar", income: 2000, expenses: 9800 },
  { month: "Apr", income: 2780, expenses: 3908 },
  { month: "May", income: 1890, expenses: 4800 },
  { month: "Jun", income: 2390, expenses: 3800 },
  { month: "Jul", income: 3490, expenses: 4300 },
];

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      if (!code) {
        toast({
          title: "Error",
          description: "No authorization code received",
          variant: "destructive",
        });
        navigate("/agency");
        return;
      }

      try {
        console.log("Exchanging code for tokens...");
        const response = await supabase.functions.invoke('google-ads-auth', {
          body: { code }
        });

        if (response.error) {
          console.error('OAuth callback error:', response.error);
          throw new Error(response.error.message);
        }

        console.log("OAuth callback response:", response.data);
        
        toast({
          title: "Success",
          description: "Successfully connected to Google Ads",
        });
      } catch (error) {
        console.error("OAuth callback error:", error);
        toast({
          title: "Error",
          description: "Failed to complete Google Ads connection",
          variant: "destructive",
        });
      } finally {
        navigate("/agency");
      }
    };

    handleCallback();
  }, [searchParams, toast, navigate]);

  return null;
};

const AgencyDashboard = () => {
  return (
    <Routes>
      <Route
        path="oauth/callback"
        element={<GoogleOAuthCallback />}
      />
      <Route
        index
        element={
          <div className="space-y-8 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <MetricsOverview />
              <FinancialOverview data={mockFinancialData} />
            </div>
            <FacebookConnectForm />
            <GoogleConnectForm />
            <div className="grid gap-6 md:grid-cols-2">
              <CampaignChart />
              <CampaignInsights />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-primary mb-6">Employee Task Management</h2>
              <TaskBoard tasks={ignoredTasks} />
            </div>
            <div className="grid gap-6 md:grid-cols-2 bg-gray-50 p-6 rounded-lg shadow-sm">
              <ClientOnboarding />
              <div className="flex flex-col justify-center items-center space-y-4">
                <h2 className="text-xl font-semibold text-primary">Contract Management</h2>
                <ContractCreation />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              <ContractsList />
            </div>
            <LeadsBoard />
          </div>
        }
      />
    </Routes>
  );
};

export default AgencyDashboard;
