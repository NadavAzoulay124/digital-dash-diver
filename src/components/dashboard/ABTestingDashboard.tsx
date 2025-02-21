
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ABTest } from "./types";
import { FacebookConnectForm } from "./FacebookConnectForm";
import { FacebookCampaigns } from "./FacebookCampaigns";
import { CreateTestForm } from "./CreateTestForm";
import { TestResults } from "./TestResults";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ABTestingDashboard = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [newTest, setNewTest] = useState({
    testType: "campaign" as ABTest["testType"],
    campaignName: "",
    variantA: "",
    variantB: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the A/B Testing Dashboard",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
  };

  const { data: facebookData, isLoading, error } = useQuery({
    queryKey: ['facebook-campaigns'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: hasCredentials, error: credError } = await supabase
        .from('facebook_ads_credentials')
        .select('id')
        .single();

      if (credError) {
        console.error('Error checking credentials:', credError);
        throw new Error('Failed to check Facebook credentials');
      }

      if (!hasCredentials) {
        return { data: [] };
      }

      const response = await supabase.functions.invoke('facebook-ads', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      return response.data || { data: [] };
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching Facebook campaigns:', error);
        if (error.message === 'Not authenticated') {
          navigate("/auth");
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to fetch Facebook campaigns",
            variant: "destructive",
          });
        }
      }
    }
  });

  const handleCreateTest = () => {
    const test: ABTest = {
      id: Date.now().toString(),
      ...newTest,
      startDate: new Date().toISOString().split('T')[0],
      status: "running",
      results: {
        variantA: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
        },
        variantB: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
        },
      },
    };

    setTests([test, ...tests]);
    setNewTest({
      testType: "campaign",
      campaignName: "",
      variantA: "",
      variantB: "",
    });
    toast({
      title: "Success",
      description: "A/B test created successfully",
    });
  };

  const handleStatusChange = (id: string, status: "running" | "completed") => {
    setTests(tests.map(t => 
      t.id === id ? { ...t, status } : t
    ));
  };

  return (
    <div className="space-y-6">
      <FacebookConnectForm />

      {isLoading ? (
        <div className="text-center">Loading Facebook campaigns...</div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading Facebook campaigns. Please check your credentials and try again.
          </AlertDescription>
        </Alert>
      ) : facebookData ? (
        <FacebookCampaigns campaigns={facebookData.data || []} />
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connect your Facebook Ads account to see your campaigns here.
          </AlertDescription>
        </Alert>
      )}

      <CreateTestForm
        newTest={newTest}
        setNewTest={setNewTest}
        onCreateTest={handleCreateTest}
      />

      {tests.map((test) => (
        <TestResults
          key={test.id}
          test={test}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};
