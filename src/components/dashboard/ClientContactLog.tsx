import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const ClientContactLog = () => {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();
  
  const contacts = [
    {
      id: 1,
      clientName: "Acme Corp",
      lastContact: "2024-02-15",
      note: "Discussed Q1 campaign results",
    },
    {
      id: 2,
      clientName: "TechStart Inc",
      lastContact: "2024-02-14",
      note: "Reviewed website redesign progress",
    },
    // Add more mock data as needed
  ];

  const addNote = (clientId: number) => {
    if (!newNote) return;
    
    toast({
      title: "Note Added",
      description: "Contact note has been logged successfully.",
    });
    
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      {contacts.map((contact) => (
        <Card key={contact.id}>
          <CardHeader>
            <CardTitle>{contact.clientName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Last Contact: {contact.lastContact}
                </span>
              </div>
              <p className="text-sm">{contact.note}</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new contact note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={() => addNote(contact.id)}>Add Note</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};