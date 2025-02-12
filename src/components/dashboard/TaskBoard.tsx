
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Task } from "@/data/mockTasks";
import { GripVertical } from "lucide-react";

const COMPANY_ROLES = [
  "Campaign Manager",
  "Designer",
  "Customer Manager",
  "Social Media Manager",
  "Content Strategist"
] as const;

type CompanyRole = typeof COMPANY_ROLES[number];

interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard = ({ tasks }: TaskBoardProps) => {
  const [selectedRole, setSelectedRole] = useState<CompanyRole>("Campaign Manager");
  const [localTasks, setLocalTasks] = useState(tasks);

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

  return (
    <div className="p-6">
      <div className="mb-6">
        <Select value={selectedRole} onValueChange={(value: CompanyRole) => setSelectedRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 min-h-[600px] overflow-x-auto pb-4">
          <Card className="bg-muted/50 border-l-4 border-warning flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle className="text-lg text-warning">To Do</CardTitle>
            </CardHeader>
            <Droppable droppableId="todo">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-background p-3 rounded-lg shadow-sm flex items-center gap-2"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-400">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium">{task.task}</h3>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-ocean flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle className="text-lg text-ocean">In Progress</CardTitle>
            </CardHeader>
            <Droppable droppableId="inProgress">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-background p-3 rounded-lg shadow-sm flex items-center gap-2"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-400">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium">{task.task}</h3>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-primary flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Follow Up</CardTitle>
            </CardHeader>
            <Droppable droppableId="followUp">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {followUpTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-background p-3 rounded-lg shadow-sm flex items-center gap-2"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-400">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium">{task.task}</h3>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>

          <Card className="bg-muted/50 border-l-4 border-success flex-1 min-w-[300px]">
            <CardHeader>
              <CardTitle className="text-lg text-success">Done</CardTitle>
            </CardHeader>
            <Droppable droppableId="done">
              {(provided) => (
                <CardContent 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {doneTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-background p-3 rounded-lg shadow-sm flex items-center gap-2"
                        >
                          <div {...provided.dragHandleProps} className="text-gray-400">
                            <GripVertical className="h-4 w-4" />
                          </div>
                          <h3 className="font-medium">{task.task}</h3>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </CardContent>
              )}
            </Droppable>
          </Card>
        </div>
      </DragDropContext>
    </div>
  );
};
