
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { SavedAccountsList } from "./SavedAccountsList";
import { NewAccountForm } from "./NewAccountForm";
import { SavedCredential, FormErrors } from "./types";

export const FacebookConnectForm = () => {
  const [adAccountId, setAdAccountId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedCredentials, setSavedCredentials] = useState<SavedCredential[]>([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSavedCredentials();
  }, []);

  const fetchSavedCredentials = async () => {
    setIsLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Fetching credentials for user:', user.user.id);
      const { data, error } = await supabase
        .from('facebook_ads_credentials')
        .select('id, ad_account_id, account_name, created_at')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching credentials:', error);
        throw error;
      }

      console.log('Fetched credentials:', data);
      if (!data || data.length === 0) {
        console.log('No credentials found for user');
      }
      setSavedCredentials(data || []);
    } catch (error) {
      console.error('Error in fetchSavedCredentials:', error);
      toast({
        title: "Error",
        description: "Failed to load saved accounts. Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!accountName.trim()) {
      errors.accountName = "Account name is required";
    }
    if (!adAccountId.trim()) {
      errors.adAccountId = "Ad Account ID is required";
    }
    if (!accessToken.trim()) {
      errors.accessToken = "Access Token is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAccountSelect = (credentialId: string) => {
    setSelectedAccountId(credentialId);
    toast({
      title: "Account Selected",
      description: "Facebook Ads account selected successfully",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data: existing } = await supabase
        .from('facebook_ads_credentials')
        .select('id, account_name')
        .eq('user_id', user.user.id)
        .eq('ad_account_id', adAccountId)
        .single();

      if (existing) {
        throw new Error(`This ad account (${existing.account_name}) is already connected to your profile`);
      }

      const { data, error } = await supabase
        .from('facebook_ads_credentials')
        .insert({ 
          ad_account_id: adAccountId,
          account_name: accountName.trim(),
          access_token: accessToken,
          user_id: user.user.id
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Successfully inserted credential:', data);

      toast({
        title: "Success",
        description: "Facebook Ads account connected successfully",
      });
      
      setAdAccountId("");
      setAccountName("");
      setAccessToken("");
      setFormErrors({});
      setShowNewForm(false);
      await fetchSavedCredentials();
      
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

      if (selectedAccountId === credentialId) {
        setSelectedAccountId(null);
      }
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

  const handleCancel = () => {
    setShowNewForm(false);
    setFormErrors({});
    setAdAccountId("");
    setAccountName("");
    setAccessToken("");
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Facebook Ads Accounts</h2>
        <p className="text-sm text-gray-500">
          Manage your connected Facebook Ads accounts
        </p>
      </div>

      <SavedAccountsList
        isLoading={isLoading}
        savedCredentials={savedCredentials}
        selectedAccountId={selectedAccountId}
        onAccountSelect={handleAccountSelect}
        onDelete={handleDelete}
      />

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

      {showNewForm && (
        <NewAccountForm
          accountName={accountName}
          adAccountId={adAccountId}
          accessToken={accessToken}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onAccountNameChange={setAccountName}
          onAdAccountIdChange={setAdAccountId}
          onAccessTokenChange={setAccessToken}
        />
      )}
    </div>
  );
};
