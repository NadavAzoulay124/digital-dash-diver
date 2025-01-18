import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    // Here we would typically make an API call to an AI service
    // For now, we'll simulate a response
    setResponse("Based on the client's campaign data and history, I recommend...");
    
    toast({
      title: "AI Response Generated",
      description: "The AI has analyzed your query and provided a response.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe the client case or question..."
              rows={4}
            />
          </div>
          <Button type="submit">Get AI Assistance</Button>
          
          {response && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm">{response}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};