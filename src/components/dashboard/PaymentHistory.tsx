
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface Payment {
  id: number;
  client: string;
  amount: number;
  status: string;
  date: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export const PaymentHistory = ({ payments }: PaymentHistoryProps) => {
  return (
    <Card className="bg-gradient-to-br from-ocean/5 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-ocean" />
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-ocean/10 hover:border-ocean/20 transition-colors"
            >
              <div>
                <p className="font-medium">{payment.client}</p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${payment.amount}</p>
                <span className={`text-sm ${
                  payment.status === 'paid' ? 'text-success' : 'text-warning'
                }`}>
                  {payment.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
