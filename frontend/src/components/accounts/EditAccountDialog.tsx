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
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";
import validateAccountForm from "@/lib/validations/validate_account_form";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Account, EditAccountDialogProps } from "@/types/accounts.types";
import type { EditAccountFormLocal } from "@/types/accounts.types";

export const EditAccountDialog: React.FC<EditAccountDialogProps> = ({ account, isOpen, setIsOpen, onSave }) => {
    const [editedAccount, setEditedAccount] = useState<EditAccountFormLocal | null>(null);
    const [errors, setErrors] = useState({
        name: "",
        institution: "",
        balance: "",
        currency: "",
    });

    // Determine if we're on desktop (width >= 768px).
    const isDesktop = useMediaQuery("(min-width: 768px)");

    useEffect(() => {
        if (account) {
            setEditedAccount({
                ...account,
                balance: account!.balance!.toString(), // Convert number to string for editing
            });
            setErrors({ name: "", institution: "", balance: "", currency: "" });
        }
    }, [account]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editedAccount) return;

        // Convert the edited balance back to a number.
        const accountToSubmit: Account = {
            ...editedAccount,
            balance: Number(editedAccount.balance),
        };

        const { isValid, errors } = validateAccountForm(accountToSubmit);
        setErrors(errors);

        if (isValid) {
            onSave(accountToSubmit);
            setIsOpen(false);
        }
    };

    if (!editedAccount) return null;

    return (
        <Credenza
            open={isOpen}
            onOpenChange={setIsOpen}>
            <CredenzaContent className='sm:max-w-[425px]'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center justify-center md:justify-start'>
                        <Wallet className='size-5 me-2' />
                        Edit Account
                    </CredenzaTitle>
                    <CredenzaDescription>Update your account details</CredenzaDescription>
                </CredenzaHeader>
                <form onSubmit={handleSave}>
                    <div className='w-11/12 grid gap-4 py-4'>
                        {/* Name Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='name'
                                className='text-right'>
                                Name
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='name'
                                    value={editedAccount.name}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, name: e.target.value })}
                                />
                                {errors.name && <p className='text-xs text-red-500'>{errors.name}</p>}
                            </div>
                        </div>
                        {/* Institution Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='institution'
                                className='text-right'>
                                Institution
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='institution'
                                    value={editedAccount.institution}
                                    onChange={(e) =>
                                        setEditedAccount({ ...editedAccount, institution: e.target.value })
                                    }
                                />
                                {errors.institution && <p className='text-xs text-red-500'>{errors.institution}</p>}
                            </div>
                        </div>
                        {/* Balance Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='balance'
                                className='text-right'>
                                Balance
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='balance'
                                    type={isDesktop ? "text" : "number"}
                                    value={editedAccount.balance}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, balance: e.target.value })}
                                />
                                {errors.balance && <p className='text-xs text-red-500'>{errors.balance}</p>}
                            </div>
                        </div>
                        {/* Currency Field */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label
                                htmlFor='currency'
                                className='text-right'>
                                Currency
                            </Label>
                            <div className='col-span-3'>
                                <Input
                                    id='currency'
                                    value={editedAccount.currency}
                                    onChange={(e) => setEditedAccount({ ...editedAccount, currency: e.target.value })}
                                />
                                {errors.currency && <p className='text-xs text-red-500'>{errors.currency}</p>}
                            </div>
                        </div>
                    </div>
                    <CredenzaFooter className='w-11/12 mx-auto'>
                        <Button type='submit'>Save Changes</Button>
                        <CredenzaClose asChild>
                            <Button variant='outline'>Cancel</Button>
                        </CredenzaClose>
                    </CredenzaFooter>
                </form>
            </CredenzaContent>
        </Credenza>
    );
};

export default EditAccountDialog;
