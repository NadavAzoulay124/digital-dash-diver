
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Task } from "@/data/mockTasks";
import { RoleSelector, CompanyRole } from "./RoleSelector";
import { TaskDialog } from "./TaskDialog";
import { TaskItem } from "./TaskItem";

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

  return (
    <div className="p-6">
      <RoleSelector 
        selectedRole={selectedRole}
        onRoleSelect={setSelectedRole}
      />

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
                      {(provided) => (
                        <TaskItem
                          task={task}
                          provided={provided}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDialogOpen(true);
                          }}
                        />
                      )}
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
                      {(provided) => (
                        <TaskItem
                          task={task}
                          provided={provided}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDialogOpen(true);
                          }}
                        />
                      )}
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
                      {(provided) => (
                        <TaskItem
                          task={task}
                          provided={provided}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDialogOpen(true);
                          }}
                        />
                      )}
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
                      {(provided) => (
                        <TaskItem
                          task={task}
                          provided={provided}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDialogOpen(true);
                          }}
                        />
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

      <TaskDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={selectedTask}
      />
    </div>
  );
};
