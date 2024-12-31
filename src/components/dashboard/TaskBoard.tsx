import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export const TaskBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "1", title: "Create social media content calendar" },
        { id: "2", title: "Review Google Ads performance" }
      ]
    },
    {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        { id: "3", title: "Design new email templates" },
        { id: "4", title: "Analyze competitor websites" }
      ]
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        { id: "5", title: "Update client meeting notes" },
        { id: "6", title: "Send monthly performance report" }
      ]
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, { id: Date.now().toString(), title: newTaskTitle }]
        };
      }
      return col;
    }));
    setNewTaskTitle("");
  };

  const removeTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: col.tasks.filter(task => task.id !== taskId)
        };
      }
      return col;
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <Card key={column.id} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">{column.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  className="bg-background p-3 rounded-lg shadow-sm flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{task.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(column.id, task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a task..."
                  className="flex-1 px-3 py-1 text-sm rounded-md border border-input bg-background"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTask(column.id);
                    }
                  }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => addTask(column.id)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};