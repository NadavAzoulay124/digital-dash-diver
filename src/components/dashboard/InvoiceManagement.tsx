import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Upload, CreditCard, Receipt, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: string;
}

// Mock data for illustration
const mockPayments = [
  { id: 1, client: "TechCorp Inc.", amount: 2500, status: "paid", date: "2024-03-15" },
  { id: 2, client: "Digital Solutions", amount: 1800, status: "pending", date: "2024-03-14" },
  { id: 3, client: "Creative Agency", amount: 3200, status: "paid", date: "2024-03-12" },
];

const mockExpenses = [
  { id: 1, description: "Software Licenses", amount: 299, category: "Tools", date: "2024-03-10" },
  { id: 2, description: "Marketing Tools", amount: 150, category: "Marketing", date: "2024-03-08" },
  { id: 3, description: "Office Supplies", amount: 75, category: "Office", date: "2024-03-05" },
];

const mockFinancialData = [
  { month: 'Jan', income: 4500, expenses: 3200 },
  { month: 'Feb', income: 5200, expenses: 3800 },
  { month: 'Mar', income: 6800, expenses: 4200 },
  { month: 'Apr', income: 7500, expenses: 4500 },
  { month: 'May', income: 8200, expenses: 5100 },
  { month: 'Jun', income: 9000, expenses: 5800 },
];

export const InvoiceManagement = () => {
  const [clientCompany, setClientCompany] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: "" },
  ]);
  const [showPaymentSync, setShowPaymentSync] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: (items.length + 1).toString(),
        description: "",
        quantity: 1,
        price: "",
      },
    ]);
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSendInvoice = () => {
    if (!clientCompany) {
      toast.error("Please enter the client company name");
      return;
    }

    if (items.some((item) => !item.description || !item.price)) {
      toast.error("Please fill in all item details");
      return;
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    toast.success(`Invoice created for ${clientCompany}`);
    console.log({
      clientCompany,
      items,
      total,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      toast.success("Expense receipt uploaded successfully");
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockFinancialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{payment.client}</p>
                    <p className="text-sm text-muted-foreground">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount}</p>
                    <span className={`text-sm ${
                      payment.status === 'paid' ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Recent Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
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
                  <div className="flex items-center gap-2 justify-center p-3 border-2 border-dashed rounded-lg hover:bg-accent">
                    <Upload className="w-4 h-4" />
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
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Create New Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Add items and set prices for the invoice
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="company">Client Company Name</Label>
              <Input
                id="company"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="Enter client company name"
              />
            </div>

            <div className="space-y-4">
              <Label>Invoice Items</Label>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem}>
                Add Item
              </Button>
            </div>

            <Button onClick={handleSendInvoice} className="w-full">
              Send Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
