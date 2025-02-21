
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SavedCredential } from "@/components/dashboard/facebook/types";

export const useFacebookAccounts = () => {
  const { toast } = useToast();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const {
    data: savedCredentials,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["facebook-accounts"],
    queryFn: async () => {
      console.log("Fetching saved Facebook accounts");
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error("No active session");
      }

      const { data: credentials, error } = await supabase
        .from("facebook_ads_credentials")
        .select("*");

      if (error) {
        console.error("Error fetching credentials:", error);
        throw new Error("Failed to fetch Facebook accounts");
      }

      console.log("Fetched credentials:", credentials);
      return credentials as SavedCredential[];
    },
    meta: {
      onError: (error: Error) => {
        console.error("Error in Facebook accounts query:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const deleteAccount = async (credentialId: string) => {
    try {
      const { error } = await supabase
        .from("facebook_ads_credentials")
        .delete()
        .eq("id", credentialId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Facebook account removed successfully",
      });

      await refetch();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: "Failed to remove Facebook account",
        variant: "destructive",
      });
    }
  };

  return {
    savedCredentials,
    isLoading,
    selectedAccountId,
    setSelectedAccountId,
    deleteAccount,
    refetch,
  };
};
