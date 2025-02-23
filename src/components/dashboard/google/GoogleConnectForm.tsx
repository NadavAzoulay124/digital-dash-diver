
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const GoogleConnectForm = () => {
  const { toast } = useToast();

  const handleGoogleConnect = async () => {
    toast({
      title: "Google Ads Integration Unavailable",
      description: "The Google Ads integration is currently unavailable. Please try again later.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Google Ads</CardTitle>
        <CardDescription>
          Link your Google Ads account to view campaign metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGoogleConnect}>
          Connect Google Ads Account
        </Button>
      </CardContent>
    </Card>
  );
};
