import { Card } from "@/components/ui/card";
import { Mail, Facebook, Instagram, Twitter } from "lucide-react";

const activities = [
  {
    id: 1,
    platform: "Email Campaign",
    action: "Campaign 'Summer Sale' sent",
    time: "2 hours ago",
    icon: Mail,
  },
  {
    id: 2,
    platform: "Facebook",
    action: "New post published",
    time: "4 hours ago",
    icon: Facebook,
  },
  {
    id: 3,
    platform: "Instagram",
    action: "Story campaign live",
    time: "5 hours ago",
    icon: Instagram,
  },
  {
    id: 4,
    platform: "Twitter",
    action: "Tweet scheduled",
    time: "6 hours ago",
    icon: Twitter,
  },
];

export const RecentActivity = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-full">
              <activity.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.platform}</p>
              <p className="text-sm text-gray-500">{activity.action}</p>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};