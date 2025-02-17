
export interface LeadComment {
  id: string;
  comment: string;
  category: "distance" | "scheduling" | "pricing" | "other";
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  date: string;
  phone: string;
  source: "Google Ads" | "Meta" | "Organic" | "Other";
  campaign: string;
  adSet: string;
  ad: string;
  status: "New" | "Appointment Scheduled" | "Closed" | "Not Interested";
  comments: LeadComment[];
}
