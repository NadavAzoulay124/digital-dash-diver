import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

interface LeadStatusCount {
  status: string;
  count: number;
  color: string;
}

// Reuse the mock leads data from LeadsBoard component
const mockLeads = [
  {
    id: "1",
    status: "New",
    date: "2024-02-20",
  },
  {
    id: "2",
    status: "Appointment Scheduled",
    date: "2024-02-19",
  },
  {
    id: "3",
    status: "Closed",
    date: "2024-02-18",
  },
  {
    id: "4",
    status: "Not Interested",
    date: "2024-02-17",
  },
  {
    id: "5",
    status: "New",
    date: "2024-02-16",
  },
  {
    id: "6",
    status: "Appointment Scheduled",
    date: "2024-02-15",
  },
  {
    id: "7",
    status: "Closed",
    date: "2024-02-14",
  },
  {
    id: "8",
    status: "New",
    date: "2024-02-13",
  },
  {
    id: "9",
    status: "Appointment Scheduled",
    date: "2024-02-12",
  },
  {
    id: "10",
    status: "Not Interested",
    date: "2024-02-11",
  },
];

const statusColors: Record<string, string> = {
  "New": "bg-primary",
  "Appointment Scheduled": "bg-warning",
  "Closed": "bg-success",
  "Not Interested": "bg-destructive",
};

export const LeadStatusSummary = () => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
    if (start) setStartDate(start);
    if (end) setEndDate(end);
  };

  const filteredStatusCounts = useMemo(() => {
    const filteredLeads = mockLeads.filter(lead => {
      const leadDate = new Date(lead.date);
      return isWithinInterval(leadDate, { start: startDate, end: endDate });
    });

    const counts: Record<string, number> = {};
    filteredLeads.forEach(lead => {
      counts[lead.status] = (counts[lead.status] || 0) + 1;
    });

    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || "bg-gray-500",
    }));
  }, [startDate, endDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Lead Status Summary</span>
          <DateRangeFilter onDateChange={handleDateChange} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredStatusCounts.map((item) => (
            <div
              key={item.status}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <h3 className="font-medium">{item.status}</h3>
              </div>
              <p className="text-2xl font-bold mt-2">{item.count}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};