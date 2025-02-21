
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FacebookCredentials } from "./types";

interface FacebookConnectFormProps {
  credentials: FacebookCredentials;
  setCredentials: (credentials: FacebookCredentials) => void;
}

export const FacebookConnectForm = ({ credentials, setCredentials }: FacebookConnectFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  return (
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
                onChange={(e) => setCredentials({ ...credentials, ad_account_id: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Access Token</Label>
              <Input
                type="password"
                placeholder="Enter your Facebook Access Token"
                value={credentials.access_token}
                onChange={(e) => setCredentials({ ...credentials, access_token: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleConnectFacebook} className="w-full">
            Connect Facebook Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
