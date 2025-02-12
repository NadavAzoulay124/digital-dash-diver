
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
import { DollarSign } from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: string;
}

export const CreateInvoiceDialog = () => {
  const [clientCompany, setClientCompany] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, price: "" },
  ]);

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-gradient-to-r from-primary to-ocean text-white hover:opacity-90">
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
              className="border-primary/20 focus:border-primary"
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
                    className="border-primary/20 focus:border-primary"
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
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    className="border-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            ))}
            <Button 
              type="button" 
              variant="outline" 
              onClick={addItem}
              className="border-primary hover:bg-primary/10"
            >
              Add Item
            </Button>
          </div>

          <Button 
            onClick={handleSendInvoice} 
            className="w-full bg-gradient-to-r from-primary to-ocean hover:opacity-90"
          >
            Send Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
