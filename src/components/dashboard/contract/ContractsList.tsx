
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contract, ContractStatus } from "./types";
import { FileText, Clock, CheckCircle2, AlertCircle, Ban } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getStatusIcon = (status: ContractStatus) => {
  switch (status) {
    case 'draft':
      return <Clock className="w-4 h-4 text-gray-500" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case 'signed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'expired':
      return <Ban className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
};

export const ContractsList = () => {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, contract_services(*)');
      
      if (error) throw error;
      return data as (Contract & { contract_services: any[] })[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {contracts?.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold">{contract.client_company}</h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Total Value: ${contract.total_value.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {getStatusIcon(contract.status)}
                    <span className="capitalize">{contract.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Created {formatDistanceToNow(new Date(contract.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {contract.contract_services.length} services
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

