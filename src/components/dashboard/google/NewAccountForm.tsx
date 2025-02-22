
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormErrors } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewAccountFormProps {
  onSuccess: () => void;
}

export const NewAccountForm = ({ onSuccess }: NewAccountFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    clientId: "",
    clientSecret: "",
    refreshToken: "",
    developerToken: "",
    customerId: "",
    clientName: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }
    if (!formData.clientId.trim()) {
      newErrors.clientId = "Client ID is required";
    }
    if (!formData.clientSecret.trim()) {
      newErrors.clientSecret = "Client Secret is required";
    }
    if (!formData.refreshToken.trim()) {
      newErrors.refreshToken = "Refresh Token is required";
    }
    if (!formData.developerToken.trim()) {
      newErrors.developerToken = "Developer Token is required";
    }
    if (!formData.customerId.trim()) {
      newErrors.customerId = "Customer ID is required";
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("No active session");
      }

      const { error } = await supabase.from("google_ads_credentials").insert([
        {
          user_id: session.session.user.id,
          account_name: formData.accountName,
          client_id: formData.clientId,
          client_secret: formData.clientSecret,
          refresh_token: formData.refreshToken,
          developer_token: formData.developerToken,
          customer_id: formData.customerId,
          client_name: formData.clientName,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "This Google Ads Account is already connected to a client",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Google Ads account connected successfully",
      });

      setFormData({
        accountName: "",
        clientId: "",
        clientSecret: "",
        refreshToken: "",
        developerToken: "",
        customerId: "",
        clientName: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error connecting account:", error);
      toast({
        title: "Error",
        description: "Failed to connect Google Ads account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Account Name"
          value={formData.accountName}
          onChange={(e) =>
            setFormData({ ...formData, accountName: e.target.value })
          }
        />
        {errors.accountName && (
          <p className="text-sm text-destructive mt-1">{errors.accountName}</p>
        )}
      </div>
      <div>
        <Input
          placeholder="Client ID"
          value={formData.clientId}
          onChange={(e) =>
            setFormData({ ...formData, clientId: e.target.value })
          }
        />
        {errors.clientId && (
          <p className="text-sm text-destructive mt-1">{errors.clientId}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Client Secret"
          value={formData.clientSecret}
          onChange={(e) =>
            setFormData({ ...formData, clientSecret: e.target.value })
          }
        />
        {errors.clientSecret && (
          <p className="text-sm text-destructive mt-1">{errors.clientSecret}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Refresh Token"
          value={formData.refreshToken}
          onChange={(e) =>
            setFormData({ ...formData, refreshToken: e.target.value })
          }
        />
        {errors.refreshToken && (
          <p className="text-sm text-destructive mt-1">{errors.refreshToken}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Developer Token"
          value={formData.developerToken}
          onChange={(e) =>
            setFormData({ ...formData, developerToken: e.target.value })
          }
        />
        {errors.developerToken && (
          <p className="text-sm text-destructive mt-1">{errors.developerToken}</p>
        )}
      </div>
      <div>
        <Input
          placeholder="Customer ID"
          value={formData.customerId}
          onChange={(e) =>
            setFormData({ ...formData, customerId: e.target.value })
          }
        />
        {errors.customerId && (
          <p className="text-sm text-destructive mt-1">{errors.customerId}</p>
        )}
      </div>
      <div>
        <Input
          placeholder="Client Name"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
        />
        {errors.clientName && (
          <p className="text-sm text-destructive mt-1">{errors.clientName}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Connecting..." : "Connect Account"}
      </Button>
    </form>
  );
};
