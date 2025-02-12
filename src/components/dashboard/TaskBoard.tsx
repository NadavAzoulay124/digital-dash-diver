import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Task } from "@/data/mockTasks";
import { GripVertical, Clock, Upload, X } from "lucide-react";

const COMPANY_ROLES = [
  {
    role: "Campaign Manager",
    employee: "John Doe",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  },
  {
    role: "Designer",
    employee: "Jane Smith",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    role: "Customer Manager",
    employee: "Mike Johnson",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    role: "Social Media Manager",
    employee: "Jane Smith",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    role: "Content Strategist",
    employee: "John Doe",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
  }
] as const;

type CompanyRole = typeof COMPANY_ROLES[number]["role"];

interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard = ({ tasks }: TaskBoardProps) => {
  const [selectedRole, setSelectedRole] = useState<CompanyRole>("Campaign Manager");
  const [localTasks, setLocalTasks] = useState(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredTasks = localTasks.filter(task => {
    switch (selectedRole) {
      case "Campaign Manager":
        return task.employee === "John Doe";
      case "Designer":
        return task.employee === "Jane Smith";
      case "Customer Manager":
        return task.employee === "Mike Johnson";
      case "Social Media Manager":
        return task.employee === "Jane Smith";
      case "Content Strategist":
        return task.employee === "John Doe";
      default:
        return false;
    }
  });
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'inProgress');
  const followUpTasks = filteredTasks.filter(task => task.status === 'followUp');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceStatus = source.droppableId as Task['status'];
    const destinationStatus = destination.droppableId as Task['status'];

    const updatedTasks = [...localTasks];
    const taskToMove = filteredTasks.find((task, index) => 
      task.status === sourceStatus && 
      filteredTasks.filter(t => t.status === sourceStatus).indexOf(task) === source.index
    );

    if (taskToMove) {
      const taskIndex = updatedTasks.findIndex(t => t.id === taskToMove.id);
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...taskToMove,
          status: destinationStatus
        };
        setLocalTasks(updatedTasks);
      }
    }
  };

  const renderTask = (task: Task, provided: any) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="bg-background p-2 rounded-lg shadow-sm space-y-1.5 cursor-pointer"
      onClick={() => {
        setSelectedTask(task);
        setIsDialogOpen(true);
      }}
    >
      <div className="flex items-center gap-2">
        <div {...provided.dragHandleProps} className="text-gray-400">
          <GripVertical className="h-3 w-3" />
        </div>
        <h3 className="text-sm">{task.task}</h3>
      </div>
      {task.daysIgnored >= 7 && task.status !== 'done' && (
        <div className="flex items-center gap-1.5 text-[11px] text-warning">
          <Clock className="h-3 w-3" />
          <span>Ignored for {task.daysIgnored} days</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {COMPANY_ROLES.map(({ role, employee, image }) => (
          <Button
            key={role}
            variant={selectedRole === role ? "default" : "outline"}
            onClick={() => setSelectedRole(role)}
            className="whitespace-nowrap text-sm flex items-center gap-2 h-auto py-1.5"
            size="sm"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={image} alt={employee} />
              <AvatarFallback>{employee.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span>{role}</span>
          </Button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-muted/50 border-l-4 border-warning">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-warning">To Do</CardTitle>
            </CardHeader>
            <Droppable droppableId="todo">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-2 p-2"
                >
                  {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => renderTask(task, provided)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-ocean">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-ocean">In Progress</CardTitle>
            </CardHeader>
            <Droppable droppableId="inProgress">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-2 p-2"
                >
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => renderTask(task, provided)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-primary">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-primary">Follow Up</CardTitle>
            </CardHeader>
            <Droppable droppableId="followUp">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-2 p-2"
                >
                  {followUpTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => renderTask(task, provided)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-success">
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-medium text-success">Done</CardTitle>
            </CardHeader>
            <Droppable droppableId="done">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-2 p-2"
                >
                  {doneTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => renderTask(task, provided)}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>
        </div>
      </DragDropContext>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Follow up with clients
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => setIsDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Task Repetition</h4>
              <Input 
                value="No repeat"
                readOnly
                className="w-full"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Comments</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a comment..."
                  className="flex-1"
                />
                <Button>Add</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Checklist</h4>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add checklist item..."
                  className="flex-1"
                />
                <Button>Add</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Attachments</h4>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click to upload file or photo</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
