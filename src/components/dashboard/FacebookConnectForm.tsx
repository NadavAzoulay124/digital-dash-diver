
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { TrashIcon, PlusCircle } from "lucide-react";

interface SavedCredential {
  id: string;
  ad_account_id: string;
  created_at: string;
}

export const FacebookConnectForm = () => {
  const [adAccountId, setAdAccountId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<SavedCredential[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSavedCredentials();
  }, []);

  const fetchSavedCredentials = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('facebook_ads_credentials')
        .select('id, ad_account_id, created_at')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedCredentials(data || []);
    } catch (error) {
      console.error('Error fetching saved credentials:', error);
      toast({
        title: "Error",
        description: "Failed to load saved accounts",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const result = await supabase
        .from('facebook_ads_credentials')
        .insert({ 
          ad_account_id: adAccountId,
          access_token: accessToken,
          user_id: userId
        });

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Success",
        description: "Facebook Ads account connected successfully",
      });
      
      // Clear form and refresh list
      setAdAccountId("");
      setAccessToken("");
      setShowNewForm(false);
      fetchSavedCredentials();
      
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

  const handleDelete = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from('facebook_ads_credentials')
        .delete()
        .eq('id', credentialId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ad account removed successfully",
      });

      fetchSavedCredentials();
    } catch (error) {
      console.error('Error deleting credential:', error);
      toast({
        title: "Error",
        description: "Failed to remove ad account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Facebook Ads Accounts</h2>
        <p className="text-sm text-gray-500">
          Manage your connected Facebook Ads accounts
        </p>
      </div>

      {/* List of saved credentials */}
      <ScrollArea className="h-[200px] rounded-md border">
        {savedCredentials.length > 0 ? (
          <div className="space-y-2 p-4">
            {savedCredentials.map((cred) => (
              <Card key={cred.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">Account ID: {cred.ad_account_id}</p>
                  <p className="text-sm text-gray-500">
                    Connected on {new Date(cred.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(cred.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No connected accounts
          </div>
        )}
      </ScrollArea>

      {/* Add new account button */}
      {!showNewForm && (
        <Button 
          className="w-full"
          variant="outline"
          onClick={() => setShowNewForm(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect New Account
        </Button>
      )}

      {/* Form to add new account */}
      {showNewForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Connecting..." : "Connect Account"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewForm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

