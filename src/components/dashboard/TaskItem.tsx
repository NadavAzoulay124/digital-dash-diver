
import { Clock, GripVertical } from "lucide-react";
import { Task } from "@/data/mockTasks";

interface TaskItemProps {
  task: Task;
  provided: any;
  onClick: () => void;
}

export const TaskItem = ({ task, provided, onClick }: TaskItemProps) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="bg-background p-2 rounded-lg shadow-sm space-y-1.5 cursor-pointer"
      onClick={onClick}
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
};
