
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
import { Task } from "@/data/mockTasks";

const EMPLOYEE_ROLES = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson"
] as const;

type EmployeeRole = typeof EMPLOYEE_ROLES[number];

interface TaskBoardProps {
  tasks: Task[];
}

export const TaskBoard = ({ tasks }: TaskBoardProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRole>("John Doe");

  const filteredTasks = tasks.filter(task => task.employee === selectedEmployee);
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'inProgress');
  const followUpTasks = filteredTasks.filter(task => task.status === 'followUp');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <div className="p-6">
      <div className="mb-6">
        <Select value={selectedEmployee} onValueChange={(value: EmployeeRole) => setSelectedEmployee(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEE_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-muted/50 border-l-4 border-warning">
          <CardHeader>
            <CardTitle className="text-lg text-warning">To Do</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todoTasks.map(task => (
              <div key={task.id} className="bg-background p-3 rounded-lg shadow-sm">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-muted-foreground">Last updated: {task.lastUpdated}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-l-4 border-ocean">
          <CardHeader>
            <CardTitle className="text-lg text-ocean">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inProgressTasks.map(task => (
              <div key={task.id} className="bg-background p-3 rounded-lg shadow-sm">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-muted-foreground">Last updated: {task.lastUpdated}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-l-4 border-primary">
          <CardHeader>
            <CardTitle className="text-lg text-primary">Follow Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {followUpTasks.map(task => (
              <div key={task.id} className="bg-background p-3 rounded-lg shadow-sm">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-muted-foreground">Last updated: {task.lastUpdated}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-muted/50 border-l-4 border-success">
          <CardHeader>
            <CardTitle className="text-lg text-success">Done</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {doneTasks.map(task => (
              <div key={task.id} className="bg-background p-3 rounded-lg shadow-sm">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-muted-foreground">Last updated: {task.lastUpdated}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
