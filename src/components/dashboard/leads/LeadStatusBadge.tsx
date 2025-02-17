
import { Badge } from "@/components/ui/badge";
import { Lead } from "./types";

export const LeadStatusBadge = ({ status }: { status: Lead["status"] }) => {
  switch (status) {
    case "New":
      return <Badge className="bg-primary">{status}</Badge>;
    case "Appointment Scheduled":
      return <Badge className="bg-warning">{status}</Badge>;
    case "Closed":
      return <Badge className="bg-success">{status}</Badge>;
    case "Not Interested":
      return <Badge variant="destructive">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
