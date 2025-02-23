
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useFacebookAccounts } from "@/hooks/useFacebookAccounts";

export const useFacebookMetrics = () => {
  const { toast } = useToast();
  const { getSelectedAccount: getSelectedFacebookAccount } = useFacebookAccounts();
  const selectedFacebookAccount = getSelectedFacebookAccount();

  return useQuery({
    queryKey: ['facebook-campaigns-metrics', selectedFacebookAccount?.id],
    queryFn: async () => {
      if (!selectedFacebookAccount) {
        console.log('No Facebook account selected');
        return { data: [] };
      }

      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      
      const endDateStr = format(endDate, 'yyyy-MM-dd');
      const startDateStr = format(startDate, 'yyyy-MM-dd');
      
      console.log('Fetching Facebook campaigns with credentials:', {
        adAccountId: selectedFacebookAccount.ad_account_id,
        clientName: selectedFacebookAccount.client_name,
        dateRange: {
          since: startDateStr,
          until: endDateStr,
        },
        currentTime: endDate.toISOString()
      });

      const response = await supabase.functions.invoke('facebook-ads', {
        body: { 
          adAccountId: selectedFacebookAccount.ad_account_id,
          accessToken: selectedFacebookAccount.access_token,
          since: startDateStr,
          until: endDateStr,
          clientName: selectedFacebookAccount.client_name
        }
      });

      if (response.error) {
        console.error('Facebook edge function error:', response.error);
        toast({
          title: "Error fetching Facebook data",
          description: response.error.message || "Failed to fetch campaign data",
          variant: "destructive",
        });
        throw new Error(response.error.message || 'Failed to fetch Facebook campaigns');
      }

      console.log('Response from Facebook API:', {
        timestamp: new Date().toISOString(),
        data: response.data
      });
      
      return response.data || { data: [] };
    },
    enabled: !!selectedFacebookAccount,
    refetchInterval: 300000,
    retry: 1,
  });
};
