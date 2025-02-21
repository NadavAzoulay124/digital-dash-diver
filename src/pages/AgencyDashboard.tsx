
import { Routes, Route } from "react-router-dom";
import { FacebookConnectForm } from "@/components/dashboard/FacebookConnectForm";
import { CampaignInsights } from "@/components/dashboard/CampaignInsights";
import { CampaignChart } from "@/components/dashboard/CampaignChart";

const AgencyDashboard = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <div className="space-y-6">
            <FacebookConnectForm />
            <div className="grid gap-6 md:grid-cols-2">
              <CampaignChart />
              <CampaignInsights />
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AgencyDashboard;

