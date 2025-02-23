
import { GoogleAdsAccount } from '@/components/dashboard/google/types';

// This is just a stub to maintain type compatibility
// The actual Google Ads integration has been removed
export const useGoogleAdsAccounts = () => {
  const getSelectedAccount = (): GoogleAdsAccount | undefined => {
    return undefined;
  };

  return {
    selectedAccountId: null,
    setSelectedAccountId: () => {},
    getSelectedAccount,
  };
};
