import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Square, User } from "lucide-react";

interface OnboardingClient {
  id: string;
  name: string;
  services: {
    name: string;
    tasks: {
      description: string;
      completed: boolean;
      assignedTo: string;
    }[];
  }[];
}

// This would typically come from your backend
const onboardingClients: OnboardingClient[] = [
  {
    id: "1",
    name: "Acme Corp",
    services: [
      {
        name: "Google Ads",
        tasks: [
          { description: "Set up Google Ads account", completed: true, assignedTo: "Customer Manager" },
          { description: "Create initial campaign structure", completed: false, assignedTo: "Customer Manager" },
          { description: "Set up conversion tracking", completed: false, assignedTo: "Customer Manager" },
        ]
      },
      {
        name: "Social Media Management",
        tasks: [
          { description: "Audit existing social media accounts", completed: true, assignedTo: "Social Content Manager" },
          { description: "Create content calendar", completed: false, assignedTo: "Social Content Manager" },
        ]
      }
    ]
  },
  {
    id: "2",
    name: "TechStart Inc",
    services: [
      {
        name: "Design Services",
        tasks: [
          { description: "Create brand guidelines", completed: true, assignedTo: "Designer" },
          { description: "Design social media templates", completed: true, assignedTo: "Designer" },
          { description: "Create marketing materials", completed: false, assignedTo: "Designer" },
        ]
      }
    ]
  }
];

export const OnboardingProgress = () => {
  const calculateProgress = (services: OnboardingClient['services']) => {
    const totalTasks = services.reduce((acc, service) => acc + service.tasks.length, 0);
    const completedTasks = services.reduce((acc, service) => 
      acc + service.tasks.filter(task => task.completed).length, 0
    );
    return (completedTasks / totalTasks) * 100;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Clients Onboarding Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {onboardingClients.map(client => (
          <div key={client.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{client.name}</h3>
              <div className="flex items-center gap-2">
                <Progress value={calculateProgress(client.services)} className="w-32" />
                <span className="text-sm text-muted-foreground">
                  {Math.round(calculateProgress(client.services))}%
                </span>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {client.services.map((service, idx) => (
                <Card key={idx} className="bg-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium text-primary">
                      {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {service.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start gap-2 text-sm">
                        {task.completed ? (
                          <CheckSquare className="w-4 h-4 text-primary mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className={task.completed ? "text-muted-foreground" : ""}>
                            {task.description}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{task.assignedTo}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};