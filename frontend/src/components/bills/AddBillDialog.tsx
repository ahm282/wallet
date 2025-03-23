import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { LucideCalendarDays } from "lucide-react";
import {
    Credenza,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
} from "@/components/ui/credenza";
import validateBillForm from "@/lib/validations/validate_bill_form";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { BillForm, AddBillDialogProps, BillFormLocal } from "@/types/bills.types";

export const AddBillDialog: React.FC<AddBillDialogProps> = ({ createBillMutation }) => {
    // If possible, prefer having newBill typed as BillFormLocal.
    const [newBill, setNewBill] = useState<BillFormLocal>({
        payee: "",
        amount: "",
        dueDate: "",
        paidOn: undefined,
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

    // Hook to determine if we're on desktop.
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const clearErrors = () => {
        setErrors({ payee: "", amount: "", dueDate: "", paidOn: "" });
    };

    const handleAddBill = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert the amount from string to number before validating/submission.
        const billToSubmit: BillForm = {
            ...newBill,
            amount: Number(newBill.amount),
        };

        const { isValid, errors } = validateBillForm(billToSubmit);

        if (isValid) {
            createBillMutation?.mutate(billToSubmit);

            setNewBill({
                payee: "",
                amount: "",
                dueDate: "",
                paidOn: undefined,
                paid: false,
                description: "",
            } as any); // Cast if necessary if types differ

            clearErrors();
            setIsAddDialogOpen(false);
        } else {
            setErrors(errors);
        }
    };

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
                        <CredenzaTitle className='flex items-center justify-center md:justify-start font-bold'>
                            <LucideCalendarDays className='size-5 me-2' />
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
                                        // Use "text" on desktop for freeform editing, "number" on mobile.
                                        type={isDesktop ? "text" : "number"}
                                        value={Number(newBill.amount) === 0 ? "" : newBill.amount.toString()}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Allow an empty value to let the user clear the field.
                                            setNewBill({ ...newBill, amount: value });
                                        }}
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
                                        date={newBill.dueDate ? new Date(Number(newBill.dueDate)) : undefined}
                                        onSelect={(date) =>
                                            setNewBill({
                                                ...newBill,
                                                dueDate: date ? date.getTime().toString() : "",
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
                                        date={newBill.paidOn ? new Date(Number(newBill.paidOn)) : undefined}
                                        onSelect={(date) =>
                                            setNewBill({
                                                ...newBill,
                                                paidOn: date ? date.getTime().toString() : "",
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
                            {/* Paid Checkbox */}
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
                                    onClick={() => {}}>
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
