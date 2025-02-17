import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CheckSquare, Target, TrendingUp, Clock, AlertTriangle, Bell } from "lucide-react";
import { ConversationSummary } from "./ConversationSummary";
import { ClientInsights } from "./ClientInsights";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { differenceInDays } from "date-fns";

interface ClientGoal {
  id: string;
  title: string;
  progress: number;
  target: string;
}

interface Meeting {
  id: string;
  clientName: string;
  date: string;
  time: string;
  summary: string;
  status: 'completed' | 'upcoming';
  nextSteps?: string[];
}

interface Client {
  id: string;
  name: string;
  lastContact: string;
  openTasks: number;
  goals: ClientGoal[];
  alertThreshold: number;
}

const mockMeetings: Meeting[] = [
  {
    id: "m1",
    clientName: "Acme Corp",
    date: "2024-02-28",
    time: "10:00 AM",
    summary: "Discussed Q1 campaign performance and strategy adjustments. Client expressed satisfaction with current social media engagement but wants to focus more on conversion optimization.",
    status: 'completed',
    nextSteps: [
      "Prepare conversion rate optimization proposal",
      "Schedule A/B testing for landing pages",
      "Review analytics for underperforming channels"
    ]
  },
  {
    id: "m2",
    clientName: "TechStart Inc",
    date: "2024-02-29",
    time: "2:30 PM",
    summary: "Product launch campaign planning session. Defined key messaging points and target audience segments. Client emphasized importance of reaching technical decision-makers.",
    status: 'completed',
    nextSteps: [
      "Draft technical content calendar",
      "Research industry publications for PR outreach",
      "Develop LinkedIn advertising strategy"
    ]
  },
  {
    id: "m3",
    clientName: "Acme Corp",
    date: "2024-03-05",
    time: "11:00 AM",
    summary: "Upcoming: CRO Strategy Presentation",
    status: 'upcoming'
  }
];

const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    lastContact: "2024-02-25",
    openTasks: 5,
    alertThreshold: 3,
    goals: [
      {
        id: "g1",
        title: "Increase Website Traffic",
        progress: 75,
        target: "50k monthly visitors"
      },
      {
        id: "g2",
        title: "Improve Conversion Rate",
        progress: 45,
        target: "3% conversion rate"
      }
    ]
  },
  {
    id: "2",
    name: "TechStart Inc",
    lastContact: "2024-02-24",
    openTasks: 3,
    alertThreshold: 7,
    goals: [
      {
        id: "g3",
        title: "Launch New Product",
        progress: 60,
        target: "Q2 2024"
      }
    ]
  }
];

export const ClientContactDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [clients, setClients] = useState(mockClients);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedClientData = clients.find(client => client.id === selectedClient);

  const updateAlertThreshold = (clientId: string, newThreshold: number) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === clientId
          ? { ...client, alertThreshold: newThreshold }
          : client
      )
    );
    toast({
      title: "Alert threshold updated",
      description: `Contact reminder set to ${newThreshold} days`,
    });
  };

  const getDaysSinceLastContact = (lastContact: string) => {
    const lastContactDate = new Date(lastContact);
    const today = new Date();
    return differenceInDays(today, lastContactDate);
  };

  const shouldShowAlert = (client: Client) => {
    const daysSinceContact = getDaysSinceLastContact(client.lastContact);
    return daysSinceContact >= client.alertThreshold;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div key={client.id} className="space-y-2">
                  <Button
                    variant={selectedClient === client.id ? "default" : "ghost"}
                    className="w-full justify-start relative"
                    onClick={() => setSelectedClient(client.id)}
                  >
                    <span className="flex items-center gap-2">
                      {client.name}
                      {shouldShowAlert(client) && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </span>
                  </Button>
                  {shouldShowAlert(client) && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No contact for {getDaysSinceLastContact(client.lastContact)} days
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Details */}
        {selectedClientData && (
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{selectedClientData.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Last Contact: {selectedClientData.lastContact}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckSquare className="w-4 h-4" />
                  <span>Open Tasks: {selectedClientData.openTasks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span className="text-sm">Alert Threshold:</span>
                  <Input
                    type="number"
                    value={selectedClientData.alertThreshold}
                    onChange={(e) => updateAlertThreshold(selectedClientData.id, parseInt(e.target.value))}
                    className="w-20 h-8"
                    min={1}
                    max={30}
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>

            {/* Client Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Client Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedClientData.goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{goal.title}</span>
                        <span className="text-muted-foreground">{goal.target}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Meeting History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Meeting History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMeetings
                    .filter(meeting => meeting.clientName === selectedClientData.name)
                    .map((meeting) => (
                      <div 
                        key={meeting.id} 
                        className={`p-4 rounded-lg border ${
                          meeting.status === 'upcoming' 
                            ? 'border-primary/20 bg-primary/5' 
                            : 'border-border'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{meeting.date} at {meeting.time}</p>
                            <p className={`text-sm ${
                              meeting.status === 'upcoming' 
                                ? 'text-primary' 
                                : 'text-muted-foreground'
                            }`}>
                              {meeting.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{meeting.summary}</p>
                        {meeting.nextSteps && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Next Steps:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {meeting.nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Performance */}
            <ClientInsights />

            {/* Conversation History */}
            <ConversationSummary />
          </div>
        )}
      </div>
    </div>
  );
};
