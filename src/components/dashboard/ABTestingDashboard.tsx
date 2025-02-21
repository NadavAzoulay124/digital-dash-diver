
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ABTest, FacebookCredentials } from "./types";
import { FacebookConnectForm } from "./FacebookConnectForm";
import { FacebookCampaigns } from "./FacebookCampaigns";
import { CreateTestForm } from "./CreateTestForm";
import { TestResults } from "./TestResults";

export const ABTestingDashboard = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [newTest, setNewTest] = useState({
    testType: "campaign" as ABTest["testType"],
    campaignName: "",
    variantA: "",
    variantB: "",
  });
  const [credentials, setCredentials] = useState<FacebookCredentials>({
    ad_account_id: "",
    access_token: "",
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

  const { data: facebookData, isLoading } = useQuery({
    queryKey: ['facebook-campaigns'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('facebook-ads', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    enabled: true,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching Facebook campaigns:', error);
        if (error.message === 'Not authenticated') {
          navigate("/auth");
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
      <FacebookConnectForm 
        credentials={credentials}
        setCredentials={setCredentials}
      />

      {isLoading ? (
        <div className="text-center">Loading Facebook campaigns...</div>
      ) : facebookData ? (
        <FacebookCampaigns campaigns={facebookData.data} />
      ) : null}

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
