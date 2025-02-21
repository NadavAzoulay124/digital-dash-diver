
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const FacebookConnectForm = () => {
  const [adAccountId, setAdAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // First try to get existing credentials
      const { data: existingCreds } = await supabase
        .from('facebook_ads_credentials')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      let result;
      if (existingCreds) {
        // Update existing credentials
        result = await supabase
          .from('facebook_ads_credentials')
          .update({ 
            ad_account_id: adAccountId,
            access_token: accessToken,
          })
          .eq('user_id', userId);
      } else {
        // Insert new credentials
        result = await supabase
          .from('facebook_ads_credentials')
          .insert({ 
            ad_account_id: adAccountId,
            access_token: accessToken,
            user_id: userId
          });
      }

      if (result.error) {
        console.error('Error saving credentials:', result.error);
        throw new Error(result.error.message);
      }

      toast({
        title: "Success",
        description: `Facebook Ads credentials ${existingCreds ? 'updated' : 'saved'} successfully`,
      });
      
      // Clear form
      setAdAccountId("");
      setAccessToken("");
      
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Connect Facebook Ads</h2>
        <p className="text-sm text-gray-500">
          Enter your Facebook Ads credentials to start tracking campaign performance
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="adAccountId" className="block text-sm font-medium text-gray-700">
            Ad Account ID
          </label>
          <Input
            id="adAccountId"
            value={adAccountId}
            onChange={(e) => setAdAccountId(e.target.value)}
            placeholder="Enter your Ad Account ID"
            required
            className="mt-1"
          />
        </div>
        
        <div>
          <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
            Access Token
          </label>
          <Input
            id="accessToken"
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter your Access Token"
            required
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Connecting..." : "Connect Facebook Ads"}
        </Button>
      </div>
    </form>
  );
};
