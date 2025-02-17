
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lead, LeadComment } from "./types";

interface LeadCommentsProps {
  lead: Lead;
  onAddComment: (leadId: string, comment: string, category: LeadComment["category"]) => void;
}

export const LeadComments = ({ lead, onAddComment }: LeadCommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LeadComment["category"]>("other");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    onAddComment(lead.id, newComment, selectedCategory);
    setNewComment("");
    setSelectedCategory("other");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {lead.comments.length > 0 ? `${lead.comments.length} Comments` : "Add Comment"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Enter your comment..."
              className="min-h-[100px]"
            />
            <Select
              value={selectedCategory}
              onValueChange={(value: LeadComment["category"]) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distance Issue</SelectItem>
                <SelectItem value="scheduling">Scheduling Problem</SelectItem>
                <SelectItem value="pricing">Pricing Concern</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAddComment}
              className="w-full"
            >
              Add Comment
            </Button>
          </div>
          {lead.comments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Previous Comments</h4>
              <div className="space-y-2">
                {lead.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="text-sm p-2 bg-muted rounded-md"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <Badge>{comment.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p>{comment.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
