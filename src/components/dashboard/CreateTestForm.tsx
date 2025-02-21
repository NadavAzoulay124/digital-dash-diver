
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ABTest } from "./types";

interface CreateTestFormProps {
  newTest: Omit<ABTest, "id" | "startDate" | "status" | "results">;
  setNewTest: (test: Omit<ABTest, "id" | "startDate" | "status" | "results">) => void;
  onCreateTest: () => void;
}

export const CreateTestForm = ({ newTest, setNewTest, onCreateTest }: CreateTestFormProps) => {
  const { toast } = useToast();

  const getPlaceholderText = (type: ABTest["testType"]) => {
    switch (type) {
      case "campaign":
        return {
          variantA: "Original Campaign",
          variantB: "New Campaign",
        };
      case "ad_group":
        return {
          variantA: "Original Ad Group",
          variantB: "New Ad Group",
        };
      case "ad":
        return {
          variantA: "Original Ad",
          variantB: "New Ad",
        };
      case "budget":
        return {
          variantA: "Original Budget",
          variantB: "New Budget",
        };
    }
  };

  const handleCreate = () => {
    if (!newTest.campaignName || !newTest.variantA || !newTest.variantB || !newTest.testType) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onCreateTest();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New A/B Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select
                value={newTest.testType}
                onValueChange={(value: ABTest["testType"]) => {
                  setNewTest({
                    ...newTest,
                    testType: value,
                    variantA: "",
                    variantB: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="ad_group">Ad Group</SelectItem>
                  <SelectItem value="ad">Ad</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="Campaign Name"
                value={newTest.campaignName}
                onChange={(e) => setNewTest({ ...newTest, campaignName: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Variant A</Label>
              <Input
                placeholder={getPlaceholderText(newTest.testType).variantA}
                value={newTest.variantA}
                onChange={(e) => setNewTest({ ...newTest, variantA: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Variant B</Label>
              <Input
                placeholder={getPlaceholderText(newTest.testType).variantB}
                value={newTest.variantB}
                onChange={(e) => setNewTest({ ...newTest, variantB: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create A/B Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
