
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "lucide-react";
import { SavedCredential } from "./types";

interface SavedAccountsListProps {
  isLoading: boolean;
  savedCredentials: SavedCredential[];
  selectedAccountId: string | null;
  onAccountSelect: (credentialId: string) => void;
  onDelete: (credentialId: string) => void;
}

export const SavedAccountsList = ({
  isLoading,
  savedCredentials,
  selectedAccountId,
  onAccountSelect,
  onDelete,
}: SavedAccountsListProps) => {
  return (
    <ScrollArea className="h-[200px] rounded-md border">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          Loading accounts...
        </div>
      ) : savedCredentials?.length ? (
        <div className="space-y-2 p-4">
          {savedCredentials.map((cred) => (
            <Card 
              key={cred.id} 
              className={`p-3 flex justify-between items-center cursor-pointer transition-colors ${
                selectedAccountId === cred.id ? 'bg-primary/10 border-primary' : 'hover:bg-accent'
              }`}
              onClick={() => onAccountSelect(cred.id)}
            >
              <div>
                <p className="font-medium">{cred.account_name}</p>
                <p className="text-sm text-gray-500">Account ID: {cred.ad_account_id}</p>
                <p className="text-xs text-gray-400">
                  Connected on {new Date(cred.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(cred.id);
                }}
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
  );
};
