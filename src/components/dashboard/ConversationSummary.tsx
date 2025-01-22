import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ListChecks } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Conversation {
  id: number;
  clientName: string;
  date: string;
  summary: string;
  potentialTasks: string[];
}

export const ConversationSummary = () => {
  const { toast } = useToast();
  
  // Mock data - in a real app, this would come from an API
  const [conversations] = useState<Conversation[]>([
    {
      id: 1,
      clientName: "Acme Corp",
      date: "2024-02-20",
      summary: "Discussed website redesign requirements and timeline",
      potentialTasks: [
        "Create wireframes for homepage",
        "Design new logo options",
        "Develop responsive navigation"
      ]
    },
    {
      id: 2,
      clientName: "TechStart Inc",
      date: "2024-02-19",
      summary: "Reviewed marketing campaign results and planned next steps",
      potentialTasks: [
        "Analyze campaign metrics",
        "Prepare performance report",
        "Draft new ad copy"
      ]
    }
  ]);

  const handleSendToTaskBoard = (tasks: string[]) => {
    // In a real app, this would integrate with your task management system
    toast({
      title: "Tasks Added",
      description: `${tasks.length} tasks have been added to your task board.`,
    });
  };

  return (
    <div className="space-y-6">
      {conversations.map((conversation) => (
        <Card key={conversation.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {conversation.clientName}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {conversation.date}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm">{conversation.summary}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Potential Tasks
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendToTaskBoard(conversation.potentialTasks)}
                >
                  Send to Task Board
                </Button>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {conversation.potentialTasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};