import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ABTest {
  id: string;
  testType: "campaign" | "ad_group" | "ad" | "budget";
  campaignName: string;
  variantA: string;
  variantB: string;
  startDate: string;
  status: "running" | "completed";
  results: {
    variantA: {
      impressions: number;
      clicks: number;
      conversions: number;
    };
    variantB: {
      impressions: number;
      clicks: number;
      conversions: number;
    };
  };
}

interface FacebookCredentials {
  ad_account_id: string;
  access_token: string;
}

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
    onError: (error) => {
      console.error('Error fetching Facebook campaigns:', error);
      if (error.message === 'Not authenticated') {
        navigate("/auth");
      }
    }
  });

  const handleConnectFacebook = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to connect your Facebook account",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase
        .from('facebook_ads_credentials')
        .upsert({
          user_id: session.user.id,
          ad_account_id: credentials.ad_account_id,
          access_token: credentials.access_token,
        });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Facebook account connected successfully",
      });
    } catch (error) {
      console.error('Error connecting Facebook account:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTestTypeLabel = (type: ABTest["testType"]) => {
    switch (type) {
      case "campaign":
        return "Campaign";
      case "ad_group":
        return "Ad Group";
      case "ad":
        return "Ad";
      case "budget":
        return "Budget";
      default:
        return type;
    }
  };

  const getPlaceholderText = (type: ABTest["testType"]) => {
    switch (type) {
      case "campaign":
        return {
          variantA: "Original Campaign",
          variantB: "New Campaign",
        };
      case "ad_group":
        return {
          variantA: "Original Ad Group",
          variantB: "New Ad Group",
        };
      case "ad":
        return {
          variantA: "Original Ad",
          variantB: "New Ad",
        };
      case "budget":
        return {
          variantA: "Original Budget",
          variantB: "New Budget",
        };
    }
  };

  const handleCreateTest = () => {
    if (!newTest.campaignName || !newTest.variantA || !newTest.variantB || !newTest.testType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

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

  const getConversionRate = (clicks: number, conversions: number) => {
    return ((conversions / clicks) * 100).toFixed(1) + "%";
  };

  const getClickThroughRate = (impressions: number, clicks: number) => {
    return ((clicks / impressions) * 100).toFixed(1) + "%";
  };

  const getChartData = (test: ABTest) => [
    {
      name: "Click-through Rate",
      "Variant A": parseFloat(getClickThroughRate(test.results.variantA.impressions, test.results.variantA.clicks)),
      "Variant B": parseFloat(getClickThroughRate(test.results.variantB.impressions, test.results.variantB.clicks)),
    },
    {
      name: "Conversion Rate",
      "Variant A": parseFloat(getConversionRate(test.results.variantA.clicks, test.results.variantA.conversions)),
      "Variant B": parseFloat(getConversionRate(test.results.variantB.clicks, test.results.variantB.conversions)),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect Facebook Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ad Account ID</Label>
                <Input
                  placeholder="Enter your Facebook Ad Account ID"
                  value={credentials.ad_account_id}
                  onChange={(e) => setCredentials(prev => ({ ...prev, ad_account_id: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Access Token</Label>
                <Input
                  type="password"
                  placeholder="Enter your Facebook Access Token"
                  value={credentials.access_token}
                  onChange={(e) => setCredentials(prev => ({ ...prev, access_token: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleConnectFacebook} className="w-full">
              Connect Facebook Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading Facebook campaigns...</div>
          </CardContent>
        </Card>
      ) : facebookData ? (
        <div className="space-y-6">
          {facebookData.data.map((campaign: any) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>{campaign.name}</span>
                    <Badge variant="outline">{campaign.objective}</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Status</TableCell>
                      <TableCell>{campaign.status}</TableCell>
                    </TableRow>
                    {campaign.insights && campaign.insights.data[0] && (
                      <>
                        <TableRow>
                          <TableCell>Impressions</TableCell>
                          <TableCell>{campaign.insights.data[0].impressions}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Clicks</TableCell>
                          <TableCell>{campaign.insights.data[0].clicks}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Conversions</TableCell>
                          <TableCell>{campaign.insights.data[0].conversions}</TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create New A/B Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Type</Label>
                <Select
                  value={newTest.testType}
                  onValueChange={(value: ABTest["testType"]) => {
                    setNewTest({
                      ...newTest,
                      testType: value,
                      variantA: "",
                      variantB: "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select test type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="campaign">Campaign</SelectItem>
                    <SelectItem value="ad_group">Ad Group</SelectItem>
                    <SelectItem value="ad">Ad</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campaign Name</Label>
                <Input
                  placeholder="Campaign Name"
                  value={newTest.campaignName}
                  onChange={(e) => setNewTest({ ...newTest, campaignName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Variant A</Label>
                <Input
                  placeholder={getPlaceholderText(newTest.testType).variantA}
                  value={newTest.variantA}
                  onChange={(e) => setNewTest({ ...newTest, variantA: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Variant B</Label>
                <Input
                  placeholder={getPlaceholderText(newTest.testType).variantB}
                  value={newTest.variantB}
                  onChange={(e) => setNewTest({ ...newTest, variantB: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleCreateTest} className="w-full">
              Create A/B Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {tests.map((test) => (
        <Card key={test.id}>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>{test.campaignName}</span>
                <Badge variant="outline">{getTestTypeLabel(test.testType)}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>{test.variantA}</TableHead>
                      <TableHead>{test.variantB}</TableHead>
                      <TableHead>Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Impressions</TableCell>
                      <TableCell>{test.results.variantA.impressions}</TableCell>
                      <TableCell>{test.results.variantB.impressions}</TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Clicks</TableCell>
                      <TableCell>{test.results.variantA.clicks}</TableCell>
                      <TableCell>{test.results.variantB.clicks}</TableCell>
                      <TableCell>
                        {((test.results.variantB.clicks - test.results.variantA.clicks) / test.results.variantA.clicks * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Conversions</TableCell>
                      <TableCell>{test.results.variantA.conversions}</TableCell>
                      <TableCell>{test.results.variantB.conversions}</TableCell>
                      <TableCell>
                        {((test.results.variantB.conversions - test.results.variantA.conversions) / test.results.variantA.conversions * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Click-through Rate</TableCell>
                      <TableCell>
                        {getClickThroughRate(test.results.variantA.impressions, test.results.variantA.clicks)}
                      </TableCell>
                      <TableCell>
                        {getClickThroughRate(test.results.variantB.impressions, test.results.variantB.clicks)}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Conversion Rate</TableCell>
                      <TableCell>
                        {getConversionRate(test.results.variantA.clicks, test.results.variantA.conversions)}
                      </TableCell>
                      <TableCell>
                        {getConversionRate(test.results.variantB.clicks, test.results.variantB.conversions)}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData(test)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Variant A" fill="#0073ea" />
                    <Bar dataKey="Variant B" fill="#00c875" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Select
                value={test.status}
                onValueChange={(value: "running" | "completed") => {
                  setTests(tests.map(t => 
                    t.id === test.id ? { ...t, status: value } : t
                  ));
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
