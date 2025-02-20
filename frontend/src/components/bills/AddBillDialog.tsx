import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import validateBillForm from "@/lib/validations/validate_bill_form";
import { LucideCalendarDays } from "lucide-react";
import type { Bill, BillForm, AddBillDialogProps } from "@/types/bills.types";
import {
    Credenza,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
} from "@/components/ui/credenza";

export const AddBillDialog: React.FC<AddBillDialogProps> = ({ bills, setBills }) => {
    const [newBill, setNewBill] = useState<BillForm>({
        payee: "",
        amount: 0,
        dueDate: "",
        paidOn: null,
        paid: false,
        description: "",
    });
    const [errors, setErrors] = useState({
        payee: "",
        amount: "",
        dueDate: "",
        paidOn: "",
    });
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddBill = async (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors } = validateBillForm(newBill as Bill);
        if (isValid) {
            // Simulate API behavior by adding a temporary id.
            // In production, we call the API and use the returned bill with its id.
            const createdBill: Bill = { ...newBill, id: bills.length + 1 };
            setBills([...bills, createdBill]);
            setNewBill({ payee: "", amount: 0, dueDate: "", paidOn: null, paid: false, description: "" });
            clearErrors();
            setIsAddDialogOpen(false);
        } else {
            setErrors(errors);
        }
    };

    function clearErrors() {
        setErrors({ payee: "", amount: "", dueDate: "", paidOn: "" });
    }

    return (
        <>
            <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className='mr-2 size-4' /> Add Bill
            </Button>
            <Credenza
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}>
                <CredenzaContent className='sm:max-w-[425px]'>
                    <CredenzaHeader>
                        <CredenzaTitle className='flex items-center justify-center font-bold'>
                            <LucideCalendarDays className='me-2 size-5' />
                            Add New Bill
                        </CredenzaTitle>
                        <CredenzaDescription>Create a new bill to track your expenses</CredenzaDescription>
                    </CredenzaHeader>
                    <form onSubmit={handleAddBill}>
                        <div className='w-11/12 grid gap-4 py-4'>
                            {/* Payee Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='payee'
                                    className='text-right'>
                                    Payee
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='payee'
                                        value={newBill.payee}
                                        onChange={(e) => setNewBill({ ...newBill, payee: e.target.value })}
                                    />
                                    {errors.payee && <p className='text-xs text-red-500'>{errors.payee}</p>}
                                </div>
                            </div>
                            {/* Amount Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='amount'
                                    className='text-right'>
                                    Amount
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='amount'
                                        type='text'
                                        value={newBill.amount === 0 ? "" : newBill.amount.toString()} // FIXME: Remove this hack
                                        onChange={(e) =>
                                            setNewBill({
                                                ...newBill,
                                                amount: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                    />
                                    {errors.amount && <p className='text-xs text-red-500'>{errors.amount}</p>}
                                </div>
                            </div>
                            {/* Due Date Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='dueDate'
                                    className='text-right'>
                                    Due Date
                                </Label>
                                <div className='col-span-3'>
                                    <DatePicker
                                        date={newBill.dueDate ? new Date(newBill.dueDate) : undefined}
                                        onSelect={(date) =>
                                            setNewBill({
                                                ...newBill,
                                                dueDate: date ? format(date, "yyyy-MM-dd") : "",
                                                paid: !!date,
                                            })
                                        }
                                    />
                                    {errors.dueDate && <p className='text-xs text-red-500'>{errors.dueDate}</p>}
                                </div>
                            </div>
                            {/* Paid On Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='paidOn'
                                    className='text-right'>
                                    Paid On
                                </Label>
                                <div className='col-span-3'>
                                    <DatePicker
                                        date={newBill.paidOn ? new Date(newBill.paidOn) : undefined}
                                        onSelect={(date) =>
                                            setNewBill({
                                                ...newBill,
                                                paidOn: date ? format(date, "yyyy-MM-dd") : "",
                                                paid: !!date,
                                            })
                                        }
                                    />
                                    {errors.paidOn && <p className='text-xs text-red-500'>{errors.paidOn}</p>}
                                </div>
                            </div>
                            {/* Description Field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='description'
                                    className='text-right'>
                                    Description
                                </Label>
                                <div className='col-span-3'>
                                    <Input
                                        id='description'
                                        value={newBill.description}
                                        onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            {/* Paid field */}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label
                                    htmlFor='paid'
                                    className='text-right'>
                                    Paid
                                </Label>
                                <div className='col-span-3 flex items-center'>
                                    <Checkbox
                                        id='paid'
                                        className='w-4 h-4'
                                        checked={newBill.paid}
                                        onCheckedChange={(checked) =>
                                            setNewBill({ ...newBill, paid: Boolean(checked) })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <CredenzaFooter className='w-11/12 mx-auto'>
                            <Button type='submit'>
                                <Plus className='me-2 size-4' /> Add Bill
                            </Button>
                            <CredenzaClose asChild>
                                <Button
                                    variant='outline'
                                    onClick={() => clearErrors()}>
                                    Cancel
                                </Button>
                            </CredenzaClose>
                        </CredenzaFooter>
                    </form>
                </CredenzaContent>
            </Credenza>
        </>
    );
};

export default AddBillDialog;
