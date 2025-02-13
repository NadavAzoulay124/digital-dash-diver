
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/data/mockTasks";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const TaskDialog = ({ isOpen, onOpenChange, task }: TaskDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
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
        
        <ScrollArea className="flex-grow pr-4 h-[calc(85vh-8rem)]">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Task Repetition</h4>
              <Select defaultValue="no-repeat">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select repetition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-repeat">No repeat</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom dates</SelectItem>
                </SelectContent>
              </Select>
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
