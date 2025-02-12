
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { Task } from "@/data/mockTasks";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const TaskDialog = ({ isOpen, onOpenChange, task }: TaskDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            Follow up with clients
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onOpenChange(false)}
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
  );
};
