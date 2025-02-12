
import { FinancialOverview } from "./FinancialOverview";
import { PaymentHistory } from "./PaymentHistory";
import { ExpensesCard } from "./ExpensesCard";
import { CreateInvoiceDialog } from "./CreateInvoiceDialog";

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
  return (
    <div className="space-y-8">
      <FinancialOverview data={mockFinancialData} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PaymentHistory payments={mockPayments} />
        <ExpensesCard expenses={mockExpenses} />
      </div>

      <CreateInvoiceDialog />
    </div>
  );
};
