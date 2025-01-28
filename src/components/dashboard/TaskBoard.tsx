import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, GripVertical, X, Upload, Repeat } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface RepeatConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | 'none';
  customDates?: Date[];
}

interface Task {
  id: string;
  title: string;
  comments: Comment[];
  checklist: ChecklistItem[];
  attachments: string[];
  repeat: RepeatConfig;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const EMPLOYEE_ROLES = [
  "Customer Manager",
  "Designer",
  "Social Content Manager"
] as const;

type EmployeeRole = typeof EMPLOYEE_ROLES[number];

export const TaskBoard = () => {
  const [roleColumns, setRoleColumns] = useState<Record<EmployeeRole, Column[]>>({
    "Customer Manager": [
      {
        id: "cm-todo",
        title: "To Do",
        tasks: [
          { 
            id: "cm1", 
            title: "Follow up with clients",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "cm-inProgress",
        title: "In Progress",
        tasks: [
          { 
            id: "cm2", 
            title: "Client meeting preparation",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "cm-done",
        title: "Done",
        tasks: []
      }
    ],
    "Designer": [
      {
        id: "d-todo",
        title: "To Do",
        tasks: [
          { 
            id: "d1", 
            title: "Create brand guidelines",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "d-inProgress",
        title: "In Progress",
        tasks: [
          { 
            id: "d2", 
            title: "Website mockups",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "d-done",
        title: "Done",
        tasks: []
      }
    ],
    "Social Content Manager": [
      {
        id: "scm-todo",
        title: "To Do",
        tasks: [
          { 
            id: "scm1", 
            title: "Create content calendar",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "scm-inProgress",
        title: "In Progress",
        tasks: [
          { 
            id: "scm2", 
            title: "Schedule social posts",
            comments: [],
            checklist: [],
            attachments: [],
            repeat: { enabled: false, frequency: 'none' }
          }
        ]
      },
      {
        id: "scm-done",
        title: "Done",
        tasks: []
      }
    ]
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [newComment, setNewComment] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const addTask = (role: EmployeeRole, columnId: string) => {
    if (!newTaskTitle.trim()) return;
    
    setRoleColumns(prev => ({
      ...prev,
      [role]: prev[role].map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...col.tasks, { 
              id: Date.now().toString(), 
              title: newTaskTitle,
              comments: [],
              checklist: [],
              attachments: [],
              repeat: { enabled: false, frequency: 'none' }
            }]
          };
        }
        return col;
      })
    }));
    setNewTaskTitle("");
  };

  const removeTask = (role: EmployeeRole, columnId: string, taskId: string) => {
    setRoleColumns(prev => ({
      ...prev,
      [role]: prev[role].map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          };
        }
        return col;
      })
    }));
  };

  const handleTaskClick = (role: EmployeeRole, columnId: string, task: Task) => {
    setSelectedTask(task);
    setSelectedColumn(columnId);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedTask || !selectedColumn) return;

    setRoleColumns(roleColumns => {
      return {
        ...roleColumns,
        [selectedColumn.split('-')[0] as EmployeeRole]: roleColumns[selectedColumn.split('-')[0] as EmployeeRole].map(col => {
          if (col.id === selectedColumn) {
            return {
              ...col,
              tasks: col.tasks.map(task => {
                if (task.id === selectedTask.id) {
                  const updatedTask = {
                    ...task,
                    comments: [...task.comments, {
                      id: Date.now().toString(),
                      text: newComment,
                      timestamp: new Date().toLocaleString()
                    }]
                  };
                  setSelectedTask(updatedTask);
                  return updatedTask;
                }
                return task;
              })
            };
          }
          return col;
        })
      };
    });
    setNewComment("");
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim() || !selectedTask || !selectedColumn) return;

    setRoleColumns(roleColumns => {
      return {
        ...roleColumns,
        [selectedColumn.split('-')[0] as EmployeeRole]: roleColumns[selectedColumn.split('-')[0] as EmployeeRole].map(col => {
          if (col.id === selectedColumn) {
            return {
              ...col,
              tasks: col.tasks.map(task => {
                if (task.id === selectedTask.id) {
                  const updatedTask = {
                    ...task,
                    checklist: [...task.checklist, {
                      id: Date.now().toString(),
                      text: newChecklistItem,
                      completed: false
                    }]
                  };
                  setSelectedTask(updatedTask);
                  return updatedTask;
                }
                return task;
              })
            };
          }
          return col;
        })
      };
    });
    setNewChecklistItem("");
  };

  const toggleChecklistItem = (itemId: string) => {
    if (!selectedTask || !selectedColumn) return;

    setRoleColumns(roleColumns => {
      return {
        ...roleColumns,
        [selectedColumn.split('-')[0] as EmployeeRole]: roleColumns[selectedColumn.split('-')[0] as EmployeeRole].map(col => {
          if (col.id === selectedColumn) {
            return {
              ...col,
              tasks: col.tasks.map(task => {
                if (task.id === selectedTask.id) {
                  const updatedTask = {
                    ...task,
                    checklist: task.checklist.map(item => {
                      if (item.id === itemId) {
                        return { ...item, completed: !item.completed };
                      }
                      return item;
                    })
                  };
                  setSelectedTask(updatedTask);
                  return updatedTask;
                }
                return task;
              })
            };
          }
          return col;
        })
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedTask || !selectedColumn) return;

    const fileUrl = URL.createObjectURL(file);

    setRoleColumns(roleColumns => {
      return {
        ...roleColumns,
        [selectedColumn.split('-')[0] as EmployeeRole]: roleColumns[selectedColumn.split('-')[0] as EmployeeRole].map(col => {
          if (col.id === selectedColumn) {
            return {
              ...col,
              tasks: col.tasks.map(task => {
                if (task.id === selectedTask.id) {
                  const updatedTask = {
                    ...task,
                    attachments: [...task.attachments, fileUrl]
                  };
                  setSelectedTask(updatedTask);
                  return updatedTask;
                }
                return task;
              })
            };
          }
          return col;
        })
      };
    });
  };

  const updateTaskRepeat = (frequency: RepeatConfig['frequency']) => {
    if (!selectedTask || !selectedColumn) return;

    setRoleColumns(roleColumns => {
      return {
        ...roleColumns,
        [selectedColumn.split('-')[0] as EmployeeRole]: roleColumns[selectedColumn.split('-')[0] as EmployeeRole].map(col => {
          if (col.id === selectedColumn) {
            return {
              ...col,
              tasks: col.tasks.map(task => {
                if (task.id === selectedTask.id) {
                  const updatedTask = {
                    ...task,
                    repeat: {
                      enabled: frequency !== 'none',
                      frequency
                    }
                  };
                  setSelectedTask(updatedTask);
                  return updatedTask;
                }
                return task;
              })
            };
          }
          return col;
        })
      };
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Task Management</h2>
      <Tabs defaultValue="Customer Manager" className="space-y-6">
        <TabsList>
          {EMPLOYEE_ROLES.map((role) => (
            <TabsTrigger key={role} value={role}>
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        {EMPLOYEE_ROLES.map((role) => (
          <TabsContent key={role} value={role}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roleColumns[role].map(column => (
                <Card key={column.id} className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{column.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {column.tasks.map(task => (
                      <div
                        key={task.id}
                        className="bg-background p-3 rounded-lg shadow-sm flex items-center justify-between group cursor-pointer hover:bg-muted/50"
                        onClick={() => handleTaskClick(role, column.id, task)}
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{task.title}</span>
                          {task.repeat.enabled && (
                            <Repeat className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTask(role, column.id, task.id);
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
                            addTask(role, column.id);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => addTask(role, column.id)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
            <DialogDescription>
              Add comments, checklist items, or attachments to this task.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Task Repetition</h3>
              <Select
                value={selectedTask?.repeat.frequency}
                onValueChange={(value: RepeatConfig['frequency']) => updateTaskRepeat(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repeat frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom dates</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-4">
              <h3 className="font-semibold">Checklist</h3>
              <div className="space-y-2">
                {selectedTask?.checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(item.id)}
                    />
                    <label
                      htmlFor={item.id}
                      className={`${item.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.text}
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addChecklistItem();
                    }
                  }}
                />
                <Button onClick={addChecklistItem}>Add</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Attachments</h3>
              <div className="grid grid-cols-2 gap-4">
                {selectedTask?.attachments.map((attachment, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={attachment}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
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
                    accept="image/*"
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
