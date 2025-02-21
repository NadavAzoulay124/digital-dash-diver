
import { Routes, Route } from "react-router-dom";
import { FacebookConnectForm } from "@/components/dashboard/FacebookConnectForm";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { CampaignChart } from "@/components/dashboard/CampaignChart";
import { LeadsBoard } from "@/components/dashboard/LeadsBoard";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";

const AgencyDashboard = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <MetricsOverview />
              <FinancialOverview />
            </div>
            <FacebookConnectForm />
            <div className="grid gap-6 md:grid-cols-2">
              <CampaignChart />
              <CampaignInsights />
            </div>
            <LeadsBoard />
          </div>
        }
      />
    </Routes>
  );
};

export default AgencyDashboard;
