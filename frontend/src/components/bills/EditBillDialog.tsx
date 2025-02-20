import { useState, useEffect } from "react";
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { LucideCalendarDays } from "lucide-react";
import { format } from "date-fns";
import validateBillForm from "@/lib/validations/validate_bill_form";
import type { Bill, EditBillDialogProps } from "@/types/bills.types";

export const EditBillDialog: React.FC<EditBillDialogProps> = ({
  bill,
  isOpen,
  setIsOpen,
  onSave,
}) => {
  const [editedBill, setEditedBill] = useState<Bill | null>(null);
  const [errors, setErrors] = useState({
    payee: "",
    amount: "",
    dueDate: "",
    paidOn: "",
  });

  useEffect(() => {
    if (bill) {
      setEditedBill(bill);
      setErrors({ payee: "", amount: "", dueDate: "", paidOn: "" });
    }
  }, [bill]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedBill) return;

    const { isValid, errors } = validateBillForm(editedBill);

    setErrors(errors);

    if (isValid) {
      onSave(editedBill);
      setIsOpen(false);
    }
  };

  if (!editedBill) return null;

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent className="sm:max-w-[425px]">
        <CredenzaHeader>
          <CredenzaTitle className="flex items-center justify-center font-bold">
            <LucideCalendarDays className="me-2 size-5" />
            Edit Bill
          </CredenzaTitle>
          <CredenzaDescription>Update your bill details</CredenzaDescription>
        </CredenzaHeader>
        <form onSubmit={handleSave}>
          <div className="w-11/12 grid gap-4 py-4">
            {/* Payee Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payee" className="text-right">
                Payee
              </Label>
              <div className="col-span-3">
                <Input
                  id="payee"
                  value={editedBill.payee}
                  onChange={(e) =>
                    setEditedBill({ ...editedBill, payee: e.target.value })
                  }
                />
                {errors.payee && (
                  <p className="text-xs text-red-500">{errors.payee}</p>
                )}
              </div>
            </div>
            {/* Amount Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="amount"
                  type="number"
                  value={editedBill.amount}
                  onChange={(e) =>
                    setEditedBill({
                      ...editedBill,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
                {errors.amount && (
                  <p className="text-xs text-red-500">{errors.amount}</p>
                )}
              </div>
            </div>
            {/* Due Date Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <div className="col-span-3">
                <DatePicker
                  date={
                    editedBill.dueDate
                      ? new Date(editedBill.dueDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    setEditedBill({
                      ...editedBill,
                      dueDate: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                />
                {errors.dueDate && (
                  <p className="text-xs text-red-500">{errors.dueDate}</p>
                )}
              </div>
            </div>
            {/* Paid On Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paidOn" className="text-right">
                Paid On
              </Label>
              <div className="col-span-3">
                <DatePicker
                  date={
                    editedBill.paidOn ? new Date(editedBill.paidOn) : undefined
                  }
                  onSelect={(date) =>
                    setEditedBill({
                      ...editedBill,
                      paidOn: date ? format(date, "yyyy-MM-dd") : "",
                      paid: !!date,
                    })
                  }
                />
                {errors.paidOn && (
                  <p className="text-xs text-red-500">{errors.paidOn}</p>
                )}
              </div>
            </div>
            {/* Description Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <div className="col-span-3">
                <Input
                  id="description"
                  value={editedBill.description}
                  onChange={(e) =>
                    setEditedBill({
                      ...editedBill,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            {/* Paid Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paid" className="text-right">
                Paid
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox
                  id="paid"
                  className="w-4 h-4"
                  checked={editedBill.paid}
                  onCheckedChange={(checked) =>
                    setEditedBill({
                      ...editedBill,
                      paid: Boolean(checked),
                      paidOn: checked
                        ? editedBill.paidOn || format(new Date(), "yyyy-MM-dd")
                        : null,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <CredenzaFooter className="w-11/12 mx-auto">
            <Button type="submit">Save Changes</Button>
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
};

export default EditBillDialog;
