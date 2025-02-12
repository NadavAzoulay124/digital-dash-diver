
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, Upload, Download } from "lucide-react";
import { toast } from "sonner";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface ExpensesCardProps {
  expenses: Expense[];
}

export const ExpensesCard = ({ expenses }: ExpensesCardProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      toast.success("Expense receipt uploaded successfully");
    }
  };

  const handleDownloadExpenses = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...expenses.map(expense => 
        [
          expense.date,
          expense.description,
          expense.category,
          `$${expense.amount}`
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `agency-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Expenses report downloaded successfully");
  };

  return (
    <Card className="bg-gradient-to-br from-success/5 to-warning/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-success" />
            Recent Expenses
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-success hover:border-success hover:bg-success/10 transition-colors"
            onClick={handleDownloadExpenses}
          >
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-success/10 hover:border-success/20 transition-colors"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-muted-foreground">{expense.category} • {expense.date}</p>
              </div>
              <p className="font-semibold">${expense.amount}</p>
            </div>
          ))}
          <div className="pt-4">
            <Label htmlFor="expense-upload" className="cursor-pointer">
              <div className="flex items-center gap-2 justify-center p-3 border-2 border-dashed border-success/20 rounded-lg hover:bg-success/5 transition-colors">
                <Upload className="w-4 h-4 text-success" />
                Upload Receipt
              </div>
              <Input
                id="expense-upload"
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
              />
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
