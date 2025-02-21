
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { FacebookCredentials } from "./types";

export const FacebookConnectForm = () => {
  const [credentials, setCredentials] = useState<FacebookCredentials>({
    ad_account_id: '',
    access_token: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to connect Facebook Ads');
      }

      const { error: supabaseError } = await supabase
        .from('facebook_ads_credentials')
        .upsert({
          user_id: user.id,
          ad_account_id: credentials.ad_account_id,
          access_token: credentials.access_token,
        });

      if (supabaseError) throw supabaseError;

      toast({
        title: "Success",
        description: "Facebook Ads credentials saved successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Ad Account ID"
          value={credentials.ad_account_id}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              ad_account_id: e.target.value,
            }))
          }
          required
        />
        <Input
          type="password"
          placeholder="Access Token"
          value={credentials.access_token}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              access_token: e.target.value,
            }))
          }
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Connecting...' : 'Connect Facebook Ads'}
      </Button>
    </form>
  );
};
