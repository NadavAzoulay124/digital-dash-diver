import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Service {
  id: string;
  name: string;
  tasks: {
    id: string;
    description: string;
    assignedTo: string;
  }[];
}

const services: Service[] = [
  {
    id: "google-ads",
    name: "Google Ads",
    tasks: [
      { id: "ga1", description: "Set up Google Ads account", assignedTo: "Customer Manager" },
      { id: "ga2", description: "Create initial campaign structure", assignedTo: "Customer Manager" },
      { id: "ga3", description: "Set up conversion tracking", assignedTo: "Customer Manager" },
    ]
  },
  {
    id: "social-media",
    name: "Social Media Management",
    tasks: [
      { id: "sm1", description: "Audit existing social media accounts", assignedTo: "Social Content Manager" },
      { id: "sm2", description: "Create content calendar", assignedTo: "Social Content Manager" },
      { id: "sm3", description: "Design social media templates", assignedTo: "Designer" },
    ]
  },
  {
    id: "design",
    name: "Design Services",
    tasks: [
      { id: "d1", description: "Create brand guidelines", assignedTo: "Designer" },
      { id: "d2", description: "Design social media templates", assignedTo: "Designer" },
      { id: "d3", description: "Create marketing materials", assignedTo: "Designer" },
    ]
  }
];

export const ClientOnboarding = () => {
  const [clientName, setClientName] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      }
      return [...prev, serviceId];
    });
  };

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      }
      return [...prev, taskId];
    });
  };

  const handleAssignTasks = () => {
    if (!clientName) {
      toast.error("Please enter a client name");
      return;
    }

    if (selectedServices.length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    if (selectedTasks.length === 0) {
      toast.error("Please select at least one task");
      return;
    }

    // Here we would typically send this to an API
    // For now, we'll just show a success message
    const tasksToAssign = services
      .filter(service => selectedServices.includes(service.id))
      .flatMap(service => service.tasks)
      .filter(task => selectedTasks.includes(task.id));

    const assignmentsByRole = tasksToAssign.reduce((acc, task) => {
      if (!acc[task.assignedTo]) {
        acc[task.assignedTo] = [];
      }
      acc[task.assignedTo].push(task.description);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(assignmentsByRole).forEach(([role, tasks]) => {
      toast.success(`Tasks assigned to ${role}`, {
        description: `${tasks.length} tasks have been added to their dashboard`
      });
    });

    // Reset form
    setClientName("");
    setSelectedServices([]);
    setSelectedTasks([]);
  };

  return (
    <Card className="bg-gradient-to-br from-white to-primary/5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Client Onboarding</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Enter client name"
            className="border-primary/20 focus:border-primary"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-lg font-semibold text-primary">Selected Services</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedServices.includes(service.id)
                    ? "border-primary bg-primary/10"
                    : "border-gray-200 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <Label htmlFor={service.id} className="font-medium">
                    {service.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedServices.length > 0 && (
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-primary">Required Tasks</Label>
            <div className="space-y-4">
              {services
                .filter(service => selectedServices.includes(service.id))
                .map(service => (
                  <div key={service.id} className="space-y-2">
                    <h3 className="font-medium text-primary/80">{service.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.tasks.map(task => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedTasks.includes(task.id)
                              ? "border-primary/50 bg-primary/5"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id={task.id}
                              checked={selectedTasks.includes(task.id)}
                              onCheckedChange={() => handleTaskToggle(task.id)}
                            />
                            <div className="space-y-1">
                              <Label htmlFor={task.id} className="font-medium">
                                {task.description}
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Assigned to: {task.assignedTo}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleAssignTasks}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Assign Tasks to Team
        </Button>
      </CardContent>
    </Card>
  );
};