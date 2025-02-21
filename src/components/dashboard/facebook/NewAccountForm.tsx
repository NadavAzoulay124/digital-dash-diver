
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
    adAccountId: "",
    accessToken: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.accountName.trim()) {
      newErrors.accountName = "Account name is required";
    }
    if (!formData.adAccountId.trim()) {
      newErrors.adAccountId = "Ad Account ID is required";
    }
    if (!formData.accessToken.trim()) {
      newErrors.accessToken = "Access Token is required";
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

      const { error } = await supabase.from("facebook_ads_credentials").insert([
        {
          user_id: session.session.user.id,
          account_name: formData.accountName,
          ad_account_id: formData.adAccountId,
          access_token: formData.accessToken,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "This Facebook Ad Account is already connected",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Facebook account connected successfully",
      });

      setFormData({
        accountName: "",
        adAccountId: "",
        accessToken: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error connecting account:", error);
      toast({
        title: "Error",
        description: "Failed to connect Facebook account",
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
          placeholder="Ad Account ID"
          value={formData.adAccountId}
          onChange={(e) =>
            setFormData({ ...formData, adAccountId: e.target.value })
          }
        />
        {errors.adAccountId && (
          <p className="text-sm text-destructive mt-1">{errors.adAccountId}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          placeholder="Access Token"
          value={formData.accessToken}
          onChange={(e) =>
            setFormData({ ...formData, accessToken: e.target.value })
          }
        />
        {errors.accessToken && (
          <p className="text-sm text-destructive mt-1">{errors.accessToken}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Connecting..." : "Connect Account"}
      </Button>
    </form>
  );
};
