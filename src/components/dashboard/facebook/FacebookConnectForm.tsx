
import { Card } from "@/components/ui/card";
import { SavedAccountsList } from "./SavedAccountsList";
import { NewAccountForm } from "./NewAccountForm";
import { useFacebookAccounts } from "@/hooks/useFacebookAccounts";

export const FacebookConnectForm = () => {
  const {
    savedCredentials,
    isLoading,
    selectedAccountId,
    setSelectedAccountId,
    deleteAccount,
    refetch,
  } = useFacebookAccounts();

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Facebook Ads Accounts</h2>
        <SavedAccountsList
          isLoading={isLoading}
          savedCredentials={savedCredentials || []}
          selectedAccountId={selectedAccountId}
          onAccountSelect={setSelectedAccountId}
          onDelete={deleteAccount}
        />
      </div>
      <div>
        <h3 className="text-md font-medium mb-4">Connect New Account</h3>
        <NewAccountForm onSuccess={refetch} />
      </div>
    </Card>
  );
};
