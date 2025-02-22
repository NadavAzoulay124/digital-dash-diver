
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GoogleAdsCredential } from "@/components/dashboard/google/types";
import { useToast } from "@/hooks/use-toast";

export const useGoogleAdsAccounts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const { data: savedCredentials, isLoading } = useQuery({
    queryKey: ["google-ads-credentials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("google_ads_credentials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching Google Ads credentials:", error);
        throw error;
      }

      return data as GoogleAdsCredential[];
    },
  });

  useEffect(() => {
    if (savedCredentials?.length && !selectedAccountId) {
      setSelectedAccountId(savedCredentials[0].id);
    }
  }, [savedCredentials, selectedAccountId]);

  const deleteAccount = async (credentialId: string) => {
    const { error } = await supabase
      .from("google_ads_credentials")
      .delete()
      .eq("id", credentialId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete Google Ads account",
        variant: "destructive",
      });
      throw error;
    }

    if (selectedAccountId === credentialId) {
      setSelectedAccountId(null);
    }

    toast({
      title: "Success",
      description: "Google Ads account removed successfully",
    });

    queryClient.invalidateQueries({ queryKey: ["google-ads-credentials"] });
  };

  const getSelectedAccount = () => {
    return savedCredentials?.find((cred) => cred.id === selectedAccountId);
  };

  return {
    savedCredentials,
    isLoading,
    selectedAccountId,
    setSelectedAccountId,
    deleteAccount,
    getSelectedAccount,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["google-ads-credentials"] }),
  };
};
