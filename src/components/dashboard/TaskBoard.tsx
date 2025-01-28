import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, GripVertical, X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Comment {
  id: string;
  text: string;
  timestamp: string;
}

interface Task {
  id: string;
  title: string;
  comments: Comment[];
  checklist: ChecklistItem[];
  attachments: string[];
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
        { 
          id: "1", 
          title: "Create social media content calendar",
          comments: [],
          checklist: [],
          attachments: []
        },
        { 
          id: "2", 
          title: "Review Google Ads performance",
          comments: [],
          checklist: [],
          attachments: []
        }
      ]
    },
    {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        { 
          id: "3", 
          title: "Design new email templates",
          comments: [],
          checklist: [],
          attachments: []
        },
        { 
          id: "4", 
          title: "Analyze competitor websites",
          comments: [],
          checklist: [],
          attachments: []
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        { 
          id: "5", 
          title: "Update client meeting notes",
          comments: [],
          checklist: [],
          attachments: []
        },
        { 
          id: "6", 
          title: "Send monthly performance report",
          comments: [],
          checklist: [],
          attachments: []
        }
      ]
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [newComment, setNewComment] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const addTask = (columnId: string) => {
    if (!newTaskTitle.trim()) return;
    
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          tasks: [...col.tasks, { 
            id: Date.now().toString(), 
            title: newTaskTitle,
            comments: [],
            checklist: [],
            attachments: []
          }]
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

  const handleTaskClick = (columnId: string, task: Task) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTask || !selectedColumn) return;

    setColumns(columns.map(col => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          tasks: col.tasks.map(task => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                comments: [...task.comments, {
                  id: Date.now().toString(),
                  text: newComment,
                  timestamp: new Date().toLocaleString()
                }]
              };
            }
            return task;
          })
        };
      }
      return col;
    }));
    setNewComment("");
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim() || !selectedTask || !selectedColumn) return;

    setColumns(columns.map(col => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          tasks: col.tasks.map(task => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                checklist: [...task.checklist, {
                  id: Date.now().toString(),
                  text: newChecklistItem,
                  completed: false
                }]
              };
            }
            return task;
          })
        };
      }
      return col;
    }));
    setNewChecklistItem("");
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!selectedTask || !selectedColumn) return;

    setColumns(columns.map(col => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          tasks: col.tasks.map(task => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                checklist: task.checklist.map(item => {
                  if (item.id === itemId) {
                    return { ...item, completed: !item.completed };
                  }
                  return item;
                })
              };
            }
            return task;
          })
        };
      }
      return col;
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTask || !selectedColumn) return;

    // In a real application, you would upload the file to a server
    // For now, we'll just store the file name
    setColumns(columns.map(col => {
      if (col.id === selectedColumn) {
        return {
          ...col,
          tasks: col.tasks.map(task => {
            if (task.id === selectedTask.id) {
              return {
                ...task,
                attachments: [...task.attachments, file.name]
              };
            }
            return task;
          })
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
                  className="bg-background p-3 rounded-lg shadow-sm flex items-center justify-between group cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTaskClick(column.id, task)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{task.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTask(column.id, task.id);
                    }}
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

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Comments</h3>
              <div className="space-y-2">
                {selectedTask?.comments.map(comment => (
                  <div key={comment.id} className="bg-muted p-3 rounded-lg">
                    <p>{comment.text}</p>
                    <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={addComment}>Add</Button>
              </div>
            </div>

            {/* Checklist Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Checklist</h3>
              <div className="space-y-2">
                {selectedTask?.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <span className={item.completed ? "line-through" : ""}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                />
                <Button onClick={addChecklistItem}>Add</Button>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Attachments</h3>
              <div className="space-y-2">
                {selectedTask?.attachments.map((attachment, index) => (
                  <div key={index} className="bg-muted p-2 rounded flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{attachment}</span>
                  </div>
                ))}
              </div>
              <div>
                <Label htmlFor="file" className="cursor-pointer">
                  <div className="border-2 border-dashed border-muted-foreground rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                    <Upload className="w-6 h-6 mx-auto mb-2" />
                    <p>Click to upload file or photo</p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Label>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};